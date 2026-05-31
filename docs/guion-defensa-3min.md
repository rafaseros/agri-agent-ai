# Guion de defensa en vivo (3:00) — AgriAgent · Equipo Full_Stack

> **Esto NO es el video.** Es el pitch que se habla frente al jurado. Tono: seguro, cercano,
> con energía. ~150 palabras/min ≈ **440 palabras ≈ 2:55–3:05**. Dejá una pausa después del
> hook y otra antes de la demo. Mirá al jurado, no a las slides.
> Demo en vivo: https://agriagent-hackathon-2026-6ded8.web.app

## Presupuesto de tiempo

| Bloque | Tiempo | Slide |
| --- | --- | --- |
| Apertura / hook | 0:00 – 0:20 | Título |
| El problema | 0:20 – 0:45 | El Problema |
| El mercado | 0:45 – 1:10 | El Mercado |
| La solución | 1:10 – 1:45 | La Solución |
| Arquitectura y transparencia | 1:45 – 2:15 | Arquitectura |
| Modelo de negocio | 2:15 – 2:35 | Modelo de Negocios |
| Demo + cierre | 2:35 – 3:00 | Demo Time |

---

## Narración

**[0:00 · Apertura — Título]**
Buenos días. Imaginen un campo de mil hectáreas donde cada gota de agua se decide… a ojo.
Así se riega hoy en Santa Cruz. Somos el equipo **Full_Stack**, y construimos **AgriAgent:
riego predictivo impulsado por Inteligencia Artificial**. Porque no venimos a apagar bombas de
agua — venimos a **detonar el máximo potencial genético de cada semilla**.

**[0:20 · El problema]**
El productor riega por intuición, y eso cuesta caro de dos maneras. Si **falta** agua en
floración, el rendimiento cae **hasta un 40%**. Si **sobra**, se desperdicia el agua, se ahogan
las raíces y se agotan los acuíferos. El problema no es la falta de agua: es la falta de
**PRECISIÓN** sobre cuándo y cuánto regar.

**[0:45 · El mercado]**
¿Y de qué tamaño es el problema? Nuestro mercado es el **Norte Integrado**: más de **1.5 millones
de hectáreas** de soya, maíz y sorgo. Para el productor, recuperar ese 40% son unos **$400 por
hectárea**. Y si capturamos apenas el **10%** del mercado, ahorraríamos **225 mil millones de
litros de agua al año**. Esto no es un nicho: es una industria.

**[1:10 · La solución]**
AgriAgent resuelve esto en tres capas. Primero, **sensores IoT** de bajo costo que leen la humedad
del suelo, gestionados desde una **app mobile-first**. Segundo, **contexto bioclimático real** con
Open-Meteo. Y tercero —el corazón— un **cerebro autónomo: Gemini 2.5 Flash**, que evalúa el estrés
de cada cultivo y decide el **momento exacto de regar**. No avisa: **decide y actúa**. Y si un
sensor pierde señal, **corta la bomba por seguridad**: protocolo *fail-safe*.

**[1:45 · Arquitectura y transparencia]**
Todo corre de extremo a extremo sobre **Google Cloud**: del sensor a **Firebase Hosting**, a
**Cloud Functions**, al cerebro en **Vertex AI**, y de vuelta al riego. Cada decisión queda
registrada en **BigQuery**, con su razonamiento. Y quiero ser transparente, porque la honestidad
es credibilidad: la capa **NDVI hoy es simulada**, la integración con **Earth Engine está en
validación**. Pero el clima es real, la IA es real, y el sistema **está corriendo en vivo**.

**[2:15 · Modelo de negocio]**
El modelo: **SaaS habilitado por hardware**. Bajamos la barrera de entrada poniendo los sensores
en **comodato**, generamos **ingreso recurrente** con una suscripción anual por hectárea, y
escalamos con **costo marginal casi cero** sobre Google Cloud.

**[2:35 · Demo + cierre]**
Y no se los cuento, se los muestro. *(clic → app)* Creamos un lote, corre la **recolección de
datos**, y el agente decide —sensor por sensor— **regar o no**, y les explica **por qué**.
AgriAgent **ya está en vivo**. Lo próximo: un **piloto de campo**. Cada gota, en el momento exacto.
Somos el equipo **Full_Stack**. Gracias.

---

## Preguntas del jurado (preparadas)

- **¿El NDVI / la imagen satelital es real?**
  En el PoC es **simulado**; la integración con Google Earth Engine está en validación. Lo que
  **sí es real** es el clima (Open-Meteo) y el razonamiento de la IA. Preferimos ser transparentes.

- **¿Por qué IA generativa y no reglas fijas (un umbral de humedad)?**
  Una regla fija no entiende contexto. Gemini cruza humedad + pronóstico + tipo de cultivo,
  **explica cada decisión** en lenguaje natural, y maneja **múltiples cultivos** sin reprogramar.

- **¿Cuánto cuesta la IA? ¿Es rentable?**
  Gemini 2.5 Flash es de bajo costo y el stack es serverless: **costo marginal casi cero** por
  hectárea adicional. El valor para el productor (~$400/ha recuperados) es órdenes de magnitud mayor.

- **¿Qué pasa si se cae la conexión o falla un sensor?**
  Protocolo **fail-safe**: ante pérdida de señal, el agente **mantiene la bomba apagada** para no
  regar a ciegas. La seguridad del recurso manda.

- **¿Está validado en campo?**
  Hoy es un **PoC funcional y desplegado en vivo**. El siguiente paso es un **piloto de campo** con
  un productor del Norte Integrado para medir ahorro de agua y delta de rendimiento reales.

- **¿Cómo lo monetizan?**
  **SaaS por hectárea** (suscripción anual) + **sensores en comodato** para bajar la barrera de
  entrada. Ingreso recurrente, escalable.

---

## Tips de entrega y demo

1. **Calentá Cloud Run** con un tick ANTES de presentar (evita el arranque en frío en la demo).
2. Para forzar que la IA diga **REGAR**: poné un sensor con **humedad baja (~15%)** y sin lluvia
   pronosticada.
3. Practicá el bloque de demo: crear lote → recolección → decisión → **mostrar el fail-safe**
   (es el momento más memorable).
4. Si te pasás de tiempo, recortá el **mercado** (bloque 0:45) — son los números más fáciles de
   resumir. Nunca recortes la **transparencia** ni la **demo**.
