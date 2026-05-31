import { Play, Activity, Droplets, Cpu } from 'lucide-react';

// Global control bar for the 24h evolution simulator + live session counters.
export default function SimulationBar({
  simulating,
  tick,
  pumpOnCount,
  sensorCount,
  onStart,
  onStop,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4 shadow-lg">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Stat icon={Cpu} label="Sensores" value={sensorCount} color="text-slate-300" />
        <Stat icon={Activity} label="Ticks (h sim)" value={tick} color="text-gblue" />
        <Stat icon={Droplets} label="Riegos IA" value={pumpOnCount} color="text-ggreen" />
      </div>

      <button
        type="button"
        onClick={simulating ? onStop : onStart}
        disabled={sensorCount === 0}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-base font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto ${
          simulating ? 'bg-gred' : 'bg-gradient-to-r from-gblue to-ggreen'
        }`}
      >
        {simulating ? (
          <>
            <span className="h-3 w-3 rounded-full bg-white motion-safe:animate-pulse" aria-hidden />
            Recolectando datos
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            Iniciar recolección de datos
          </>
        )}
      </button>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-slate-400">{label}:</span>
      <span className={`font-mono font-black ${color}`}>{value}</span>
    </div>
  );
}
