// localStorage persistence for the farm state (lotes + sensores + id seq).
// Wrapped in try/catch so a disabled/full storage never crashes the app.

const KEY = 'agriagent.farm.v1';
const EMPTY = { lotes: [], sensores: [], seq: 101 };

export function loadFarm() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY };
    const p = JSON.parse(raw);
    return {
      lotes: Array.isArray(p.lotes) ? p.lotes : [],
      sensores: Array.isArray(p.sensores) ? p.sensores : [],
      seq: Number.isFinite(p.seq) ? p.seq : 101,
    };
  } catch {
    return { ...EMPTY };
  }
}

export function saveFarm(farm) {
  try {
    localStorage.setItem(KEY, JSON.stringify(farm));
  } catch {
    /* storage unavailable — non-fatal */
  }
}
