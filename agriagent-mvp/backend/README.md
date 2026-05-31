# AgriAgent — Backend (Cloud Function · `agriagent-cerebro`)

El **cerebro** del agente: una **Cloud Function de 2ª generación** (Functions Framework) desplegada
en **Cloud Run** (`us-central1`). Recibe el estado del lote, consulta el clima, decide el riego con
**Vertex AI · Gemini 2.5 Flash** y registra cada decisión en **BigQuery**.

URL en producción: `https://agriagent-cerebro-455757636530.us-central1.run.app`

## Flujo

```
POST /  { sensor_id, cultivo, hectareas, humedad_superficie, humedad_profunda,
          conexion_activa, minutos_desconectado }
   → Open-Meteo (clima actual + pronóstico a mañana)
   → Vertex AI · Gemini 2.5 Flash  → { decision: "ON"|"OFF", reasoning }
   → BigQuery  (agriagent_data.historial_riego)
   ← JSON { estado_red, lote, sensor, clima:{actual,pronostico}, agente:{decision,reasoning} }
```

- **Fail-safe:** si `conexion_activa` es `false`, el prompt fuerza el protocolo de seguridad (bomba OFF).
- **CORS** abierto (`*`) para que el frontend en Firebase Hosting lo consuma.
- **Robusto:** parseo defensivo del JSON de Gemini y `try/catch` por etapa (clima, IA, BigQuery) para no caerse en vivo.

## BigQuery

- Dataset: `agriagent_data` · Tabla: `historial_riego`
- Esquema: ver [`bigquery-schema.json`](bigquery-schema.json).

> ⚠️ **Pendiente:** el código inserta el campo **`razonamiento`** (la justificación de la IA). Si la
> tabla real **no** tiene esa columna, la inserción falla en silencio (el `catch` la oculta).
> **Acción:** agregá la columna `razonamiento` (STRING, NULLABLE) a la tabla — el esquema de este
> repo ya la incluye. (Auditar el razonamiento de la IA es valioso para el pitch.)

## Deploy

```bash
gcloud functions deploy agriagent-cerebro \
  --gen2 --runtime=nodejs20 --region=us-central1 \
  --source=. --entry-point=helloHttp --trigger-http --allow-unauthenticated \
  --project=agriagent-hackathon-2026
```

> ⚠️ **Importante:** la versión desplegada se actualiza SOLO al re-deployar. Tras editar el `prompt`
> (p. ej. el enfoque de agua), **volvé a correr el deploy** para que el demo en vivo lo refleje.
