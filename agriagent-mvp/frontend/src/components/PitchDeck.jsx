import { useEffect, useRef, useState } from 'react';
import {
  X,
  ChevronDown,
  Droplets,
  CloudRain,
  TrendingDown,
  LandPlot,
  DollarSign,
  Cpu,
  CloudSun,
  BrainCircuit,
  AlertTriangle,
  Handshake,
  Repeat,
  Rocket,
  Smartphone,
  Play,
} from 'lucide-react';
import ArchitectureDiagram from './ArchitectureDiagram.jsx';

// Single source of truth for nav (dots, IO indexing, keyboard bounds, aria).
const SLIDES = [
  { id: 'titulo', label: 'Título' },
  { id: 'problema', label: 'El Problema' },
  { id: 'mercado', label: 'El Mercado' },
  { id: 'solucion', label: 'La Solución' },
  { id: 'arquitectura', label: 'Arquitectura y Transparencia', wide: true, tall: true },
  { id: 'negocio', label: 'Modelo de Negocios' },
  { id: 'demo', label: 'Demo Time' },
];

const ACC = {
  blue: { bg: 'bg-gblue/15', ring: 'ring-gblue/30', text: 'text-gblue' },
  green: { bg: 'bg-ggreen/15', ring: 'ring-ggreen/30', text: 'text-ggreen' },
  yellow: { bg: 'bg-gyellow/15', ring: 'ring-gyellow/30', text: 'text-gyellow' },
  red: { bg: 'bg-gred/15', ring: 'ring-gred/30', text: 'text-gred' },
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof matchMedia === 'function'
      ? matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const h = () => setReduced(m.matches);
    m.addEventListener('change', h);
    return () => m.removeEventListener('change', h);
  }, []);
  return reduced;
}

