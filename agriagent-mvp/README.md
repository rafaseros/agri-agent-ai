# AgriAgent MVP

MVP del **AgriAgent AI** — riego autónomo con IA para **optimizar el uso del agua y maximizar la
producción** en Santa Cruz, Bolivia. Monorepo con dos partes:

```
agriagent-mvp/
  frontend/    # App del agricultor: React + Vite + Tailwind (desplegada en Firebase Hosting)
  simulator/   # Backend Node local — fallback para desarrollo / demo offline (Express :3001)
```

> **En producción** el frontend consume el agente real en **Cloud Run** (Vertex AI · Gemini 2.5
> Flash). El `simulator/` es un backend local opcional para desarrollar sin depender de la nube.

## Arquitectura en 30 segundos

1. **Sensores (simulados):** humedad de suelo por lote (la app genera los nodos por hectárea).
2. **Cerebro (Vertex AI · Gemini 2.5 Flash):** cruza humedad + clima (Open-Meteo) y decide
   **REGAR / NO REGAR** con razonamiento, optimizando el uso del agua y protegiendo el cultivo.
3. **Fail-safe:** ante pérdida de señal del sensor, el agente mantiene la bomba apagada por seguridad.
4. **Frontend:** pitch deck interactivo + dashboard (lotes, simulador de 24h, analítica con
   Recharts, mapa satelital).

> El clima es **real** (Open-Meteo, sin API key). La humedad de suelo es simulada.

## Frontend (la app)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Build de producción + deploy a Firebase Hosting:

```bash
npm run build
firebase deploy --only hosting
```

🌐 En vivo: **https://agriagent-hackathon-2026-6ded8.web.app**

## Simulador local (opcional — fallback offline)

```bash
cd simulator
npm install
npm run dev        # Express en http://localhost:3001  →  GET /api/status
```

Implementa la misma política del agente de forma local (reglas + Vertex AI) para desarrollar sin la nube.
