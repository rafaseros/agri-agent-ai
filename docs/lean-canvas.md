# Lean Canvas — AgriAgent

> Entregable obligatorio (Hackatón Build With AI 2026 · mención **AGRO** · Santa Cruz, Bolivia).
> Problema real y verificable del **Norte Integrado de Santa Cruz**: optimización de riego.

| # | Bloque | Contenido |
| --- | --- | --- |
| 1 | **Problema** | (1) Riego por intuición → **déficit hídrico** en floración reduce el rendimiento hasta 40%. (2) **Sobre-riego** → ahoga raíces, lava nutrientes y agota acuíferos. (3) El productor no sabe **cuándo ni cuánto** regar con precisión. **Alternativas actuales:** temporizadores "ciegos", sensores IoT pasivos (solo informan), o pura intuición. |
| 2 | **Segmentos de clientes** | Medianos y grandes productores agrícolas del Norte Integrado (soya, maíz, sorgo, trigo) y administradores de hacienda. **Early adopters:** haciendas tecnificadas con administradores nativos digitales, abiertas a piloto. |
| 3 | **Propuesta de valor única** | *"Riego predictivo con IA: cada gota en el momento exacto para maximizar el rendimiento y cuidar el agua."* **Concepto:** un agrónomo autónomo 24/7 que decide y actúa, no solo avisa. |
| 4 | **Solución** | (1) IA generativa (Vertex AI · Gemini 2.5 Flash) que cruza humedad + clima y decide REGAR/NO REGAR con razonamiento. (2) Multicultivo (soya, maíz, sorgo, trigo). (3) *Fail-safe*: ante pérdida de señal, mantiene la bomba apagada por seguridad. |
| 5 | **Canales** | B2B directo · pilotos en campo · alianzas con asociaciones de productores (ANAPO) · ferias AgTech. |
| 6 | **Flujos de ingreso** | Suscripción anual SaaS **~$15–25 / ha monitoreada** + fee único de instalación / nodos de sensores IoT. |
| 7 | **Estructura de costos** | Cómputo cloud (Vertex AI, BigQuery) — costo marginal por ha cercano a cero · hardware IoT (ESP32, financiado) · I+D · soporte e instalación. |
| 8 | **Métricas clave** | Hectáreas monitoreadas · litros de agua/ha ahorrados · % de decisiones de la IA vs riego manual · Δ rendimiento (t/ha) vs parcela control · uptime del fail-safe · retención anual. |
| 9 | **Ventaja injusta** | **Data flywheel**: cada finca/campaña entrena modelos de riego mejores por microclima del Norte Integrado (dataset agronómico propietario) · lock de distribución vía cooperativas · switching cost (bombas + sensores + histórico en BigQuery). |

---

### Concepto de alto nivel
**"Waze del riego"** — la IA conoce el estado del campo y el pronóstico, y le dice al productor exactamente cuándo regar para no perder rendimiento ni desperdiciar agua.

> El Business Model Canvas detallado (versión extendida) está en `documento-negocio.md`, Anexo C.
> Esta versión **Lean Canvas** es la requerida por los lineamientos (criterio FODA/PESTEL/Lean Canvas).