export default function PitchDeck({ onExit }) {
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const programmaticRef = useRef(false); // true while a go() scroll is animating
  const progTimer = useRef(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const total = SLIDES.length;

  const go = (i) => {
    const c = Math.max(0, Math.min(total - 1, i));
    const el = slideRefs.current[c];
    if (!el) return;
    setActive(c); // commit immediately so dots / aria-live reflect the target
    // Suppress IO updates during the programmatic scroll so intermediate slides
    // aren't announced one-by-one on a Home/End jump.
    programmaticRef.current = true;
    clearTimeout(progTimer.current);
    progTimer.current = setTimeout(
      () => {
        programmaticRef.current = false;
      },
      reduced ? 50 : 700,
    );
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  };

  // Move focus into the scroller on mount so keyboard nav is live immediately
  // (otherwise Arrow/Space/Home/End are dead until the user clicks/Tabs in).
  useEffect(() => {
    containerRef.current?.focus({ preventScroll: true });
  }, []);

  // Active-slide tracking via a viewport-relative CENTER BAND (rootMargin), so it
  // works even when a slide is taller than the viewport (long copy / 200% zoom /
  // short landscape) — a slide-relative ratio threshold would never fire there.
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (programmaticRef.current) return; // don't fight a programmatic scroll
        const vis = entries.find((e) => e.isIntersecting);
        if (vis) setActive(Number(vis.target.dataset.index));
      },
      { root, rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    slideRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  // Escape exits to the dashboard.
  useEffect(() => {
    const h = (e) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onExit]);

  const onKeyDown = (e) => {
    const k = e.key;
    const typing = e.target.closest('input,textarea,select,[contenteditable]');
    // Space pages the deck — but let it activate a focused button/link natively.
    if (k === ' ') {
      if (typing || e.target.closest('button,a')) return;
      e.preventDefault();
      go(active + (e.shiftKey ? -1 : 1));
      return;
    }
    if (typing) return; // never hijack arrows while typing
    // Arrow / Page / Home / End work regardless of which control holds focus, so
    // the deck stays navigable even when a dot or the exit button is focused.
    if (k === 'ArrowDown' || k === 'PageDown') {
      e.preventDefault();
      go(active + 1);
    } else if (k === 'ArrowUp' || k === 'PageUp') {
      e.preventDefault();
      go(active - 1);
    } else if (k === 'Home') {
      e.preventDefault();
      go(0);
    } else if (k === 'End') {
      e.preventDefault();
      go(total - 1);
    }
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-zinc-950 text-white">
      {/* Screen-reader live status */}
      <p aria-live="polite" className="sr-only">
        {`Diapositiva ${active + 1} de ${total}: ${SLIDES[active].label}`}
      </p>

      {/* Fixed exit button */}
      <button
        type="button"
        onClick={onExit}
        className="fixed right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-50 inline-flex items-center gap-2 rounded-full border border-white/15 bg-zinc-900/80 px-4 py-2.5 text-sm font-semibold text-slate-100 shadow-lg backdrop-blur transition hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gblue"
      >
        <X className="h-4 w-4" aria-hidden />
        Salir al Dashboard
      </button>

      {/* Mobile: slim top progress bar */}
      <div className="fixed inset-x-0 top-0 z-40 h-1 bg-white/10 sm:hidden">
        <div
          className="h-full bg-gradient-to-r from-gblue to-ggreen transition-[width] duration-300"
          style={{ width: `${((active + 1) / total) * 100}%` }}
        />
      </div>

      {/* Desktop: dot rail on the LEFT (keeps clear of the top-right exit button) */}
      <nav
        aria-label="Diapositivas"
        className="fixed left-[max(1rem,env(safe-area-inset-left))] top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 sm:flex"
      >
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => go(i)}
            aria-current={active === i ? 'true' : undefined}
            aria-controls={s.id}
            aria-label={`Ir a la diapositiva ${i + 1}: ${s.label}`}
            className="grid h-11 w-11 place-items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gblue"
          >
            <span
              aria-hidden
              className={`rounded-full transition-all ${
                active === i ? 'h-3 w-3 bg-gblue' : 'h-2 w-2 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          </button>
        ))}
      </nav>

      {/* Scroll-snap deck — the single scroll container that owns snap + keys */}
      <main
        ref={containerRef}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        aria-roledescription="carrusel"
        aria-label="Presentación AgriAgent"
        className="h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth focus:outline-none motion-reduce:scroll-auto"
      >
        {SLIDES.map((s, i) => (
          <Slide
            key={s.id}
            index={i}
            total={total}
            meta={s}
            slideRef={(el) => {
              slideRefs.current[i] = el;
            }}
          >
            {renderSlide(i, onExit)}
          </Slide>
        ))}
      </main>
    </div>
  );
}

function Slide({ index, total, meta, slideRef, children }) {
  return (
    <section
      ref={slideRef}
      data-index={index}
      id={meta.id}
      tabIndex={-1}
      role="group"
      aria-roledescription="diapositiva"
      aria-label={`${index + 1} de ${total}: ${meta.label}`}
      className={`relative flex min-h-dvh w-full snap-start snap-always flex-col px-6 py-[max(5rem,env(safe-area-inset-top))] focus:outline-none ${
        meta.wide ? 'sm:px-10 lg:px-12' : 'sm:px-16 lg:px-24'
      } ${meta.tall ? 'justify-start xl:justify-center' : 'justify-center'}`}
    >
      <div className={`mx-auto w-full ${meta.wide ? 'max-w-6xl' : 'max-w-4xl'}`}>{children}</div>
    </section>
  );
}

function Eyebrow({ children, color = 'text-gblue' }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.25em] sm:text-sm ${color}`}>{children}</p>
  );
}

function SlideTitle({ children }) {
  return (
    <h2 className="mt-4 text-balance font-black leading-[1.05] tracking-tight text-white text-[clamp(2rem,7vw,4.5rem)]">
      {children}
    </h2>
  );
}

