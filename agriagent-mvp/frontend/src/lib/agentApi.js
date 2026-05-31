import { normalizeStatus } from './normalizeStatus.js';

// Production agent on Cloud Run (serverless).
const STATUS_URL =
  'https://agriagent-cerebro-455757636530.us-central1.run.app/api/status';

// Build the POST body the backend expects from a sensor in the store.
export const sensorToBody = (s) => ({
  sensor_id: s.id,
  cultivo: s.cultivo,
  hectareas: s.hectareas,
  humedad_superficie: s.humedad_superficie,
  humedad_profunda: s.humedad_profunda,
  conexion_activa: s.conexion_activa,
  minutos_desconectado: s.minutos_desconectado,
});

/**
 * POST one sensor's state to the agent and return the normalized decision.
 * Throws on network/HTTP failure so callers can decide how to degrade.
 *
 * Every request is logged to the browser console (collapsed group) with the
 * body sent, the raw response, the HTTP status and the round-trip time — open
 * DevTools → Console to review each call to the Cloud Function.
 */
export async function postStatus(body, signal) {
  const startedAt = new Date().toLocaleTimeString();
  const t0 = performance.now();

  let res;
  let json = null;
  try {
    res = await fetch(STATUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    json = await res.json().catch(() => null);
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(
        `%c[AgriAgent → Cloud Run] %cPOST ${body.sensor_id ?? '—'} · ERROR DE RED`,
        'color:#4285f4;font-weight:bold',
        'color:#ea4335;font-weight:bold',
        err.message,
        body,
      );
    }
    throw err;
  }

  // Verbose request log only in development — keeps the production console clean.
  if (import.meta.env.DEV) {
    const ms = Math.round(performance.now() - t0);
    console.groupCollapsed(
      `%c[AgriAgent → Cloud Run] %cPOST ${body.sensor_id ?? '—'} %c${res.status} %c${ms}ms`,
      'color:#4285f4;font-weight:bold',
      'color:inherit',
      res.ok ? 'color:#34a853;font-weight:bold' : 'color:#ea4335;font-weight:bold',
      'color:#888',
    );
    console.log('🕐 hora:', startedAt);
    console.log('→ request body:', body);
    console.log('← response:', json);
    if (json?.agente) console.log('🤖 decisión:', json.agente.decision, '·', json.agente.reasoning);
    console.groupEnd();
  }

  if (!res.ok) throw new Error(`La API respondió ${res.status}`);
  return normalizeStatus(json);
}

/**
 * Fetch the recent irrigation history straight from BigQuery, via the backend
 * `?modo=historial` endpoint. The browser can't query BigQuery directly, so the
 * Cloud Function runs the query and returns the rows.
 * @returns {Promise<Array>} rows: { fecha_hora, sensor_id, cultivo, humedad_superficie, humedad_profunda, estado_red, decision_ia }
 */
export async function fetchHistorial() {
  const res = await fetch(`${STATUS_URL}?modo=historial`);
  if (!res.ok) throw new Error(`Historial respondió ${res.status}`);
  const json = await res.json().catch(() => ({}));
  return Array.isArray(json.historial) ? json.historial : [];
}
