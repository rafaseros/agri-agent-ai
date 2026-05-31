// ---------------------------------------------------------------------------
// AgriAgent — irrigation decision engine (Edge Sync brain).
//
// The decision is now made by Gemini 1.5 Flash on Vertex AI: it crosses the
// live Open-Meteo weather for Santa Cruz with the ESP32 soil-moisture reading
// and returns whether to run the diesel pump. The previous rule-based policy
// (decideIrrigation, below) is kept as a documented, testable local fallback.
// ---------------------------------------------------------------------------

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { VertexAI } from '@google-cloud/vertexai';

// --- Google Cloud credentials (ESM-safe) ----------------------------------
// ESM has no __dirname and no require('./x.json'); we reconstruct both from
// import.meta.url and read the key file with fs. Setting
// GOOGLE_APPLICATION_CREDENTIALS lets the Vertex SDK pick up the service
// account via Application Default Credentials.
const __dirname = dirname(fileURLToPath(import.meta.url));
const KEY_PATH = resolve(__dirname, 'gcp-key.json');
process.env.GOOGLE_APPLICATION_CREDENTIALS = KEY_PATH;

const { project_id: PROJECT_ID } = JSON.parse(readFileSync(KEY_PATH, 'utf8'));

// Spec asked for gemini-1.5-flash, but that model (and 2.0-flash) is retired
// in this project/region — Vertex returns 404 NOT_FOUND. Verified live that
// gemini-2.5-flash responds with these credentials in us-central1.
const MODEL = 'gemini-2.5-flash';
const LOCATION = 'us-central1';

const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
const generativeModel = vertexAI.getGenerativeModel({
  model: MODEL,
  // Ask Vertex for raw JSON so we don't have to fight markdown fences, and keep
  // temperature low so the agronomic decision is stable, not creative.
  generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
});

// Safe contingency: if Google Cloud fails, the pump stays OFF (fail-safe — we
// never burn diesel on a guess) and the dashboard still renders.
const FALLBACK = {
  decision: 'OFF',
  reasoning: 'Error de conexión, bomba apagada por seguridad',
};

// --- Weather ---------------------------------------------------------------
// Santa Cruz de la Sierra, Bolivia.
const LATITUDE = -17.7863;
const LONGITUDE = -63.1812;
const WEATHER_URL =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LATITUDE}&longitude=${LONGITUDE}&current_weather=true`;

const WEATHER_LABELS = {
  0: 'Cielo despejado',
  1: 'Mayormente despejado',
  2: 'Parcialmente nublado',
  3: 'Nublado',
  45: 'Niebla',
  48: 'Niebla con escarcha',
  51: 'Llovizna ligera',
  53: 'Llovizna moderada',
  55: 'Llovizna intensa',
  61: 'Lluvia ligera',
  63: 'Lluvia moderada',
  65: 'Lluvia fuerte',
  80: 'Chubascos ligeros',
  81: 'Chubascos moderados',
  82: 'Chubascos violentos',
  95: 'Tormenta eléctrica',
  96: 'Tormenta con granizo',
  99: 'Tormenta fuerte con granizo',
};

export const describeWeatherCode = (code) =>
  WEATHER_LABELS[code] ?? 'Condición desconocida';

/**
 * Fetch current weather for Santa Cruz from Open-Meteo.
 * Throws on network/HTTP failure so the caller can surface a clear error.
 *
 * @returns {Promise<{ temperature: number, windspeed: number, weathercode: number }>}
 */
export async function fetchWeather() {
  const res = await fetch(WEATHER_URL);
  if (!res.ok) {
    throw new Error(`Open-Meteo respondió ${res.status}`);
  }
  const data = await res.json();
  const current = data.current_weather;
  if (!current) {
    throw new Error('Respuesta de Open-Meteo sin current_weather');
  }
  return {
    temperature: current.temperature,
    windspeed: current.windspeed,
    weathercode: current.weathercode,
  };
}

// --- Vertex AI agent -------------------------------------------------------

/**
 * Ask Gemini whether to run the pump, given soil moisture + current weather.
 *
 * Always resolves to a valid { decision: 'ON'|'OFF', reasoning } object — any
 * Vertex/parse failure returns FALLBACK so the endpoint never throws and the
 * dashboard never goes blank.
 *
 * @param {object} input
 * @param {number} input.soilMoisture  simulated ESP32 reading (%)
 * @param {{ temperature:number, windspeed:number, weathercode:number }} input.weather
 * @returns {Promise<{ decision: 'ON'|'OFF', reasoning: string }>}
 */
export async function decideIrrigationAI({ soilMoisture, weather }) {
  const clima = `${weather.temperature}°C, ${describeWeatherCode(weather.weathercode)}, viento ${weather.windspeed} km/h`;

  // Exact prompt per spec, with {HUMEDAD} and {CLIMA_OPEN_METEO} filled in.
  const prompt =
    `Eres un Agente Agrícola Autónomo experto en el Norte Integrado de Santa Cruz, Bolivia. ` +
    `El litro de diésel cuesta 11 Bs. Tu objetivo es minimizar el uso de la bomba de agua para ahorrar ` +
    `combustible, asegurando que el cultivo no muera. Datos actuales -> Humedad del suelo: ${soilMoisture}%. ` +
    `Clima actual: ${clima}. ¿Debemos encender la bomba ahora? Responde estrictamente con un JSON válido ` +
    `sin formato markdown, con las claves 'decision' ("ON" o "OFF") y 'reasoning' (Explicación de máximo ` +
    `20 palabras justificando el ahorro de diésel).`;

  try {
    const result = await generativeModel.generateContent(prompt);
    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Defensive cleanup: strip ```json fences in case the model ignores
    // responseMimeType and wraps the JSON in markdown anyway.
    const clean = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);

    const decision = parsed.decision === 'ON' ? 'ON' : 'OFF';
    const reasoning = typeof parsed.reasoning === 'string' ? parsed.reasoning : FALLBACK.reasoning;
    return { decision, reasoning };
  } catch (err) {
    console.error('[Vertex AI] decisión falló, usando contingencia:', err.message);
    return { ...FALLBACK };
  }
}

// --- Local rule-based fallback (Phase 1, kept for offline/testing) ---------
const DRY_SOIL_PCT = 40;
const RAIN_CODES = new Set([
  51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99,
]);

export const isRainExpected = (code) => RAIN_CODES.has(Number(code));

/**
 * Deterministic policy used before the Vertex integration. Not wired into the
 * endpoint anymore, but kept pure and exported for tests / offline fallback.
 */
export function decideIrrigation({ soilMoisture, weathercode }) {
  if (isRainExpected(weathercode)) {
    return { decision: 'OFF', reasoning: `Lluvia pronosticada (${describeWeatherCode(weathercode)}); se pospone el riego.` };
  }
  if (soilMoisture < DRY_SOIL_PCT) {
    return { decision: 'ON', reasoning: `Suelo seco (${soilMoisture}%) y sin lluvia; riego de precisión.` };
  }
  return { decision: 'OFF', reasoning: `Humedad suficiente (${soilMoisture}%); no hace falta regar.` };
}
