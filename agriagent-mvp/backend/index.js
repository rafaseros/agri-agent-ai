const functions = require('@google-cloud/functions-framework');
const { VertexAI } = require('@google-cloud/vertexai');
const { BigQuery } = require('@google-cloud/bigquery');

const PROJECT_ID = 'agriagent-hackathon-2026';
const LOCATION = 'us-central1';
const MODEL = 'gemini-2.5-flash';

const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
const generativeModel = vertexAI.getGenerativeModel({
    model: MODEL,
    generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
});

const bigquery = new BigQuery();

const WEATHER_LABELS = {
    0: 'Cielo despejado', 1: 'Mayormente despejado', 2: 'Parcialmente nublado',
    3: 'Nublado', 51: 'Llovizna', 61: 'Lluvia ligera', 65: 'Lluvia fuerte', 95: 'Tormenta'
};
const describeWeatherCode = (code) => WEATHER_LABELS[code] ?? 'Condición variable';

functions.http('helloHttp', async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'GET, POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.status(204).send('');
        return;
    }

    // Modo histórico: el dashboard de Analítica lee las últimas filas de BigQuery.
    // (El frontend no puede consultar BigQuery directo; la función corre la query.)
    if (req.method === 'GET' && req.query && req.query.modo === 'historial') {
        try {
            const [rows] = await bigquery.query({
                query: `SELECT fecha_hora, sensor_id, cultivo, humedad_superficie, humedad_profunda, estado_red, decision_ia
                        FROM \`agriagent-hackathon-2026.agriagent_data.historial_riego\`
                        ORDER BY fecha_hora DESC
                        LIMIT 200`,
            });
            res.status(200).json({ historial: rows });
        } catch (e) {
            console.error('Error BQ historial:', e.message);
            res.status(200).json({ historial: [] });
        }
        return;
    }

    try {
        // 1. Extracción segura (Soporta si req.body es undefined o string)
        let data = {};
        if (req.method === 'POST' && req.body) {
            data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        } else {
            data = req.query || {};
        }

        const isOnline = data.conexion_activa !== 'false' && data.conexion_activa !== false;
        const hum_sup = data.humedad_superficie || "45";
        const hum_prof = data.humedad_profunda || "60";
        const tiempo_desconexion = data.minutos_desconectado || 0;
        const cultivo = data.cultivo || "Soya";
        const sensor_id = data.sensor_id || "S-TEST-01";
        const hectareas = data.hectareas || 50;

        // 2. Fetch de Clima con Optional Chaining (?.) para evitar crasheos si la API falla
        const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?latitude=-17.7863&longitude=-63.1812&current_weather=true&daily=precipitation_sum,precipitation_probability_max&timezone=America/La_Paz`;
        let climaTxt = "Clima desconocido";
        let pronosticoTxt = "Pronóstico no disponible";

        try {
            const weatherRes = await fetch(WEATHER_URL);
            const weatherData = await weatherRes.json();
            if (weatherData.current_weather) {
                climaTxt = `${weatherData.current_weather.temperature}°C, ${describeWeatherCode(weatherData.current_weather.weathercode)}`;
            }
            if (weatherData.daily) {
                const lluvia_manana = weatherData.daily.precipitation_sum?.[1] || 0;
                const prob_lluvia_manana = weatherData.daily.precipitation_probability_max?.[1] || 0;
                pronosticoTxt = `Mañana: ${lluvia_manana}mm (${prob_lluvia_manana}% prob).`;
            }
        } catch (wError) {
            console.error('Error al obtener clima:', wError.message);
        }

        // 3. Prompt — enfoque: optimización del recurso hídrico y rendimiento del cultivo.
        let prompt = "";
        if (!isOnline) {
            prompt = `Agente Autónomo. Alerta: Pérdida de señal hace ${tiempo_desconexion} min en sensor ${sensor_id}. Lote: ${hectareas} hectáreas de ${cultivo}. Clima: ${climaTxt}. Por protocolo de seguridad, ¿encendemos bomba? Responde SOLO JSON: {"decision": "OFF", "reasoning": "explicación breve"}`;
        } else {
            prompt = `Agente Autónomo. Sensor ${sensor_id} activo en lote de ${hectareas} hectáreas de ${cultivo}. Humedad sup: ${hum_sup}%. Humedad prof: ${hum_prof}%. Clima: ${climaTxt}. PRONÓSTICO: ${pronosticoTxt}. Optimiza el recurso hídrico: regar ${hectareas} ha consume mucha agua. Si llueve mañana y la raíz aguanta, no riegues para no desperdiciar agua ni ahogar el cultivo. ¿Encendemos bomba? Responde SOLO JSON: {"decision": "ON" o "OFF", "reasoning": "Justificación"}`;
        }

        // 4. IA con Parseo Protegido
        let parsed = { decision: "OFF", reasoning: "Error leyendo IA" };
        try {
            const result = await generativeModel.generateContent(prompt);
            let text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
            text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if(firstBrace !== -1 && lastBrace !== -1) { text = text.substring(firstBrace, lastBrace + 1); }
            parsed = JSON.parse(text);
        } catch (aiError) {
            console.error('Error con VertexAI:', aiError.message);
        }

        const estado_red_actual = isOnline ? "ONLINE" : `OFFLINE (${tiempo_desconexion}m)`;

        // 5. Inserción Segura en BigQuery
        try {
            const num_sup = isNaN(Number(hum_sup)) ? null : Number(hum_sup);
            const num_prof = isNaN(Number(hum_prof)) ? null : Number(hum_prof);
            const num_has = isNaN(Number(hectareas)) ? null : Number(hectareas);

            const rowToInsert = {
                fecha_hora: new Date().toISOString(),
                sensor_id: String(sensor_id),
                cultivo: String(cultivo),
                hectareas: num_has,
                humedad_superficie: num_sup,
                humedad_profunda: num_prof,
                estado_red: estado_red_actual,
                decision_ia: parsed.decision || "OFF",
                razonamiento: parsed.reasoning || "Sin razón"
            };
            await bigquery.dataset('agriagent_data').table('historial_riego').insert([rowToInsert]);
        } catch (bqError) {
            // Convertimos el error completo a texto para que Google Cloud no lo oculte
            console.error('Error BQ Detallado:', JSON.stringify(bqError.errors || bqError));
        }

        // 6. Respuesta Exitosa
        res.status(200).json({
            estado_red: estado_red_actual,
            lote: { sensor: sensor_id, cultivo: cultivo, hectareas: hectareas },
            sensor: { superficie: hum_sup, profunda: hum_prof },
            clima: { actual: climaTxt, pronostico: pronosticoTxt },
            agente: { decision: parsed.decision, reasoning: parsed.reasoning }
        });

    } catch (err) {
        console.error('Error fatal servidor:', err.stack);
        // Fallback que mantiene a React vivo
        res.status(500).json({
            estado_red: "ERROR",
            lote: { sensor: "Error", cultivo: "Error", hectareas: 0 },
            sensor: { superficie: 0, profunda: 0 },
            clima: { actual: "Error", pronostico: "Error" },
            agente: { decision: 'OFF', reasoning: 'Error interno del servidor, bomba apagada.' }
        });
    }
});
