import { useState } from 'react';
import { Sprout, Ruler, Plus, Trash2, Cpu } from 'lucide-react';
import SensorCard from './SensorCard.jsx';

const CROPS = ['Soya', 'Sorgo', 'Maíz', 'Trigo'];

// Farm management screen: create lotes (auto-generating sensors), then manage
// each lote's sensor cards. State is owned by the farm store above.
export default function FarmManager({
  lotes,
  sensores,
  onAddLote,
  onAddSensor,
  onRemoveSensor,
  onRemoveLote,
  onUpdateSensor,
}) {
  const [cultivo, setCultivo] = useState('Soya');
  const [hectareasInput, setHectareasInput] = useState('100');

  const ha = Math.max(0, Number(hectareasInput) || 0);
  const suggested = ha > 0 ? Math.ceil(ha / 20) : 0;

  const create = () => {
    if (ha <= 0) return;
    onAddLote(cultivo, ha);
  };

  return (
    <div className="space-y-6">
      {/* Create lote */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-gblue to-ggreen">
            <Sprout className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-black tracking-tight text-white">Nuevo lote</h2>
        </div>

        <div className="mt-5 flex flex-wrap items-end gap-4">
          <label className="w-full sm:flex-1 sm:min-w-[160px]">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              <Sprout className="h-4 w-4" /> Cultivo
            </span>
            <select
              value={cultivo}
              onChange={(e) => setCultivo(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 font-semibold text-white outline-none focus:border-ggreen/50 focus:ring-1 focus:ring-ggreen/40"
            >
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className="w-full sm:flex-1 sm:min-w-[160px]">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              <Ruler className="h-4 w-4" /> Hectáreas
            </span>
            <input
              type="number"
              min={0}
              value={hectareasInput}
              onChange={(e) => setHectareasInput(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-800 px-4 py-3 font-mono text-lg font-bold text-white outline-none focus:border-gblue/50 focus:ring-1 focus:ring-gblue/40"
            />
          </label>

          <button
            type="button"
            onClick={create}
            disabled={ha <= 0}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gblue to-ggreen px-5 py-3 font-bold text-white shadow-lg transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            Crear lote
          </button>
        </div>

        {suggested > 0 && (
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <Cpu className="h-4 w-4 text-gblue" />
            Se generarán <span className="font-bold text-gblue">{suggested} sensores</span> automáticamente
            (1 cada 20 ha).
          </p>
        )}
      </section>

      {/* Lotes + their sensors */}
      {lotes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/40 py-16 text-center">
          <Sprout className="mx-auto h-12 w-12 text-slate-600" />
          <p className="mt-4 text-lg font-semibold text-white">Todavía no hay lotes</p>
          <p className="mt-1 text-sm text-slate-500">Creá tu primer lote para desplegar sensores.</p>
        </div>
      ) : (
        lotes.map((lote) => {
          const loteSensors = sensores.filter((s) => s.loteId === lote.id);
          return (
            <section key={lote.id} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-black text-white">
                    {lote.cultivo} · {lote.hectareas} ha
                  </h3>
                  <p className="text-xs text-slate-400">{loteSensors.length} sensores</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAddSensor(lote.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Añadir sensor
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveLote(lote.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:bg-gred/10 hover:text-gred"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar lote
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loteSensors.map((s) => (
                  <SensorCard
                    key={s.id}
                    sensor={s}
                    onChange={(patch) => onUpdateSensor(s.id, patch)}
                    onRemove={() => onRemoveSensor(s.id)}
                  />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
