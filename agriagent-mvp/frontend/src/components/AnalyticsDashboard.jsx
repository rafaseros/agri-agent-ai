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
import { Droplets, Cpu, Gauge, LineChart as LineIcon } from 'lucide-react';

// Native analytics view. Charts the session humidity history (one line per
// sensor) + key KPIs.
const PALETTE = [
  '#4285f4', '#34a853', '#fbbc05', '#ea4335', '#a855f7',
  '#06b6d4', '#f97316', '#ec4899', '#84cc16', '#14b8a6',
];

export default function AnalyticsDashboard({ history, sensores, pumpOnCount }) {
  const sensorIds = sensores.map((s) => s.id);

  const avgHumidity = sensores.length
    ? Math.round(sensores.reduce((sum, s) => sum + (s.humedad_superficie || 0), 0) / sensores.length)
    : 0;

  return (
    <section>
      <div className="mb-6 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/30">
          <Gauge className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Analítica de la granja</h2>
          <p className="text-sm text-slate-400">Evolución de humedad en vivo · sesión actual</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Kpi icon={Droplets} label="Riegos activados por la IA" value={pumpOnCount} color="text-ggreen" />
        <Kpi icon={Cpu} label="Sensores monitoreados" value={sensores.length} color="text-gblue" />
        <Kpi icon={Gauge} label="Humedad superficie prom." value={`${avgHumidity}%`} color="text-gyellow" />
      </div>

      {/* History chart */}
      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg">
        <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-400">
          Humedad del suelo por sensor
        </h3>

        {history.length === 0 ? (
          <div className="flex h-72 flex-col items-center justify-center text-center">
            <LineIcon className="h-10 w-10 text-slate-600" />
            <p className="mt-3 text-sm text-slate-400">
              Iniciá la simulación para ver las curvas moverse en tiempo real.
            </p>
          </div>
        ) : (
          <div className="mt-5 h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="tick" stroke="#71717a" tickLine={false} axisLine={false} />
                <YAxis
                  domain={[0, 100]}
                  stroke="#71717a"
                  tickLine={false}
                  axisLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    background: '#18181b',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                  }}
                  formatter={(v, name) => [`${v}%`, name]}
                  labelFormatter={(t) => `Hora sim: ${t}`}
                />
                <Legend wrapperStyle={{ fontSize: 11, maxHeight: 64, overflowY: 'auto' }} />
                {sensorIds.map((id, i) => (
                  <Line
                    key={id}
                    type="monotone"
                    dataKey={id}
                    stroke={PALETTE[i % PALETTE.length]}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </section>
  );
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
