# Guion del video pitch (≤ 2 min) — AgriAgent · Equipo Full_Stack

> **Un bloque de narración por diapositiva**, alineado a lo que muestra cada slide del deck
> interactivo. Enfoque: agua + producción (sin diésel). ~150 palabras/min ≈ **1:45–2:00** total.
> Demo en vivo: https://agriagent-hackathon-2026-6ded8.web.app

| # | Diapositiva (lo que se ve) | Voz en off (lo que se graba) |
| --- | --- | --- |
| **1** | **Título** — "AgriAgent · Riego Predictivo impulsado por IA" + frase de impacto | AgriAgent: **riego predictivo impulsado por Inteligencia Artificial**. Porque no venimos a apagar bombas de agua — venimos a **detonar el máximo potencial genético de cada semilla**. |
| **2** | **El Problema** ("El Riego a Ciegas") — Déficit Hídrico · Sobre-riego · El Costo | Hoy se riega **a ciegas**. Si falta agua en floración, el rendimiento cae **hasta un 40%**. Si sobra, se desperdicia **30%** del agua, se ahogan las raíces y se agotan los acuíferos. El costo: menos rentabilidad y un recurso hídrico que se vacía. |
| **3** | **El Mercado** ("El Norte Integrado") — 1.5M ha · $400/ha · 225 mil millones L | Nuestro mercado es el **Norte Integrado**: más de **1.5 millones de hectáreas** de soya, maíz y sorgo. Para el productor, salvar ese 40% son unos **$400 por hectárea**; y al capturar solo el 10% del mercado, ahorraríamos **225 mil millones de litros de agua al año**. |
| **4** | **La Solución** ("AgriAgent") — Edge & Hub · Contexto Bioclimático · Cerebro Autónomo | La solución: **sensores IoT** de bajo costo desde una **app mobile-first**; **contexto bioclimático** con Open-Meteo; y un **cerebro autónomo —Gemini 2.5 Flash—** que evalúa el estrés de cada cultivo y ejecuta decisiones con protocolo **fail-safe**. |
| **5** | **Arquitectura y Transparencia** — diagrama del ciclo en Google Cloud + nota NDVI | Todo corre de extremo a extremo sobre **Google Cloud**: del sensor a **Firebase Hosting**, **Cloud Functions**, el cerebro en **Vertex AI**, y el riego; cada decisión queda en **BigQuery**. Y somos transparentes: la capa NDVI es **simulada**, la integración con Earth Engine está **en validación**. |
| **6** | **Modelo de Negocios** ("Go-to-Market") — SaaS + comodato + suscripción/ha + escala | El modelo: **SaaS habilitado por hardware**. Barrera de entrada baja —los sensores van en **comodato**—, **ingreso recurrente** por suscripción anual por hectárea, y **escalabilidad** inmediata con costo marginal casi cero en Google Cloud. |
| **7** | **Demo Time** — "El campo en la palma de la mano" + botón → app en vivo | **Demo time: el campo en la palma de la mano.** *(clic en INICIAR DEMOSTRACIÓN → app)* Creamos un lote, corre la **recolección de datos**, y el agente decide —por cada sensor— **regar o no**. Si uno **pierde señal, corta la bomba por seguridad**. AgriAgent **ya está en vivo**; lo próximo, un **piloto de campo**. Equipo **Full_Stack**. |

> **Total ≈ 250 palabras ≈ 1:45.** Deja margen para el clic al demo y las pausas → entra en los 2:00.
> Si te pasás, recortá la fila 3 (mercado) o la 5 (arquitectura).

---

## Producción (regrabar rápido)
1. Grabá **un audio por fila** (bloques 1–7) y juntalos en orden — así cada narración cae sobre su slide.
2. Para el bloque 7, sincronizá con la **grabación de pantalla** del demo real (crear lote → recolección → decisión → fail-safe).
3. Voz: tuya, o IA (Google Cloud TTS / ElevenLabs). Ensamblá en **CapCut** (subtítulos automáticos), exportá 1080p, **≤ 2:00**.

## Tip para el demo (bloque 7)
Para que la IA diga **REGAR**: poné un sensor con **humedad baja (~15%)** y sin lluvia pronosticada. Antes de grabar, **calentá Cloud Run** (un tick) para evitar el arranque en frío.
