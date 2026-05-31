import { Cpu, Flame, Cloud, Satellite, Brain, Database, Droplets, ArrowRight, ArrowDown } from 'lucide-react';

// Shared architecture diagram used by BOTH the "Arquitectura" tab and the pitch
// deck slide, so the two never drift. Pass `compact` for the slide (smaller cards).
//
// Each node's accent is a FULL literal class string — never build Tailwind
// classes by concatenation (`ring-${color}-500`), the JIT can't see those.
const STYLES = {
  slate: { ring: 'ring-slate-600/50', iconBg: 'bg-slate-500/15', icon: 'text-slate-300', label: 'text-slate-400', glow: '' },
  blue: { ring: 'ring-blue-500/50', iconBg: 'bg-blue-500/15', icon: 'text-blue-400', label: 'text-blue-400', glow: '' },
  emerald: { ring: 'ring-emerald-500/50', iconBg: 'bg-emerald-500/15', icon: 'text-emerald-400', label: 'text-emerald-400', glow: '' },
  purple: { ring: 'ring-purple-500/70', iconBg: 'bg-purple-500/20', icon: 'text-purple-300', label: 'text-purple-300', glow: 'shadow-[0_0_45px_-8px_rgba(168,85,247,0.65)]' },
  amber: { ring: 'ring-amber-500/50', iconBg: 'bg-amber-500/15', icon: 'text-amber-400', label: 'text-amber-400', glow: '' },
  sky: { ring: 'ring-sky-500/50', iconBg: 'bg-sky-500/15', icon: 'text-sky-400', label: 'text-sky-400', glow: '' },
};

const NODES = {
  field: {
    icon: Cpu,
    kicker: 'Campo · Edge',
    title: 'Sensores ESP32',
    subtitle: 'Sensores IoT de humedad',
    color: 'slate',
  },
  hub: {
    icon: Flame,
    kicker: 'Hub · App web',
    title: 'Firebase Hosting',
    subtitle: 'La app transmite los datos del lote',
    color: 'amber',
  },
  ingest: {
    icon: Cloud,
    kicker: 'Ingesta',
    title: 'Cloud Functions',
    subtitle: 'Recepción de JSON',
    color: 'blue',
  },
  context: {
    icon: Satellite,
    kicker: 'Contexto bioclimático',
    title: 'Earth Engine & Open-Meteo',
    subtitle: 'Clima real + NDVI simulado',
    color: 'emerald',
  },
  brain: {
    icon: Brain,
    kicker: 'Cerebro · Vertex AI',
    title: 'Gemini 2.5 Flash',
    subtitle: 'Evalúa el estrés y decide (Fail-Safe)',
    color: 'purple',
  },
  analytics: {
    icon: Database,
    kicker: 'Historial',
    title: 'BigQuery',
    subtitle: 'Registro y analítica',
    color: 'sky',
  },
  action: {
    icon: Droplets,
    kicker: 'Acción',
    title: 'Riego automático',
    subtitle: 'Relé / electroválvula',
    color: 'emerald',
  },
};

// A single system node. `featured` (Vertex AI) is bigger, glows, and carries a
// pulsing "live" indicator so the eye lands on the brain of the system.
function NodeCard({ node, featured = false, compact = false }) {
  const Icon = node.icon;
  const s = STYLES[node.color];
  const pad = featured ? (compact ? 'p-4' : 'p-6') : compact ? 'p-3' : 'p-5';
  const box = featured ? (compact ? 'h-12 w-12' : 'h-16 w-16') : compact ? 'h-10 w-10' : 'h-12 w-12';
  const ico = featured ? (compact ? 'h-6 w-6' : 'h-8 w-8') : compact ? 'h-5 w-5' : 'h-6 w-6';
  const titleSize = featured ? (compact ? 'text-base' : 'text-xl') : compact ? 'text-sm' : 'text-base';
  const subSize = compact ? 'text-[11px]' : 'text-xs';

  return (
    <div
      className={`relative flex w-full min-w-0 flex-col items-center break-words rounded-2xl border border-white/10 bg-slate-800/60 text-center ring-1 backdrop-blur-sm ${s.ring} ${pad} ${
        featured ? `ring-2 ${s.glow}` : ''
      }`}
    >
      {featured && (
        <span className="absolute right-3 top-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-purple-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-purple-400" />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-300">En vivo</span>
        </span>
      )}

      <div className={`grid place-items-center rounded-xl ${s.iconBg} ${box}`}>
        <Icon className={`${ico} ${s.icon}`} />
      </div>

      <p className={`mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] sm:text-[11px] ${s.label}`}>
        {node.kicker}
      </p>
      <h3 className={`mt-1 font-bold text-white ${titleSize}`}>{node.title}</h3>
      <p className={`mt-1 leading-relaxed text-slate-400 ${subSize}`}>{node.subtitle}</p>
    </div>
  );
}

