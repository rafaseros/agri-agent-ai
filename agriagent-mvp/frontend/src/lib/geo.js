// ---------------------------------------------------------------------------
// Simulated field geography for the satellite view.
//
// Lotes have no real coordinates (the backend is sensor-only), so we lay them
// out deterministically on a grid over the Norte Integrado of Santa Cruz —
// the real agricultural belt (Montero / Warnes / Okinawa). Positions are
// SIMULATED; the transparency badge on the map makes that explicit.
// ---------------------------------------------------------------------------

const BASE = { lat: -17.35, lng: -63.2 }; // Norte Integrado, Santa Cruz, Bolivia
const CELL = 0.05; // grid step between lotes (~5 km)

export const MAP_CENTER = [BASE.lat - 0.015, BASE.lng + 0.02];
export const MAP_ZOOM = 12;

// Deterministic square polygon for a lote by its position in the list.
export function loteGeo(index, hectareas = 100) {
  const cols = 3;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const cx = BASE.lng + (col - 1) * CELL;
  const cy = BASE.lat - row * CELL;
  // Size scales mildly with hectares (clamped so it stays readable).
  const half = 0.011 * Math.min(2, Math.max(0.6, hectareas / 100));
  const polygon = [
    [cy - half, cx - half],
    [cy - half, cx + half],
    [cy + half, cx + half],
    [cy + half, cx - half],
  ];
  return { center: [cy, cx], polygon, half, cx, cy };
}

// Deterministic sensor pin positions distributed inside a lote square.
export function sensorPositions(geo, n) {
  if (n <= 0) return [];
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const positions = [];
  for (let i = 0; i < n; i += 1) {
    const c = i % cols;
    const r = Math.floor(i / cols);
    const fx = cols === 1 ? 0.5 : 0.2 + 0.6 * (c / (cols - 1));
    const fy = rows === 1 ? 0.5 : 0.2 + 0.6 * (r / (rows - 1));
    const lat = geo.cy + geo.half - fy * geo.half * 2;
    const lng = geo.cx - geo.half + fx * geo.half * 2;
    positions.push([lat, lng]);
  }
  return positions;
}

// Average surface moisture across a lote's sensors (null if none).
export function loteMoisture(loteSensors) {
  if (!loteSensors.length) return null;
  const sum = loteSensors.reduce((a, s) => a + (s.humedad_superficie || 0), 0);
  return sum / loteSensors.length;
}

// Simulated NDVI-style stress color from average soil moisture.
export function stressColor(avg) {
  if (avg == null) return '#64748b'; // slate — no data
  if (avg >= 50) return '#34a853'; // healthy green
  if (avg >= 30) return '#fbbc05'; // yellow — mild stress
  return '#ea4335'; // orange/red — water stress
}

export function stressLabel(avg) {
  if (avg == null) return 'Sin datos';
  if (avg >= 50) return 'Saludable';
  if (avg >= 30) return 'Estrés leve';
  return 'Estrés hídrico';
}
