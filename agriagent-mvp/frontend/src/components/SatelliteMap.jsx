import 'leaflet/dist/leaflet.css';
import { Fragment } from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Tooltip } from 'react-leaflet';
import { Satellite, AlertTriangle } from 'lucide-react';
import {
  MAP_CENTER,
  MAP_ZOOM,
  loteGeo,
  sensorPositions,
  loteMoisture,
  stressColor,
  stressLabel,
} from '../lib/geo.js';

// Satellite view of the lotes. Polygons are colored by simulated water stress
// (driven by the 24h simulator); sensors are vector pins. A prominent badge
// keeps the GEE integration honestly labeled as pending/simulated.
export default function SatelliteMap({ lotes, sensores }) {
  if (lotes.length === 0) {
    return (
      <section>
        <Header />
        <div className="flex h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-slate-900/40 text-center">
          <Satellite className="h-12 w-12 text-slate-600" />
          <p className="mt-4 text-lg font-semibold text-white">No hay lotes para mostrar</p>
          <p className="mt-1 text-sm text-slate-500">
            Configurá lotes en la pestaña <span className="font-semibold text-slate-300">Granja</span>{' '}
            y aparecerán acá sobre el satélite.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <Header />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl">
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          scrollWheelZoom
          className="h-[60vh] w-full sm:h-[70vh]"
          style={{ background: '#0a0a0a' }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics"
            maxZoom={18}
          />

          {lotes.map((lote, i) => {
            const geo = loteGeo(i, lote.hectareas);
            const loteSensors = sensores.filter((s) => s.loteId === lote.id);
            const avg = loteMoisture(loteSensors);
            const color = stressColor(avg);
            const positions = sensorPositions(geo, loteSensors.length);

            return (
              <Fragment key={lote.id}>
                <Polygon
                  positions={geo.polygon}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.35, weight: 2 }}
                >
                  <Tooltip direction="top" sticky>
                    <div className="text-xs">
                      <strong>
                        {lote.cultivo} · {lote.hectareas} ha
                      </strong>
                      <br />
                      Estado: {stressLabel(avg)}
                      {avg != null && ` (${Math.round(avg)}% hum.)`}
                    </div>
                  </Tooltip>
                </Polygon>

                {loteSensors.map((s, j) => (
                  <CircleMarker
                    key={s.id}
                    center={positions[j]}
                    radius={6}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 2,
                      fillColor: s.conexion_activa ? '#38bdf8' : '#ea4335',
                      fillOpacity: 1,
                    }}
                  >
                    <Tooltip direction="top">
                      <div className="text-xs">
                        <strong>{s.id}</strong>
                        <br />
                        Humedad: {s.humedad_superficie}%
                        <br />
                        {s.conexion_activa ? 'En línea' : 'Sin señal'}
                      </div>
                    </Tooltip>
                  </CircleMarker>
                ))}
              </Fragment>
            );
          })}
        </MapContainer>

        {/* Transparency badge — REQUIRED: GEE is not really integrated. */}
        <div className="pointer-events-none absolute right-3 top-3 z-[1000] inline-flex max-w-[70%] items-center gap-2 rounded-lg border border-gyellow/40 bg-zinc-950/85 px-3 py-2 text-[11px] font-bold text-gyellow shadow-lg backdrop-blur-sm sm:max-w-none sm:text-xs">
          <AlertTriangle className="h-4 w-4" />
          Modo Simulación · Integración GEE Pendiente
        </div>

        {/* Stress legend */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] rounded-lg border border-white/10 bg-zinc-950/85 px-3 py-2 text-xs text-slate-300 shadow-lg backdrop-blur-sm">
          <p className="mb-1.5 font-semibold uppercase tracking-wide text-slate-400">Capa NDVI simulada</p>
          <Legend color="#34a853" label="Saludable (≥50%)" />
          <Legend color="#fbbc05" label="Estrés leve (30-49%)" />
          <Legend color="#ea4335" label="Estrés hídrico (<30%)" />
        </div>
      </div>
    </section>
  );
}

function Header() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-ggreen/15 ring-1 ring-ggreen/30">
        <Satellite className="h-5 w-5 text-ggreen" />
      </div>
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white">Vista satelital</h2>
        <p className="text-sm text-slate-400">Norte Integrado · Santa Cruz, Bolivia</p>
      </div>
    </div>
  );
}

function Legend({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
