# Pendientes vs. lineamientos oficiales

> Mapeado contra `Build_With_AI_2026_Lineamientos_CompletosV1.pdf`.
> ⏰ **Entrega fase 1: HOY domingo 31/05, 10:00** (subir desde las 09:00). Sin ampliación.

## ✅ Fit de categoría
Mención **AGRO** → los lineamientos listan textualmente *"optimización de riego"* como problemática AGRO. **Encaje perfecto.** El enfoque de combustible/energía se descartó (sería mención ENERGÍA + tema político). Foco: **aprovechamiento del agua + maximización de producción**, problema real y verificable del **Norte Integrado de Santa Cruz**.

---

## 📦 Entregables obligatorios
- [x] **MVP / prototipo funcional** → desplegado en vivo: https://agriagent-hackathon-2026-6ded8.web.app
- [x] **Repositorio GitHub público** actualizado durante el evento.
- [x] **Lean Canvas** → `docs/lean-canvas.md` *(NUEVO — era el hueco crítico; es entregable Y criterio)*.
- [~] **Documento técnico** (investigación · problema · solución · arquitectura · aplicación de IA · FODA · PESTEL · Lean Canvas · análisis financiero · impacto) → `documento-negocio.md` cubre casi todo. **Falta:** citar 1–2 **fuentes de investigación** (FAO/estudio agronómico) para los rangos −40%/−30%.
- [ ] ⚠️ **Video pitch ≤ 2 min** → FALTA (acción del equipo).
- [ ] **Presentación (PPT / Canva / Gamma)** → tenemos el deck interactivo en la app; exportarlo a slides o usar la pestaña Pitch en vivo.

## 📁 Requisitos del repositorio
- [ ] ⚠️ **Nombre del equipo + los 3 integrantes en el README** → hoy hay 2 placeholders y falta el nombre del equipo.
- [ ] ⚠️ **Todos los integrantes como colaboradores en GitHub** (lo exige y lo revisan).
- [ ] **Imágenes referenciales en el README** (capturas del dashboard, pitch deck y arquitectura).
- [x] Explicación general + arquitectura + tecnologías + instrucciones de ejecución → en los README.

---

## 🎯 Criterios de evaluación (100 pts) — dónde estamos
| Criterio | Pts | Estado |
| --- | --- | --- |
| Impacto y relevancia del problema | 20 | Fuerte. **Reforzar el contexto LOCAL de Santa Cruz** y el beneficiario (✅ agregado al doc). |
| Calidad técnica de la IA | 20 | Fuerte — agente real Gemini 2.5 Flash que razona y decide. |
| Innovación y creatividad | 15 | Agente autónomo de **lazo cerrado** + fail-safe. |
| Integración de API, agentes de IA, librerías | 15 | Vertex AI (agente) + Open-Meteo (API) + Recharts/Leaflet. *(El rubric NO puntúa "Google" per se → enfatizar **agente de IA + integración de APIs**, no "suite Google".)* |
| FODA + PESTEL + **Lean Canvas** | 10 | ✅ los tres presentes ahora. |
| Escalabilidad y sostenibilidad | 10 | Costo marginal cloud ~0 + impacto hídrico/ESG. |
| Calidad del pitch y presentación | 10 | Alinear a la estructura recomendada (abajo). |
| **Bonus** | +10 | "100% aplicable y funcional" → **apuntar acá**: app desplegada y funcionando en vivo. |

---

## 🎤 Estructura recomendada del pitch (alinear el deck)
1. Problema identificado ✅
2. **Usuario / beneficiario** → ✅ agregado al doc; **asegurar que aparezca en el pitch**.
3. Enfoque de solución ✅
4. Demo funcional ✅ (in-app, en vivo)
5. Tecnología utilizada ✅ (arquitectura + agente de IA)
6. Impacto esperado ✅
7. **Próximos pasos** → tenemos Roadmap; **asegurar la slide/cierre de próximos pasos**.

> Nuestro deck tiene además Mercado y Modelo de Negocio (suma para "escalabilidad/viabilidad"). Solo confirmá que **Usuario/beneficiario** y **Próximos pasos** estén explícitos.

---

## 🔧 Acción del equipo (rápido, antes de las 10:00)
1. **Nombre del equipo + nombres reales** de los 2 integrantes restantes → completar en `README.md` y `documento-negocio.md` (Sección 9).
2. **Agregar a todos como colaboradores** del repo en GitHub.
3. **Grabar el video pitch** (≤2 min): problema → beneficiario → solución → **demo en vivo** → tecnología → impacto → próximos pasos.
4. **Capturas** para el README (dashboard, pitch, mapa satelital).
5. Validar el **precio/ha** y citar **1 fuente** (FAO) para −40%/−30%.
6. **Calentar Cloud Run** y ensayar el demo en la URL pública antes de presentar.
7. ⚠️ **Re-deployar la Cloud Function `agriagent-cerebro`** tras la limpieza del prompt (combustible → agua), para que el demo en vivo NO muestre "diésel" en el razonamiento de la IA.
8. ⚠️ Agregar la columna **`razonamiento` (STRING)** a la tabla BigQuery `historial_riego` (hoy el código la inserta pero la tabla no la tiene → la inserción falla en silencio).

## ✅ Limpieza ya hecha
- Enfoque de combustible/energía removido por completo (docs, ambos README, simulador, frontend).
- Lean Canvas creado; documento de negocio reenfocado a agua/producción; problema **conciso**.
- Inconsistencias corregidas: 4 cultivos (Soya/Maíz/Sorgo/Trigo), transparencia NDVI.
- **Backend en el repo:** Cloud Function `agriagent-cerebro` (Vertex AI + BigQuery) en `agriagent-mvp/backend/` + esquema BigQuery. Confirmado: es una **Cloud Function 2ª gen sobre Cloud Run** (resuelve la duda Cloud Run vs Cloud Functions).
