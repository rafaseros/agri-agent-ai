// ---------------------------------------------------------------------------
// Anti-corruption layer between the Cloud Run API and the dashboard UI.
//
// Backend wire shape (POST/GET /api/status):
//   {
//     estado_red: "ONLINE" | "OFFLINE (N min)",
//     lote:   { sensor, cultivo, hectareas },
//     sensor: { superficie, profunda },
//     clima:  { actual: string, pronostico: string },
//     agente: { decision: "ON"|"OFF", reasoning: string }
//   }
// This maps it into the internal model the components consume, so the UI never
// has to know the wire format.
// ---------------------------------------------------------------------------

/**
 * Parse the backend's free-text weather string, e.g. "19°C, Nublado" into a
 * temperature number + a human condition. Defensive: a format change degrades
 * to temperature=null rather than crashing.
 */
function parseClima(clima) {
  const text = String(clima ?? '');
  const tempMatch = text.match(/(-?\d+(?:\.\d+)?)\s*°?\s*C/i);
  const temperature = tempMatch ? Number(tempMatch[1]) : null;
  const parts = text.split(',').map((s) => s.trim());
  const condition = parts[1] || text || 'Condición desconocida';
  return { temperature, condition };
}

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

/**
 * Map a raw Cloud Run /api/status payload to the dashboard's internal model.
 *
 * @param {object} raw  the JSON returned by the serverless backend
 */
export function normalizeStatus(raw) {
  const soilSurface = toNum(raw?.sensor?.superficie);
  const soilDeep = toNum(raw?.sensor?.profunda);
  // `clima` is now an object { actual, pronostico }; fall back to the old
  // `sensor.clima` string for safety against a rollback.
  const { temperature, condition } = parseClima(raw?.clima?.actual ?? raw?.sensor?.clima);

  // 48h forecast — backend hasn't shipped it in the verified payload yet, and
  // its exact location is unconfirmed. Read defensively from the likely spots
  // so the UI lights up automatically the moment the field appears, wherever
  // it lands. Stays null (and hidden) until then.
  const forecastRaw =
    raw?.clima?.pronostico ??
    raw?.sensor?.pronostico ??
    raw?.pronostico ??
    raw?.clima?.forecast ??
    null;
  const forecast =
    typeof forecastRaw === 'string' && forecastRaw.trim() ? forecastRaw.trim() : null;

  const ai = raw?.agente ?? {};
  const decision = ai.decision === 'ON' ? 'ON' : 'OFF';
  const pumpOn = decision === 'ON';
  const reasoning = typeof ai.reasoning === 'string' ? ai.reasoning : '—';

  // estado_red is "ONLINE" or "OFFLINE (hace N min)".
  const networkStatus = typeof raw?.estado_red === 'string' ? raw.estado_red : 'ONLINE';
  const online = networkStatus.toUpperCase().startsWith('ONLINE');

  // Lot metadata echoed back by the backend (sensor id, crop, hectares).
  const lote = raw?.lote && typeof raw.lote === 'object' ? raw.lote : null;

  return {
    networkStatus,
    online,
    lote,
    sensor: {
      soilSurface,
      soilDeep,
      // Main reading shown on the humidity card — the 10cm surface probe.
      soilMoisture: soilSurface,
      pumpStatus: pumpOn ? 'ON' : 'OFF',
    },
    weather: { temperature, condition, forecast },
    decision: {
      decision,
      reasoning,
      action: pumpOn ? 'Encender Bomba' : 'Apagar Bomba',
      reason: reasoning,
      pumpOn,
    },
  };
}
