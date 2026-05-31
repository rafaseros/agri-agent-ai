# Documento de Negocio: AgriAgent

> **Riego predictivo con IA para aprovechar mejor el agua y maximizar la producción.**
> Hackatón Build With AI 2026 · Categoría Agro · Santa Cruz de la Sierra, Bolivia · Equipo de 3.
>
> 🌐 Demo en vivo: **https://agriagent-hackathon-2026-6ded8.web.app**

---

## 0. Visión (el gancho)

> *"No venimos a apagar bombas de agua; venimos a detonar el máximo potencial genético de cada semilla."*

Cada gota de agua aplicada en el momento correcto se convierte en rendimiento. Cada gota aplicada de más se desperdicia y agota el acuífero. **AgriAgent** usa IA para que el riego deje de ser intuición y pase a ser una decisión precisa, automática y auditable.

---

## 1. El Problema — Riego a ciegas *(en 20 segundos)*

El productor riega por intuición o por miedo a la sequía. Eso genera dos errores caros:

- **Déficit hídrico:** falta de agua en etapas clave (floración) → estrés que reduce el rendimiento **hasta un 40%**.
- **Sobre-riego:** agua de más → ahoga raíces (hipoxia), lava nutrientes (lixiviación) y **agota los acuíferos** de la región.

**Resultado:** menos toneladas por hectárea y un recurso hídrico escaso que se desperdicia. El problema no es la falta de agua — es la **falta de precisión** sobre cuándo y cuánto regar.

**Usuario / beneficiario:** el **mediano y gran productor agrícola del Norte Integrado de Santa Cruz** (soya, maíz, sorgo, trigo) y el administrador de hacienda que hoy decide el riego "a ojo". Es quien paga la suscripción y quien gana en rendimiento y ahorro de agua.

---

## 2. La Solución — Riego predictivo de alta precisión

AgriAgent es un **agente agrícola autónomo**: cruza la humedad del suelo (sensores IoT) con el pronóstico del clima y razona, con IA generativa (Gemini), el estado de cada cultivo para decidir **el momento exacto de regar**. Mantiene a la planta en su zona de máximo rendimiento, **optimiza cada litro de agua** y registra cada decisión para auditoría.

No avisa: **decide y actúa** 24/7, con un comportamiento *fail-safe* (ante pérdida de señal, mantiene el riego cerrado por seguridad).

---

## 3. El Mercado — El Norte Integrado

**Impacto por hectárea**
- Superficie objetivo: **+1,5 millones de ha** cultivadas en el Norte Integrado (Soya, Maíz, Sorgo, Trigo).
- Valor protegido: salvar el 40% del rendimiento ≈ **1 tonelada de grano/ha** ≈ **~$400 USD/ha** para el productor.
- Impacto ecológico: reducir 30% el desperdicio ahorra **~1,5 millones de litros de agua por hectárea/año**. Al capturar 10% del mercado → **~225 mil millones de litros de agua/año**.

**Tamaño de mercado** *(estimaciones de lanzamiento, a validar)*
- **TAM:** área irrigada total en geografías objetivo × precio/ha.
- **SAM:** 1,5M ha (Norte Integrado) × ~$20/ha/año ≈ **$22–37M ARR**.
- **SOM (3 años):** ~1% del SAM ≈ **$220–375K ARR**.

> **Fuentes y supuestos:** los rangos de pérdida por déficit hídrico (hasta 40% en floración) y desperdicio por sobre-riego (~30%) se apoyan en literatura agronómica/FAO *(citar fuente específica)*. El cálculo de 225 mil millones de L = (agua ahorrada/ha/año) × (10% × 1,5M ha). El $400/ha se deriva de: rendimiento (t/ha) × precio ($/t) × % de rendimiento protegido.

---

## 4. Arquitectura y Stack Google Cloud

El sistema es un **ciclo cerrado autónomo**, 100% sobre la suite de Google Cloud:

```
Sensores IoT (campo) → App · Firebase Hosting → Cloud Run (backend del agente)
   → Vertex AI · Gemini 2.5 Flash (decide REGAR / NO REGAR) → Acción: riego
   → BigQuery (historial y analítica)            ↑ contexto: Open-Meteo (pronóstico)
```

| Capa | Servicio Google | Función |
| --- | --- | --- |
| Frontend (Hub) | **Firebase Hosting** | App móvil-first, transmite el estado del lote |
| Backend / ingesta | **Cloud Run** | Recibe los datos y orquesta la decisión |
| Cerebro | **Vertex AI · Gemini 2.5 Flash** | Evalúa estrés del cultivo + clima → decide |
| Historial | **BigQuery** | Registro auditable y analítica |
| Contexto climático | Open-Meteo (3rd party) | Pronóstico para anticipar lluvia |

### Transparencia (PoC)
La capa de monitoreo espacial (NDVI) es **simulada** con cartografía satelital estándar; la integración con **Google Earth Engine está en proceso de validación corporativa** (no productiva). El clima sí es real (Open-Meteo). *Mostramos lo que es real y etiquetamos lo que aún no — la honestidad técnica es parte de la propuesta.*

---

## 5. Modelo de Negocio

**B2B · SaaS habilitado por hardware.** La barrera de entrada es baja: los sensores se proveen en comodato o a precio de costo, y el valor se monetiza por **suscripción anual por hectárea monitoreada** — la misma métrica con la que el agricultor mide su negocio.

**Números *(estimaciones de lanzamiento)***
- SaaS: **~$15–25 / ha / año**.
- Instalación: fee único por lote + nodo de sensor (BOM ESP32 ≈ $15–40).
- Costo marginal cloud por hectárea: **cercano a cero** (alta escalabilidad).

**ROI del agricultor (finca de 100 ha de Soya)** — *la carta más fuerte*
| Concepto | Monto |
| --- | --- |
| Costo AgriAgent | ~$2.000 / año (100 ha × $20) |
| Valor de rendimiento protegido | ~$40.000 (100 ha × $400) |
| **Retorno** | **~20× · payback < 1 campaña** |

**Proyección direccional**
- Año 1 (piloto): ~1.000 ha · ~$20K ARR.
- Año 2 (vía ANAPO): ~10K ha · ~$200K ARR.
- Año 3 (regional): ~50–100K ha · ~$1M+ ARR.

---

## 6. Ventaja Competitiva y Moat

| Competidor | Limitación | Ventaja AgriAgent |
| --- | --- | --- |
| Temporizadores automáticos | Riegan "a ciegas" a horas fijas | Dinámico: si va a llover, la IA cancela el riego |
| Sensores IoT básicos | Informan, pero el humano decide | **Autonomía**: decide y ejecuta 24/7 |
| AgTech corporativa (ej. John Deere) | Costosa, cerrada, atada a su maquinaria | **Agnóstico y accesible**: se integra con las bombas existentes |

**Moat real (no son features copiables):**
1. **Data flywheel** — cada finca/campaña entrena mejores modelos de riego por microclima del Norte Integrado (dataset agronómico propietario).
2. **Distribución** — lock vía ANAPO/cooperativas.
3. **Switching cost** — una vez integradas bombas + sensores + histórico en BigQuery, migrar es caro.

---

## 7. Roadmap

- **Hoy / MVP:** app desplegada en vivo + agente Gemini decidiendo + fail-safe + multicultivo.
- **0–6 meses:** piloto en 1–2 haciendas reales vía ANAPO; validar la integración real con Google Earth Engine (NDVI productivo).
- **6–18 meses:** escalar por hectárea en el Norte Integrado → región (países con estrés hídrico similar).

---

## 8. Impacto y KPIs

