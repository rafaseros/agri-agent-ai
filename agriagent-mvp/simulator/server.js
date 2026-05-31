// ---------------------------------------------------------------------------
// AgriAgent — Edge Sync server.
//
// Consolidates three sources into a single payload for the dashboard:
//   1. The (simulated) ESP32 soil sensor          -> sensorData.js
//   2. Live weather for Santa Cruz (Open-Meteo)    -> agentLogic.js
//   3. The agent's irrigation decision (Vertex AI) -> agentLogic.js
// Plus a frozen 7-day diesel-savings series for the chart.
// ---------------------------------------------------------------------------

import express from 'express';
import cors from 'cors';

import { readSensor } from './sensorData.js';
import { fetchWeather, decideIrrigationAI, describeWeatherCode } from './agentLogic.js';
import { dieselHistory, totalDieselSaved } from './dieselHistory.js';

const PORT = 3001;

const app = express();

// CORS is required: the Vite dev server and this API are different origins,
// and the frontend calls the absolute URL directly.
app.use(cors());

// Remember the last pump state so the sensor's moisture drift is coherent
// across polls (irrigating raises moisture, idle lets it dry out).
let pumpOn = false;

app.get('/api/status', async (req, res) => {
  try {
    const weather = await fetchWeather();
    const sensor = readSensor(pumpOn);

    // The agent (Gemini on Vertex AI) makes the call. decideIrrigationAI never
    // throws — it returns a safe fallback if Google Cloud fails — so the
    // endpoint stays up regardless.
    const ai = await decideIrrigationAI({
      soilMoisture: sensor.soilMoisture,
      weather,
    });

    pumpOn = ai.decision === 'ON';

    res.json({
      location: 'Santa Cruz de la Sierra, Bolivia',
      timestamp: new Date().toISOString(),
      sensor: {
        soilMoisture: sensor.soilMoisture,
        pumpStatus: pumpOn ? 'ON' : 'OFF',
      },
      weather: {
        temperature: weather.temperature,
        windspeed: weather.windspeed,
        weathercode: weather.weathercode,
        condition: describeWeatherCode(weather.weathercode),
      },
      // `decision`/`reasoning` are the raw Vertex AI output. `action`/`reason`/
      // `pumpOn`/`dieselSaved` keep the Phase 2 dashboard working unchanged.
      decision: {
        decision: ai.decision,
        reasoning: ai.reasoning,
        action: pumpOn ? 'Encender Bomba' : 'Apagar Bomba',
        reason: ai.reasoning,
        pumpOn,
        dieselSaved: !pumpOn,
      },
      dieselHistory,
      totalDieselSaved,
    });
  } catch (err) {
    // Open-Meteo (not Vertex) failure — surface a clean 502 so the dashboard
    // shows its error state instead of a blank card.
    console.error('[/api/status] error:', err.message);
    res.status(502).json({ error: 'No se pudo obtener el estado del agente', detail: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ service: 'AgriAgent Edge Sync', status: 'ok', endpoint: '/api/status' });
});

app.listen(PORT, () => {
  console.log(`🌾 AgriAgent simulator escuchando en http://localhost:${PORT}`);
  console.log(`   Agente: Vertex AI · Gemini 2.5 Flash`);
  console.log(`   Estado: http://localhost:${PORT}/api/status`);
});
