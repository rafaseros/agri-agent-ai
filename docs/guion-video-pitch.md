# Guion del video pitch (≤ 2 min) — AgriAgent · Equipo Full_Stack

> Estructura alineada a los lineamientos oficiales: Problema → Usuario → Solución → Demo →
> Tecnología → Impacto → Próximos pasos. Enfoque: **agua + producción** (sin diésel).
> Ritmo objetivo: ~150 palabras/min. Demo en vivo: https://agriagent-hackathon-2026-6ded8.web.app

| Tiempo | En pantalla | Voz en off |
| --- | --- | --- |
| **0:00–0:15** | Slide de título (pestaña Pitch) | En Santa Cruz, el agua define la cosecha. Pero hoy el productor riega por intuición: si riega de menos, pierde hasta el **40%** del rendimiento en floración; si riega de más, ahoga la raíz y agota el acuífero. **El problema no es la falta de agua: es la falta de precisión.** |
| **0:15–0:25** | Slide "El Problema" / foto de campo | Nuestro usuario es el **productor del Norte Integrado** —soya, maíz, sorgo, trigo— que hoy decide el riego a ojo. |
| **0:25–0:40** | Slide "La Solución" | **AgriAgent** es un agente agrícola autónomo: cruza la humedad del suelo con el pronóstico del clima y, con IA generativa, **decide el momento exacto de regar**. No avisa: decide y actúa. |
| **0:40–1:25** | **DEMO en vivo** (grabación de la app) | Veámoslo funcionando. Creamos un lote de soya y el sistema despliega sus sensores. Iniciamos la **recolección de datos**: a medida que la humedad baja, el agente —con **Gemini 2.5 en Vertex AI**— evalúa cada sensor y decide **REGAR o NO REGAR**, explicando por qué. Y acá lo clave: si un sensor **pierde señal**, el agente **corta la bomba por seguridad**. Nunca riega a ciegas. |
| **1:25–1:40** | Pestaña "Arquitectura" | Todo corre sobre **Google Cloud**: la app en **Firebase Hosting**, el agente en **Cloud Run con Vertex AI**, y el histórico en **BigQuery**. Somos transparentes: la capa satelital NDVI es una **simulación**; la integración con Earth Engine está en validación. |
| **1:40–1:55** | Slide "El Mercado" / impacto | El impacto: proteger el 40% del rendimiento equivale a unos **$400 por hectárea**, y reducir el desperdicio ahorra **más de un millón de litros de agua por hectárea al año** en el Norte Integrado. |
| **1:55–2:05** | Slide final / logo | AgriAgent **ya está en vivo**. Lo próximo: un **piloto de campo** esta campaña. Porque no venimos a apagar bombas: venimos a **detonar el potencial de cada semilla**. Equipo **Full_Stack**. Gracias. |

> ~240 palabras ≈ 1:45–2:00 con las pausas del demo. Si te pasás, recortá la fila de Arquitectura.

---

## Cómo producirlo rápido (ruta recomendada)

**La forma más rápida y creíble: grabación de pantalla del demo real + voz en off.**

1. **Calentá Cloud Run** (entrá a la app y hacé un tick de simulación) para que no haya *cold start* en cámara.
2. **Grabá la pantalla** mientras seguís el guion en la app:
   - Windows: `Win + G` (Xbox Game Bar) o **OBS Studio** (gratis).
   - Mac: `Cmd + Shift + 5`.
   - Alternativa 1-clic: **Loom**.
3. **La voz** (elegí una):
   - **A) Tu voz** — más auténtica; el jurado valora a la persona.
   - **B) IA (TTS)** si no querés grabarte: **Google Cloud Text-to-Speech** (encaja con el hackatón; voces es-US/es-419) o **ElevenLabs** (free tier, muy natural). Pegás el guion → generás el audio.
4. **Armá el video** en **CapCut** (gratis, fácil): metés la grabación + el audio, agregás un título al inicio y subtítulos automáticos, exportás en **1080p**. (Alternativa pro: DaVinci Resolve.)
5. **Largo:** recortá a **≤ 2:00** exactos (es tope obligatorio).

### Sobre los avatares de IA (HeyGen, Synthesia, Pictory…)
Funcionan, pero para un video de **demo** los desaconsejo hoy: requieren cuenta/créditos, se ven genéricos y **mostrar el producto real puntúa más** (y el rubric prohíbe falsear funcionalidades de IA — la honestidad es tu fortaleza). Usá la IA para el guion y la voz, no para fingir un presentador.

### Tips
- Grabá en **vertical u horizontal** según dónde lo suban; horizontal 1920×1080 es lo seguro.
- Hacé **2–3 tomas** del demo y quedate con la más limpia.
- Mostrá el momento **fail-safe** (apagar señal → bomba OFF) — es el clímax.