function Point({ icon: Icon, accent, title, children }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:p-6">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${accent.bg} ring-1 ${accent.ring}`}>
        <Icon className={`h-6 w-6 ${accent.text}`} aria-hidden />
      </div>
      <div className="min-w-0">
        {title && <h3 className="text-lg font-bold text-white sm:text-xl">{title}</h3>}
        <p
          className={`text-pretty text-base leading-relaxed text-slate-300 sm:text-lg ${
            title ? 'mt-1' : ''
          }`}
        >
          {children}
        </p>
      </div>
    </div>
  );
}

function renderSlide(i, onExit) {
  switch (i) {
    // ---- Slide 1: Título ----
    case 0:
      return (
        <div className="flex flex-col items-center text-center">
          <Eyebrow color="text-ggreen">Riego predictivo · IA autónoma</Eyebrow>
          <h1 className="mt-6 break-words font-black leading-[0.9] tracking-tight text-[clamp(2.75rem,13vw,9rem)]">
            <span className="bg-gradient-to-r from-gblue via-ggreen to-gyellow bg-clip-text text-transparent">
              AgriAgent
            </span>
          </h1>
          <p className="mt-6 text-balance text-xl text-slate-200 sm:text-2xl lg:text-3xl">
            Riego Predictivo impulsado por Inteligencia Artificial.
          </p>
          <blockquote className="mt-10 max-w-2xl text-pretty border-l-2 border-gblue/60 pl-5 text-left text-lg italic leading-relaxed text-slate-300 sm:text-xl">
            "No venimos a apagar bombas de agua; venimos a detonar el máximo potencial genético de
            cada semilla."
          </blockquote>
          <ChevronDown
            className="mt-12 h-6 w-6 text-slate-500 motion-safe:animate-bounce"
            aria-hidden
          />
        </div>
      );

    // ---- Slide 2: El Problema ----
    case 1:
      return (
        <div>
          <Eyebrow color="text-gred">El Riego a Ciegas</Eyebrow>
          <SlideTitle>El Problema</SlideTitle>
          <div className="mt-8 grid gap-4">
            <Point icon={Droplets} accent={ACC.red} title="Déficit Hídrico">
              La falta de agua en etapa de floración reduce hasta un 40% el rendimiento del cultivo.
            </Point>
            <Point icon={CloudRain} accent={ACC.blue} title="Sobre-riego">
              Por miedo a la sequía, se aplica hasta un 30% de agua innecesaria, ahogando raíces y
              lavando fertilizantes.
            </Point>
            <Point icon={TrendingDown} accent={ACC.yellow} title="El Costo">
              Pérdida masiva de rentabilidad y agotamiento acelerado de los acuíferos.
            </Point>
          </div>
        </div>
      );

    // ---- Slide 3: El Mercado ----
    case 2:
      return (
        <div>
          <Eyebrow color="text-gyellow">El Norte Integrado</Eyebrow>
          <SlideTitle>El Mercado</SlideTitle>
          <div className="mt-8 grid gap-4">
            <Point icon={LandPlot} accent={ACC.green} title="Superficie">
              Más de 1.5 millones de hectáreas cultivadas (Soya, Maíz, Sorgo).
            </Point>
            <Point icon={DollarSign} accent={ACC.blue} title="El Impacto Económico">
              Salvar el 40% del rendimiento protege más de 1 tonelada de grano/ha. Esto equivale a
              retener $400 USD por hectárea para el productor.
            </Point>
            <Point icon={Droplets} accent={ACC.green} title="El Impacto Ecológico">
              Reducir un 30% el desperdicio ahorra 1.5 millones de litros de agua por hectárea.
              Captando solo el 10% del mercado, ahorraremos 225 mil millones de litros anuales.
            </Point>
          </div>
        </div>
      );

    // ---- Slide 4: La Solución ----
    case 3:
      return (
        <div>
          <Eyebrow color="text-ggreen">AgriAgent</Eyebrow>
          <SlideTitle>La Solución</SlideTitle>
          <div className="mt-8 grid gap-4">
            <Point icon={Cpu} accent={ACC.blue} title="Edge & Hub">
              Red de sensores IoT de bajo costo gestionados desde una App Mobile-First.
            </Point>
            <Point icon={CloudSun} accent={ACC.yellow} title="Contexto Bioclimático">
              Integración con Open-Meteo (predicción a 3 días).
            </Point>
            <Point icon={BrainCircuit} accent={ACC.green} title="Cerebro Autónomo">
              Gemini 2.5 Flash evalúa el estrés del tipo específico de cultivo y ejecuta decisiones
              Fail-Safe.
            </Point>
          </div>
        </div>
      );

    // ---- Slide 5: Arquitectura y Transparencia ----
    case 4:
      return (
        <div>
          <Eyebrow color="text-purple-300">Arquitectura · Google Cloud</Eyebrow>
          <SlideTitle>Arquitectura y Transparencia</SlideTitle>
          <p className="mt-3 text-pretty text-sm leading-relaxed text-slate-400">
            Del sensor al riego: ciclo autónomo de extremo a extremo sobre la suite de Google Cloud.
          </p>

          <div className="mt-6">
            <ArchitectureDiagram compact />
          </div>

          {/* Compact transparency footnote (verbatim, de-emphasized) */}
          <p className="mt-5 flex items-start gap-2 rounded-lg border border-gyellow/20 bg-gyellow/5 px-3 py-2 text-[11px] leading-snug text-slate-400">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gyellow" aria-hidden />
            <span>
              <span className="font-semibold text-gyellow">Nota de Transparencia (PoC):</span>{' '}
              Nuestra interfaz de monitoreo espacial utiliza cartografía satelital estándar para
              simular la capa de Índice de Vegetación (NDVI), cuya integración con Google Earth
              Engine está en proceso de validación corporativa.
            </span>
          </p>
        </div>
      );

    // ---- Slide 6: Modelo de Negocios ----
    case 5:
      return (
        <div>
          <Eyebrow color="text-ggreen">Go-to-Market</Eyebrow>
          <SlideTitle>Modelo de Negocios</SlideTitle>
          <p className="mt-6 text-2xl font-black sm:text-3xl">
            <span className="bg-gradient-to-r from-gblue to-ggreen bg-clip-text text-transparent">
              SaaS habilitado por Hardware.
            </span>
          </p>
          <div className="mt-6 grid gap-4">
            <Point icon={Handshake} accent={ACC.blue} title="Barrera de entrada baja">
              Red de sensores en comodato.
            </Point>
            <Point icon={Repeat} accent={ACC.green} title="Ingreso recurrente">
              Suscripción anual cobrada por hectárea monitoreada.
            </Point>
            <Point icon={Rocket} accent={ACC.yellow}>
              Escalabilidad inmediata con costos marginales cercanos a cero gracias a Google Cloud.
            </Point>
          </div>
        </div>
      );

    // ---- Slide 7: Demo Time ----
    case 6:
      return (
        <div className="flex flex-col items-center text-center">
          <Eyebrow color="text-gblue">Demo Time</Eyebrow>
          <h2 className="mt-6 text-balance font-black leading-tight tracking-tight text-white text-[clamp(2rem,8vw,5rem)]">
            El campo en la palma de la mano.
          </h2>
          <button
            type="button"
            onClick={onExit}
            className="group mt-12 inline-flex items-center gap-4 rounded-3xl bg-gradient-to-r from-gblue to-ggreen px-8 py-5 text-xl font-black text-white shadow-[0_20px_60px_-15px_rgba(66,133,244,0.6)] transition hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gblue/50 sm:px-10 sm:py-6 sm:text-3xl"
          >
            <Play className="h-7 w-7 fill-current sm:h-8 sm:w-8" aria-hidden />
            INICIAR DEMOSTRACIÓN
          </button>
          <p className="mt-6 flex items-center gap-2 text-sm text-slate-400">
            <Smartphone className="h-4 w-4" aria-hidden />
            Dashboard de múltiples sensores en vivo
          </p>
        </div>
      );

    default:
      return null;
  }
}