- **Mercado:** +1,5M ha · valor ~$400/ha protegido · ~225 mil millones L de agua ahorrables al 10% de penetración.
- **KPIs de piloto a medir:** litros de agua/ha ahorrados · % de decisiones de la IA vs riego manual · uptime del fail-safe · Δ rendimiento (t/ha) vs parcela control.

> Nota: la analítica en vivo de la app hoy muestra **riegos activados por la IA · sensores monitoreados · humedad promedio**. El ahorro de agua se presenta como métrica **derivada** (riegos evitados × lámina de riego).

---

## 9. El Equipo — **Full_Stack**

| Integrante | Rol |
| --- | --- |
| José Rafael Gallegos Rojas | Estrategia, negocio y pitch |
| Alex Mendizabal Alvarez | IA / Backend & Google Cloud |
| Jimmy Abramham Flores Jordan | Frontend / UX & demo |

---

## 10. Demo en vivo y Ask

**Guion del demo (60–90s):** abrir la app en el celular → crear lote (sensores autogenerados) → correr el simulador de 24h → mostrar la IA decidiendo **REGAR / NO REGAR** y su razonamiento → activar **pérdida de señal** y mostrar el **fail-safe** cortando la bomba → cerrar con el **mapa satelital** y la **analítica**.

🌐 **Probalo ahora:** https://agriagent-hackathon-2026-6ded8.web.app

**El Ask:** ganar la categoría Agro, créditos de **Google Cloud for Startups**, y un **piloto de campo** con un socio como ANAPO.

---

# Anexos — Respaldo estratégico (para preguntas del jurado)

## A. PESTEL
- **Político:** impulso a la seguridad alimentaria y a la gestión sostenible de cuencas hidrográficas.
- **Económico:** altos costos de insumos → presión por maximizar el rendimiento (t/ha).
- **Social:** cambio generacional en el agro; administradores nativos digitales.
- **Tecnológico:** IA generativa democratizada + hardware IoT barato + APIs climáticas precisas.
- **Ecológico:** sequías extremas y agotamiento de acuíferos → valor del "uso responsable del agua" (ESG).
- **Legal:** regulación futura más estricta sobre extracción de aguas subterráneas favorece a quien monitorea y audita.

## B. FODA
- **Fortalezas:** motor de IA generativa multicultivo (Soya, Maíz, Sorgo, Trigo); arquitectura *fail-safe*; infraestructura serverless de bajo costo.
- **Oportunidades:** urgencia climática; interés de VCs en AgTech sostenible; escalabilidad regional.
- **Debilidades:** resistencia al cambio del agricultor tradicional; dependencia de conectividad rural (mitigada por el fail-safe).
- **Amenazas:** AgTech corporativa con ecosistemas cerrados; cortes prolongados de telecomunicaciones en el campo.

## C. Business Model Canvas
- **Segmentos:** medianos y grandes productores (soya, maíz, sorgo, trigo), administradores de haciendas, agroindustria.
- **Propuesta de valor:** maximizar la productividad por hectárea y proteger el recurso hídrico con decisiones de riego automáticas, predictivas y auditables desde el móvil.
- **Canales:** B2B directo, pilotos en campo, alianzas con asociaciones (ANAPO), ferias AgTech.
- **Relación:** soporte técnico, asistencia de instalación, plataforma SaaS autoservicio.
- **Ingresos:** suscripción anual por hectárea + fee de instalación / nodos IoT.
- **Recursos clave:** Vertex AI / Google Cloud, datos meteorológicos (Open-Meteo), hardware IoT (ESP32), equipo técnico/agronómico.
- **Actividades clave:** mejora de los modelos de IA, gestión de la red de sensores, análisis de datos, soporte.
- **Socios clave:** proveedores de electrónica, Google Cloud for Startups, cooperativas, centros de investigación agronómica.
- **Costos:** cómputo cloud (Vertex AI, BigQuery), I+D, manufactura de sensores, marketing, logística de instalación.
