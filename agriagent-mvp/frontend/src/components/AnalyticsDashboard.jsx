import { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Droplets, Cpu, Gauge, LineChart as LineIcon, RefreshCw, Loader2, Waves, Layers } from 'lucide-react';
import { fetchHistorial } from '../lib/agentApi.js';

const PALETTE = [
  '#4285f4', '#34a853', '#fbbc05', '#ea4335', '#a855f7',
  '#06b6d4', '#f97316', '#ec4899', '#84cc16', '#14b8a6',
];

// BigQuery TIMESTAMP serializes as { value: "..." }; normalize to a string.
const tsValue = (v) => (v && typeof v === 'object' && 'value' in v ? v.value : v);
const fmtTime = (v) => {
  try {
    return new Date(tsValue(v)).toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
};
const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

export default function AnalyticsDashboard({ history, sensores, pumpOnCount }) {
  const [rows, setRows] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setRows(await fetchHistorial());
      setError(null);
    } catch (e) {
      setError(e.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Sensors present in the history, ordered by number of readings (most first).
  const counts = {};
  (rows ?? []).forEach((r) => {
    counts[r.sensor_id] = (counts[r.sensor_id] || 0) + 1;
  });
  const sensorIds = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

  // Default the selector to the sensor with the most data once rows arrive.
  useEffect(() => {
    if (sensorIds.length && (!selected || !sensorIds.includes(selected))) {
      setSelected(sensorIds[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const hasBQ = sensorIds.length > 0;

  // Time series for the SELECTED sensor: both humidities, ascending by time.
  const serie = (rows ?? [])
    .filter((r) => r.sensor_id === selected)
    .map((r) => ({ ts: tsValue(r.fecha_hora), superficie: num(r.humedad_superficie), profunda: num(r.humedad_profunda) }))
    .sort((a, b) => new Date(a.ts) - new Date(b.ts))
    .map((d) => ({ t: fmtTime(d.ts), superficie: d.superficie, profunda: d.profunda }));

  // KPIs (global over the whole table; fallback to session when BQ is empty).
  const riegos = hasBQ
    ? (rows ?? []).filter((r) => String(r.decision_ia).toUpperCase() === 'ON').length
    : pumpOnCount;
  const supProm = hasBQ
    ? avg((rows ?? []).map((r) => Number(r.humedad_superficie)).filter(Number.isFinite))
    : avg(sensores.map((s) => s.humedad_superficie).filter(Number.isFinite));
  const profProm = hasBQ
    ? avg((rows ?? []).map((r) => Number(r.humedad_profunda)).filter(Number.isFinite))
    : avg(sensores.map((s) => s.humedad_profunda).filter(Number.isFinite));

  const sessionIds = sensores.map((s) => s.id);
  const hasSession = (history?.length ?? 0) > 0;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/30">
            <Gauge className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white">Analítica de la granja</h2>
            <p className="text-sm text-slate-400">
              Histórico de riego desde <span className="font-semibold text-slate-300">BigQuery</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refrescar
        </button>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={Droplets} label="Riegos activados (IA)" value={riegos} color="text-ggreen" />
        <Kpi icon={Cpu} label="Registros en BigQuery" value={(rows ?? []).length} color="text-gblue" />
        <Kpi icon={Waves} label="Humedad superficie prom." value={`${supProm}%`} color="text-sky-400" />
        <Kpi icon={Layers} label="Humedad profundidad prom." value={`${profProm}%`} color="text-blue-400" />
      </div>

      {/* Chart */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
            Humedad por sensor — superficie vs. profundidad
          </h3>
          {/* Sensor selector */}
          {hasBQ && (
            <div className="flex flex-wrap gap-1.5">
              {sensorIds.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelected(id)}
                  className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold ring-1 transition ${
                    selected === id
                      ? 'bg-gblue/15 text-gblue ring-gblue/40'
                      : 'bg-white/5 text-slate-400 ring-white/10 hover:text-white'
                  }`}
                >
                  {id}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading && !rows ? (
          <Centered>
            <Loader2 className="h-8 w-8 animate-spin text-gblue" />
            <p className="mt-3 text-sm text-slate-400">Consultando BigQuery…</p>
          </Centered>
        ) : hasBQ ? (
          <div className="mt-5 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serie} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="t" stroke="#71717a" tickLine={false} axisLine={false} minTickGap={48} />
                <YAxis domain={[0, 100]} stroke="#71717a" tickLine={false} axisLine={false} unit="%" />
                <Tooltip
                  contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }}
                  formatter={(v, name) => [`${v}%`, name]}
                  labelFormatter={(t) => `${selected} · ${t}`}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="superficie" name="Superficie (10cm)" stroke="#38bdf8" strokeWidth={2.5} dot={false} isAnimationActive={false} connectNulls />
                <Line type="monotone" dataKey="profunda" name="Profundidad (40cm)" stroke="#3b82f6" strokeWidth={2.5} dot={false} isAnimationActive={false} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : hasSession ? (
          <div className="mt-5 h-80 w-full">
            <p className="mb-2 text-xs text-gyellow">
              BigQuery sin datos todavía — mostrando la sesión local. Corré la simulación y tocá "Refrescar".
            </p>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="tick" stroke="#71717a" tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#71717a" tickLine={false} axisLine={false} unit="%" />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: 11, maxHeight: 64, overflowY: 'auto' }} />
                {sessionIds.map((id, i) => (
                  <Line key={id} type="monotone" dataKey={id} stroke={PALETTE[i % PALETTE.length]} strokeWidth={2} dot={false} isAnimationActive={false} connectNulls />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <Centered>
            <LineIcon className="h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">
              Aún no hay registros. Corré la simulación (cada decisión se guarda en BigQuery) y tocá
              <span className="font-semibold text-slate-300"> Refrescar</span>.
            </p>
            {error && <p className="mt-2 text-xs text-gred">No se pudo leer BigQuery: {error}</p>}
          </Centered>
        )}
      </div>
    </section>
  );
}

function Centered({ children }) {
  return <div className="flex h-72 flex-col items-center justify-center text-center">{children}</div>;
}

function Kpi({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg">
      <div className="flex items-center gap-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      </div>
      <p className={`mt-3 text-4xl font-black ${color}`}>{value}</p>
    </div>
  );
}
