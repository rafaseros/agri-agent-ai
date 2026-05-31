# 🌾 AgriAgent AI — Hackatón Build With AI 2026

**Riego predictivo con IA para aprovechar mejor el agua y maximizar la producción.**

- **Categoría:** Agro
- **Ubicación:** Santa Cruz de la Sierra, Bolivia
- **Equipo:** **Full_Stack**
  - José Rafael Gallegos Rojas — Estrategia, negocio y pitch
  - Alex Mendizabal Alvarez — IA y arquitectura cloud
  - Jimmy Abramham Flores Jordan — Frontend y datos
- 🌐 **Demo en vivo:** https://agriagent-hackathon-2026-6ded8.web.app

---

## El problema — riego a ciegas

El productor riega por intuición. Eso genera dos errores caros:

- **Déficit hídrico:** falta de agua en floración → reduce el rendimiento **hasta un 40%**.
- **Sobre-riego:** agua de más → ahoga raíces, lava nutrientes y **agota los acuíferos**.

El problema no es la falta de agua: es la **falta de precisión** sobre cuándo y cuánto regar.

## La solución — AgriAgent

Un **agente agrícola autónomo** que cruza la humedad del suelo (sensores IoT) con el pronóstico
del clima y razona, con **IA generativa (Gemini)**, el estado de cada cultivo para decidir el
**momento exacto de regar**. Optimiza cada litro de agua, protege el rendimiento y registra cada
decisión. No avisa: **decide y actúa**, con comportamiento *fail-safe* (ante pérdida de señal,
mantiene el riego cerrado por seguridad).

## Arquitectura (100% Google Cloud)

```
Sensores IoT → Firebase Hosting (app) → Cloud Run (agente)
   → Vertex AI · Gemini 2.5 Flash (decide REGAR / NO REGAR) → riego
   → BigQuery (historial)            ↑ contexto: Open-Meteo (pronóstico)
```

| Capa | Servicio Google |
| --- | --- |
| Frontend móvil-first | Firebase Hosting |
| Backend del agente | Cloud Run |
| Cerebro de decisión | Vertex AI · Gemini 2.5 Flash |
| Historial / analítica | BigQuery |

> **Transparencia (PoC):** la capa NDVI es simulada con cartografía satelital estándar; la
> integración con Google Earth Engine está en validación. El clima sí es real (Open-Meteo).

## Estructura del repo

```
agriagent-mvp/
  frontend/    # App React + Vite (desplegada en Firebase Hosting)
  simulator/   # Backend Node local (fallback para desarrollo / demo offline)
docs/          # Documento de negocio + revisión del pitch
```

## Documentación

- [`docs/documento-negocio.md`](docs/documento-negocio.md) — plan de negocio y backbone del pitch.
- [`docs/pendientes-presentacion.md`](docs/pendientes-presentacion.md) — estado y pendientes.
- [`agriagent-mvp/README.md`](agriagent-mvp/README.md) — cómo correr el MVP localmente.
