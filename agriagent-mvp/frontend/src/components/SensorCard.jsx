import { Cpu, Loader2, Waves, Layers, Clock, Power, Droplets, Trash2 } from 'lucide-react';

// Compact home-automation style sensor tile (Google Home / HomeKit inspired):
// small padding, tight typography, so several fit on screen at a glance.
// Presentational only — state lives in the farm store.
export default function SensorCard({ sensor, onChange, onRemove }) {
  const {
    id,
    cultivo,
    hectareas,
    humedad_superficie,
    humedad_profunda,
    minutos_desconectado,
    conexion_activa,
    decision,
    reasoning,
    online,
    pumpOn,
    evaluating,
  } = sensor;
  const signalLost = !conexion_activa;

  const toggleSignal = () =>
    onChange(signalLost ? { conexion_activa: true, minutos_desconectado: 0 } : { conexion_activa: false });

  const hero = evaluating
    ? { text: 'Consultando IA…', cls: 'bg-gblue/15 text-gblue ring-gblue/40' }
    : !decision
      ? { text: 'En espera', cls: 'bg-slate-700/40 text-slate-300 ring-slate-500/30' }
      : !online
        ? { text: 'Apagada · sin señal', cls: 'bg-gred/15 text-gred ring-gred/40' }
        : pumpOn
          ? { text: 'Bomba encendida', cls: 'bg-gblue/15 text-gblue ring-gblue/40' }
          : { text: 'Bomba apagada', cls: 'bg-ggreen/15 text-ggreen ring-ggreen/40' };

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border bg-slate-900/70 p-4 shadow-md transition ${
        signalLost ? 'border-gred/40' : 'border-white/10'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10">
            <Cpu className="h-4 w-4 text-slate-300" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-bold leading-none text-white">{id}</p>
            <p className="truncate text-[11px] text-slate-400">
              {cultivo} · {hectareas} ha
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              online ? 'bg-ggreen' : 'animate-pulse bg-gred'
            }`}
            title={online ? 'En línea' : 'Sin señal'}
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Eliminar ${id}`}
            className="grid h-10 w-10 place-items-center rounded-md text-slate-400 transition hover:bg-gred/10 hover:text-gred"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Decision pill */}
      <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold ring-1 ${hero.cls}`}>
        {evaluating || !decision ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin opacity-80" />
        ) : pumpOn && online ? (
          <Droplets className="h-3.5 w-3.5" />
        ) : (
          <Power className="h-3.5 w-3.5" />
        )}
        {hero.text}
      </div>
      {reasoning && (
        <p className="line-clamp-2 text-[11px] leading-snug text-slate-400">{reasoning}</p>
      )}

      {/* Compact sliders */}
      <div className="space-y-2">
        <CompactSlider
          icon={Waves}
          title="Humedad superficie (10cm)"
          value={humedad_superficie}
          onChange={(e) => onChange({ humedad_superficie: Number(e.target.value) })}
          disabled={signalLost}
          accent="accent-sky-500"
          color="text-sky-400"
        />
        <CompactSlider
          icon={Layers}
          title="Humedad profundidad (40cm)"
          value={humedad_profunda}
          onChange={(e) => onChange({ humedad_profunda: Number(e.target.value) })}
          disabled={signalLost}
          accent="accent-blue-500"
          color="text-blue-400"
        />
      </div>

      {/* Signal toggle */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={signalLost}
            aria-label="Simular pérdida de señal"
            onClick={toggleSignal}
            className="grid min-h-[44px] place-items-center py-2 pr-1"
          >
            <span
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                signalLost ? 'bg-gred' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  signalLost ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </span>
          </button>
          <span className="text-[11px] font-medium text-slate-400">Pérdida de señal</span>
        </div>

        {signalLost && (
          <label className="flex items-center gap-1 text-[11px]">
            <Clock className="h-3 w-3 text-gred" />
            <input
              type="number"
              min={0}
              value={minutos_desconectado}
              onChange={(e) => onChange({ minutos_desconectado: Math.max(0, Number(e.target.value) || 0) })}
              className="w-12 rounded-md border border-white/10 bg-slate-800 px-1.5 py-0.5 font-mono text-white outline-none focus:border-gred/50"
            />
            <span className="text-slate-500">min</span>
          </label>
        )}
      </div>
    </div>
  );
}

function CompactSlider({ icon: Icon, title, value, onChange, disabled, accent, color }) {
  return (
    <div className={`flex items-center gap-2 ${disabled ? 'opacity-50' : ''}`} title={title}>
      <Icon className="h-3.5 w-3.5 shrink-0 text-slate-500" />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-slate-700 ${accent} disabled:cursor-not-allowed`}
      />
      <span className={`w-9 text-right font-mono text-xs font-bold ${color}`}>{value}%</span>
    </div>
  );
}
