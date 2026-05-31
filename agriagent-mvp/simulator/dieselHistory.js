// ---------------------------------------------------------------------------
// Diesel-savings history (last 7 days).
//
// Stand-in for the figure a real deployment would compute from pump-cycle
// logs. Generated ONCE at module load so the dashboard chart is stable across
// the 5-second polling cycle instead of jumping on every refresh.
// ---------------------------------------------------------------------------

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function buildHistory() {
  return DAYS.map((day) => ({
    day,
    // Liters of diesel the agent avoided burning that day (believable spread).
    litersSaved: Math.round(8 + Math.random() * 22),
  }));
}

// Frozen for the lifetime of the process — a "historical" series shouldn't
// shift while the user watches the live dashboard.
export const dieselHistory = buildHistory();

export const totalDieselSaved = dieselHistory.reduce(
  (sum, d) => sum + d.litersSaved,
  0,
);
