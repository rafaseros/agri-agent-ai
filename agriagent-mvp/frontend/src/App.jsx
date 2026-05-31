import { useState, lazy, Suspense } from 'react';
import { Leaf, Sprout, Network, BarChart3, Map, Loader2, Presentation } from 'lucide-react';
import { useFarm } from './hooks/useFarm.js';
import FarmManager from './components/FarmManager.jsx';
import SimulationBar from './components/SimulationBar.jsx';

// Heavy / secondary views are code-split. The jury lands on the pitch deck;
// recharts / leaflet / the deck only download when their view opens — important
// on a rural mobile connection.
const PitchDeck = lazy(() => import('./components/PitchDeck.jsx'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard.jsx'));
const SatelliteMap = lazy(() => import('./components/SatelliteMap.jsx'));
const ArchitectureFlow = lazy(() => import('./components/ArchitectureFlow.jsx'));

export default function App() {
  const [view, setView] = useState('pitch'); // 'pitch' | 'farm' | 'map' | 'analytics' | 'architecture'
  const farm = useFarm();

  // The pitch deck is full-screen and lives OUTSIDE the Shell chrome.
  if (view === 'pitch') {
    return (
      <Suspense fallback={<FullScreenLoader />}>
        <PitchDeck onExit={() => setView('farm')} />
      </Suspense>
    );
  }

  return (
    <Shell view={view} onView={setView}>
      {view === 'farm' && (
        <div className="space-y-6">
          <SimulationBar
            simulating={farm.simulating}
            tick={farm.tick}
            pumpOnCount={farm.pumpOnCount}
            sensorCount={farm.sensores.length}
            onStart={farm.startSimulation}
            onStop={farm.stopSimulation}
          />
          <FarmManager
            lotes={farm.lotes}
            sensores={farm.sensores}
            onAddLote={farm.addLote}
            onAddSensor={farm.addSensor}
            onRemoveSensor={farm.removeSensor}
            onRemoveLote={farm.removeLote}
            onUpdateSensor={farm.updateSensor}
          />
        </div>
      )}

      {view !== 'farm' && (
        <Suspense fallback={<ViewLoader />}>
          {view === 'map' && <SatelliteMap lotes={farm.lotes} sensores={farm.sensores} />}
          {view === 'analytics' && (
            <AnalyticsDashboard
              history={farm.history}
              sensores={farm.sensores}
              pumpOnCount={farm.pumpOnCount}
            />
          )}
          {view === 'architecture' && <ArchitectureFlow />}
        </Suspense>
      )}
    </Shell>
  );
}

function ViewLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-slate-400">
      <Loader2 className="h-8 w-8 animate-spin text-gblue" />
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="grid h-dvh w-full place-items-center bg-zinc-950">
      <Loader2 className="h-10 w-10 animate-spin text-gblue" />
    </div>
  );
}

// App chrome: dark header + view toggle.
function Shell({ children, view, onView }) {
  return (
    <div className="min-h-screen w-full bg-zinc-950 px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gblue to-ggreen">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black tracking-tight text-white sm:text-2xl">
                AgriAgent · Farm Manager
              </h1>
              <p className="truncate text-sm text-slate-400">Santa Cruz · Gestión autónoma de riego</p>
            </div>
          </div>

          <ViewToggle view={view} onView={onView} />
        </header>

        <main className="mt-8">{children}</main>
      </div>
    </div>
  );
}

function ViewToggle({ view, onView }) {
  const tabs = [
    { id: 'pitch', label: 'Pitch', icon: Presentation },
    { id: 'farm', label: 'Granja', icon: Sprout },
    { id: 'map', label: 'Satelital', icon: Map },
    { id: 'analytics', label: 'Analítica', icon: BarChart3 },
    { id: 'architecture', label: 'Arquitectura', icon: Network },
  ];

  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = view === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onView(t.id)}
            aria-pressed={active}
            aria-label={t.label}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition sm:min-h-0 sm:py-2 ${
              active ? 'bg-white/10 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
