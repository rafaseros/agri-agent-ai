# Estado del pitch — qué quedó listo y qué falta

> Revisión del pitch contra criterios de hackatón de Google (impacto · innovación · uso de la
> suite Google · viabilidad · presentación) y contra el producto en vivo
> (https://agriagent-hackathon-2026-6ded8.web.app).

## 🎯 Reenfoque (decisión con los mentores)
- **El enfoque de combustible/energía se DESCARTA por completo** — es un tema político sensible en la región. Removido de documentos, README y código.
- **Foco:** aprovechamiento del recurso hídrico (agua) + **maximización de la producción** con buen uso del riego.
- **Problema CONCISO:** explicarlo para que se entienda en poco tiempo → dejar más minutos para la **solución** durante el pitch. (Aplicado en la Sección 1 del documento de negocio.)

---

## ✅ Ya aplicado al `documento-negocio.md`
- Gancho/visión (one-liner) al inicio.
- **Problema conciso** (déficit hídrico + sobre-riego → −40% rendimiento + agotamiento de acuíferos), entendible en ~20s.
- **Mercado con TAM/SAM/SOM** + las cifras de impacto (1,5M ha · ~$400/ha · 225 mil millones L) + bloque "Fuentes y supuestos".
- **Sección Arquitectura + Stack Google Cloud** (Firebase Hosting · Cloud Run · Vertex AI/Gemini 2.5 · BigQuery) con diagrama del ciclo cerrado.
- **Transparencia** (NDVI simulado, GEE en validación) — alineada con el deck.
- **Modelo de negocio con números:** precio ~$15–25/ha/año + tabla de **ROI del agricultor** (~20×, payback < 1 campaña) + proyección 3 años.
- **Moat real** (data flywheel + distribución ANAPO + switching cost).
- **Roadmap** (MVP → piloto → escala) e **Impacto/KPIs**.
- **Equipo** (parcial — ver pendientes) y **Guion de demo + URL + Ask**.
- **4 cultivos** (Soya, Maíz, Sorgo, **Trigo**) y **Cloud Run** (corregido vs "Cloud Functions").
- PESTEL/FODA/Canvas movidos a **Anexos** (respaldo para preguntas del jurado).

---

## 🟡 Falta de TU lado (necesita tu input real)
- **Nombres y roles de los 2 integrantes restantes** (en la Sección 9 quedaron como `[completar]`).
- **Validar/ajustar los números** (precio/ha, ROI, proyección) con datos reales del equipo.
- **Citar una fuente concreta** (FAO / estudio agronómico) para los rangos −40% / −30%.
- **Confirmar el backend real:** la app le pega a Cloud Run (`...run.app`). Verificá si la ingesta usa Cloud Run, Cloud Functions o ambos, y **alineá el nodo del diagrama** en la pestaña Arquitectura (hoy dice "Cloud Functions").

---

## 🟢 Limpieza técnica (hecha)
- Enfoque de combustible/energía removido de: `documento-negocio.md`, este doc, `README.md` (raíz), `agriagent-mvp/README.md`, y el simulador (`agentLogic.js`, `server.js`, historial → reenfocado a "agua ahorrada" en `waterHistory.js`) + un campo colgado en `normalizeStatus.js`.
- El **deck y la app desplegada ya estaban limpios** (se removió en la fase de producción).

---

## 📋 Recordatorio Demo Day
- **Calentá Cloud Run** unos minutos antes (cold start).
- **Ensayá el flujo completo en la URL pública** (no en localhost).
- Abrí la app ~30s antes de que el jurado mire, para que la primera carga ya haya pasado.
- Llevá el demo **grabado** como respaldo por si falla el WiFi del venue.
