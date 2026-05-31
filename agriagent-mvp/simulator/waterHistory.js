// ---------------------------------------------------------------------------
// Water-savings history (last 7 days) — demo series for the dashboard chart.
//
// Stand-in for the figure a real deployment would compute from irrigation logs.
// Generated ONCE at module load so the chart is stable across the polling cycle
// instead of jumping on every refresh.
// ---------------------------------------------------------------------------

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

// Liters of water the agent avoided wasting that day (believable spread).
const buildHistory = () =>
  DAYS.map((day) => ({ day, litersSaved: Math.round(800 + Math.random() * 2200) }));

export const waterHistory = buildHistory();

export const totalWaterSaved = waterHistory.reduce((sum, d) => sum + d.litersSaved, 0);
