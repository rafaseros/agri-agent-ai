# 🌾 AgriAgent AI - Hackathon Build With AI 2026

**Equipo:** [Nombre de su equipo]
**Categoría:** Agro / Energía[cite: 2]
**Ubicación:** Santa Cruz de la Sierra, Bolivia[cite: 2]

## 👥 Integrantes del Equipo
1. José Rafael Gallegos Rojas (Rol: Estrategia, Negocios y Pitch)
2. [Nombre del Integrante 2] (Rol: IA y Arquitectura Cloud)
3. [Nombre del Integrante 3] (Rol: Frontend y Datos)

---

## 📌 Explicación General del Proyecto
**El Problema:** En Santa Cruz de la Sierra, el costo no subvencionado del diésel (aprox. 11 Bs/L) ha vuelto insostenible el riego agrícola tradicional. Los productores medianos pierden rentabilidad al encender bombas de agua de forma ineficiente, basándose en la intuición y desperdiciando combustible[cite: 2].

**La Solución:** AgriAgent AI es un **Agente Agrícola Autónomo** que optimiza el Nexo Agua-Energía. No es un sistema de alertas pasivo; es una Inteligencia Artificial que cruza datos de humedad del suelo con pronósticos climáticos (APIs) e imágenes satelitales para tomar la decisión autónoma de encender o apagar las bombas de riego, maximizando el ahorro de diésel[cite: 2].

---

## 🏗️ Arquitectura Tecnológica
El sistema está diseñado bajo una arquitectura de bajo costo (Serverless) y baja conectividad para el campo boliviano:

1. **Edge Sync (Campo):** Sensores capacitivos de bajo costo controlados por microcontroladores ESP32 recogen datos de humedad.
2. **Ingesta Cloud:** Google Cloud Functions recibe los datos asíncronos y consulta las APIs de clima (Open-Meteo) y Earth Engine.
3. **Cerebro AI (Vertex AI):** Vertex AI Agent Builder actúa como el motor de razonamiento. Evalúa los datos contra manuales agrícolas (Vector Search) y decide la acción hídrica.
4. **Capa de Acción:** El sistema actualiza un dashboard en Looker Studio y envía el comando de apagado/encendido al hardware.

---

## 💻 Tecnologías Utilizadas
* **Google Cloud Platform (Free Tier):** Cloud Functions, BigQuery (Almacenamiento y ML).
* **Inteligencia Artificial:** Vertex AI Agent Builder.
* **APIs de Datos:** Google Earth Engine (Imágenes satelitales), Open-Meteo API.
* **Frontend / Dashboard:** Vite + React (para la demo) y Looker Studio.
* **Hardware (Simulado/Prototipo):** ESP32, Sensores de Humedad Capacitivos v1.2.

---

## 🖼️ Imágenes Referenciales
*(Nota: Reemplazar los enlaces con las capturas reales del dashboard y arquitectura antes del domingo a las 10:00 AM)*[cite: 2]

![Diagrama de Arquitectura](enlace-a-su-imagen-de-arquitectura.png)
![Dashboard Looker Studio](enlace-a-su-captura-del-dashboard.png)

---

## 🚀 Instrucciones de Ejecución (Demo Local)
Para correr el prototipo de la interfaz del agente en un entorno local:

1. Clonar el repositorio:
```bash
   git clone [https://github.com/](https://github.com/)[su-usuario]/agriagent-ai.git