// Animated connectors — animate-pulse simulates data flowing in real time.
function FlowArrowH() {
  return (
    <div className="flex items-center justify-center px-0.5">
      <ArrowRight className="h-6 w-6 animate-pulse text-slate-500" />
    </div>
  );
}

function FlowArrowV() {
  return (
    <div className="flex items-center justify-center py-1">
      <ArrowDown className="h-5 w-5 animate-pulse text-slate-500" />
    </div>
  );
}

export default function ArchitectureDiagram({ compact = false }) {
  return (
    <>
      {/* Desktop: 2D flow. Context feeds Ingest from above; Analytics branches
          down from the Vertex brain; the App (Firebase Hosting) is the hub. */}
      <div className="hidden grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-x-2 gap-y-2 xl:grid">
        {/* Row 1 — context branch above Ingest (col 5) */}
        <div className="col-start-5 row-start-1 flex flex-col items-center">
          <NodeCard node={NODES.context} compact={compact} />
          <FlowArrowV />
        </div>

        {/* Row 2 — main flow: Sensores → Firebase → Functions → Vertex → Riego */}
        <div className="col-start-1 row-start-2">
          <NodeCard node={NODES.field} compact={compact} />
        </div>
        <div className="col-start-2 row-start-2">
          <FlowArrowH />
        </div>
        <div className="col-start-3 row-start-2">
          <NodeCard node={NODES.hub} compact={compact} />
        </div>
        <div className="col-start-4 row-start-2">
          <FlowArrowH />
        </div>
        <div className="col-start-5 row-start-2">
          <NodeCard node={NODES.ingest} compact={compact} />
        </div>
        <div className="col-start-6 row-start-2">
          <FlowArrowH />
        </div>
        <div className="col-start-7 row-start-2">
          <NodeCard node={NODES.brain} featured compact={compact} />
        </div>
        <div className="col-start-8 row-start-2">
          <FlowArrowH />
        </div>
        <div className="col-start-9 row-start-2">
          <NodeCard node={NODES.action} compact={compact} />
        </div>

        {/* Row 3 — analytics branch below the brain (col 7) */}
        <div className="col-start-7 row-start-3 flex flex-col items-center">
          <FlowArrowV />
          <NodeCard node={NODES.analytics} compact={compact} />
        </div>
      </div>

      {/* Mobile / tablet: single vertical chain in logical order. */}
      <div className="mx-auto flex max-w-sm flex-col items-center gap-1 xl:hidden">
        <NodeCard node={NODES.field} compact={compact} />
        <FlowArrowV />
        <NodeCard node={NODES.hub} compact={compact} />
        <FlowArrowV />
        <NodeCard node={NODES.context} compact={compact} />
        <FlowArrowV />
        <NodeCard node={NODES.ingest} compact={compact} />
        <FlowArrowV />
        <NodeCard node={NODES.brain} featured compact={compact} />
        <FlowArrowV />
        <NodeCard node={NODES.analytics} compact={compact} />
        <FlowArrowV />
        <NodeCard node={NODES.action} compact={compact} />
      </div>
    </>
  );
}
