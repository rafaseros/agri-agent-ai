// ---------------------------------------------------------------------------
// ESP32 field sensor simulator.
//
// Stands in for the real capacitive soil-moisture probe + pump relay we would
// deploy in Santa Cruz. Keeps a tiny bit of state between reads so the demo
// looks alive (moisture drifts instead of jumping randomly each poll).
// ---------------------------------------------------------------------------

// Soil moisture is expressed as a percentage. Spec range: 30%..80%.
const MIN_MOISTURE = 30;
const MAX_MOISTURE = 80;

// Module-level state: the last reading we reported. Seeded mid-range so the
// first poll is plausible. A real probe behaves the same way — values evolve.
let lastMoisture = 55;

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

/**
 * Read a single sample from the (simulated) ESP32.
 *
 * Moisture drifts by a small random delta each call so the dashboard shows
 * gentle, believable movement rather than noise. The pump state is derived
 * later by the agent — the sensor only reports what it physically knows.
 *
 * @param {boolean} pumpOn  current pump state, decided by the agent
 * @returns {{ soilMoisture: number, pumpStatus: 'ON'|'OFF', readAt: string }}
 */
export function readSensor(pumpOn = false) {
  // Drift: irrigating slowly raises moisture, otherwise it slowly dries out.
  const drift = (pumpOn ? 1.5 : -1.2) + (Math.random() * 4 - 2);
  lastMoisture = clamp(lastMoisture + drift, MIN_MOISTURE, MAX_MOISTURE);

  return {
    soilMoisture: Math.round(lastMoisture),
    pumpStatus: pumpOn ? 'ON' : 'OFF',
    readAt: new Date().toISOString(),
  };
}
