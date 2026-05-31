# AgriAgent MVP

MVP del **AgriAgent AI** — riego autónomo con IA para ahorrar diésel en Santa
Cruz, Bolivia. Monorepo con dos partes:

```
agriagent-mvp/
  simulator/   # Edge Sync: simula el ESP32 + agente de riego + API Express (3001)
  frontend/    # Dashboard del agricultor: React + Vite + Tailwind + recharts (5173)
```

## Arquitectura en 30 segundos

1. **`simulator/sensorData.js`** — simula el sensor de humedad de suelo del ESP32 (30–80%).
2. **`simulator/agentLogic.js`** — consulta el clima real de Open-Meteo para Santa Cruz
   e implementa la política del agente:
   - suelo `< 40%` **y** sin lluvia pronosticada → **Encender Bomba**
   - lluvia pronosticada (vía `weathercode` WMO) → **Apagar Bomba — ahorro de diésel**
3. **`simulator/server.js`** — Express en `:3001`, expone `GET /api/status` con el
   JSON consolidado (sensor + clima + decisión + historial de diésel).
4. **`frontend/`** — consume `/api/status` cada 5 s y muestra 3 tarjetas
   (temperatura, humedad, decisión de la IA) + gráfico de diésel ahorrado.

> El clima es **real** (Open-Meteo, sin API key). La humedad de suelo y el
> historial de diésel son simulados.

## Cómo levantarlo (dos terminales)

Necesitás **Node 18+** (probado en Node 22). El `fetch` es nativo — sin `node-fetch`.

### Terminal 1 — Backend (simulador)

```bash
cd simulator
npm install
npm run dev        # node --watch server.js  →  http://localhost:3001
```

Verificá que responde: abrí `http://localhost:3001/api/status` en el navegador.

### Terminal 2 — Frontend (dashboard)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Abrí **http://localhost:5173**. El dashboard se actualiza solo cada 5 segundos.

> **Importante:** levantá primero el backend. Si el frontend arranca sin el
> backend en `:3001`, muestra un estado de error claro hasta que el simulador esté arriba.
