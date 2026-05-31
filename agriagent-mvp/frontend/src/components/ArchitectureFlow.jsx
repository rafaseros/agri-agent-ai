import ArchitectureDiagram from './ArchitectureDiagram.jsx';

// "Arquitectura" tab — the full technical view. Shares the diagram with the
// pitch deck slide so both stay in sync.
export default function ArchitectureFlow() {
  return (
    <section>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-300">
          Vista técnica
        </p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
          Ciclo de vida del dato en Google Cloud
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Del sensor en el campo a la acción de riego: cada nodo es un servicio real de la
          arquitectura, hospedada en la suite de Google Cloud. La animación representa el flujo de
          datos en tiempo real.
        </p>
      </div>

      <ArchitectureDiagram />
    </section>
  );
}
