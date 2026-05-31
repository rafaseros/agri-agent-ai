import { useCallback, useEffect, useRef, useState } from 'react';
import { postStatus, sensorToBody } from '../lib/agentApi.js';
import { loadFarm, saveFarm } from '../lib/storage.js';

const TICK_MS = 10000; // gap between completed ticks — rate-limit safe (was 2000)
const SENSOR_GAP_MS = 2500; // pause between sensors WITHIN a tick (sequential, no bursts)
const HISTORY_MAX = 40; // points kept per sensor line in the chart
const REWET_TARGET = 80; // after the pump runs, soil recovers to this next tick
const INITIAL_SURFACE = 65;
const INITIAL_DEEP = 70;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sensorsForHa = (ha) => Math.max(1, Math.ceil(ha / 20));

/**
 * Central farm store: lotes + sensores (persisted), plus runtime session data
 * (decision history + pump KPI) and the 24h evolution simulator.
 */
export function useFarm() {
  const persisted = useRef(loadFarm()).current;
  const [lotes, setLotes] = useState(persisted.lotes);
  const [sensores, setSensores] = useState(persisted.sensores);
  const [history, setHistory] = useState([]); // [{ tick, [sensorId]: humidity }]
  const [pumpOnCount, setPumpOnCount] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [tick, setTick] = useState(0);

  // Next sensor id (S-101, S-102, …). Kept in a ref; persisted with the farm.
  const seqRef = useRef(persisted.seq);

  // Always-fresh mirrors for closures inside the async sim loop.
  const sensoresRef = useRef(sensores);
  sensoresRef.current = sensores;
  const lotesRef = useRef(lotes);
  lotesRef.current = lotes;
  const tickRef = useRef(tick);
  tickRef.current = tick;
  const debounceRef = useRef({});
  const runningRef = useRef(false); // true while a simulation is active

  // Persist lotes + sensores (+ seq) whenever they change.
  useEffect(() => {
    saveFarm({ lotes, sensores, seq: seqRef.current });
  }, [lotes, sensores]);

  const makeSensor = (loteId, cultivo, hectareas) => {
    const id = `S-${seqRef.current}`;
    seqRef.current += 1;
    return {
      id,
      loteId,
      cultivo,
      hectareas,
      humedad_superficie: INITIAL_SURFACE,
      humedad_profunda: INITIAL_DEEP,
      conexion_activa: true,
      minutos_desconectado: 0,
      decision: null, // 'Encender Bomba' | 'Apagar Bomba'
      lastDecision: null, // 'ON' | 'OFF'
      reasoning: null,
      online: true,
      pumpOn: false,
      evaluating: false,
    };
  };

  // --- CRUD ---------------------------------------------------------------
  const addLote = useCallback((cultivo, hectareas) => {
    const ha = Math.max(1, Math.round(Number(hectareas) || 0));
    const count = sensorsForHa(ha);
    const haEach = Math.max(1, Math.round(ha / count));
    const loteId = crypto.randomUUID();
    const created = Array.from({ length: count }, () => makeSensor(loteId, cultivo, haEach));
    setLotes((prev) => [...prev, { id: loteId, cultivo, hectareas: ha }]);
    setSensores((prev) => [...prev, ...created]);
  }, []);

  const addSensor = useCallback((loteId) => {
    const lote = lotesRef.current.find((l) => l.id === loteId);
    if (!lote) return;
    const siblings = sensoresRef.current.filter((s) => s.loteId === loteId);
    const haEach = Math.max(1, Math.round(lote.hectareas / (siblings.length + 1)));
    setSensores((prev) => [...prev, makeSensor(loteId, lote.cultivo, haEach)]);
  }, []);

  const removeSensor = useCallback((id) => {
    setSensores((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const removeLote = useCallback((loteId) => {
    setLotes((prev) => prev.filter((l) => l.id !== loteId));
    setSensores((prev) => prev.filter((s) => s.loteId !== loteId));
  }, []);

  // Apply an agent reply onto a sensor in the store.
  const applyResult = (id, r) =>
    setSensores((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              decision: r.decision.action,
              lastDecision: r.decision.decision,
              reasoning: r.decision.reason,
              online: r.online,
              pumpOn: r.decision.pumpOn,
              evaluating: false,
            }
          : s,
      ),
    );

  // --- Manual edits (sliders / toggle) — debounced POST per sensor --------
  const updateSensor = useCallback((id, patch) => {
    setSensores((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    clearTimeout(debounceRef.current[id]);
    debounceRef.current[id] = setTimeout(async () => {
      const s = sensoresRef.current.find((x) => x.id === id);
      if (!s) return;
      setSensores((prev) => prev.map((x) => (x.id === id ? { ...x, evaluating: true } : x)));
      try {
        const r = await postStatus(sensorToBody(s));
        applyResult(id, r);
        if (r.decision.pumpOn) setPumpOnCount((c) => c + 1);
      } catch {
        setSensores((prev) => prev.map((x) => (x.id === id ? { ...x, evaluating: false } : x)));
      }
    }, 400);
  }, []);

  // --- Simulation ---------------------------------------------------------
  const doTick = useCallback(async () => {
    const active = sensoresRef.current;
    if (active.length === 0) {
      console.warn(
        '%c[Simulación] No hay sensores activos. Creá un lote en la pestaña "Granja" antes de simular.',
        'color:#fbbc05;font-weight:bold',
      );
      return;
    }

    const t = tickRef.current + 1;
    setTick(t);
    const point = { tick: t };
    let pumps = 0;

    // RATE-LIMIT SAFE: process sensors ONE AT A TIME (no Promise.all bursts),
    // pausing SENSOR_GAP_MS between each so we stay under Vertex AI's quota.
    for (const base of active) {
      if (!runningRef.current) break; // simulation was stopped mid-tick

      const s = sensoresRef.current.find((x) => x.id === base.id);
      if (!s) continue;

      // Evolve humidity: rewet to 80% after a pump cycle, else dry 1–3%.
      const surface =
        s.lastDecision === 'ON' ? REWET_TARGET : Math.max(0, s.humedad_superficie - rand(1, 3));
      point[s.id] = surface;

      // Mark THIS sensor as the one being consulted (UI shows "Consultando IA…").
      setSensores((prev) =>
        prev.map((x) =>
          x.id === s.id ? { ...x, humedad_superficie: surface, evaluating: true } : x,
        ),
      );

      // Fetch this single sensor, then update its card immediately.
      try {
        const r = await postStatus(sensorToBody({ ...s, humedad_superficie: surface }));
        if (r.decision.pumpOn) pumps += 1;
        setSensores((prev) =>
          prev.map((x) =>
            x.id === s.id
              ? {
                  ...x,
                  decision: r.decision.action,
                  lastDecision: r.decision.decision,
                  reasoning: r.decision.reason,
                  online: r.online,
                  pumpOn: r.decision.pumpOn,
                  evaluating: false,
                }
              : x,
          ),
        );
      } catch {
        setSensores((prev) => prev.map((x) => (x.id === s.id ? { ...x, evaluating: false } : x)));
      }

      // Wait before consulting the next sensor.
      await sleep(SENSOR_GAP_MS);
    }

    if (pumps) setPumpOnCount((c) => c + pumps);
    setHistory((h) => [...h, point].slice(-HISTORY_MAX));
  }, []);

  // Self-pacing loop: run a full sequential tick, then wait TICK_MS (10s).
  useEffect(() => {
    if (!simulating) return undefined;
    runningRef.current = true;
    let timer;
    const loop = async () => {
      if (!runningRef.current) return;
      await doTick();
      if (runningRef.current) timer = setTimeout(loop, TICK_MS);
    };
    loop();
    return () => {
      runningRef.current = false;
      clearTimeout(timer);
    };
  }, [simulating, doTick]);

  const startSimulation = useCallback(() => setSimulating(true), []);
  const stopSimulation = useCallback(() => setSimulating(false), []);
  const resetSession = useCallback(() => {
    setHistory([]);
    setPumpOnCount(0);
    setTick(0);
  }, []);

  return {
    lotes,
    sensores,
    history,
    pumpOnCount,
    simulating,
    tick,
    addLote,
    addSensor,
    removeSensor,
    removeLote,
    updateSensor,
    startSimulation,
    stopSimulation,
    resetSession,
  };
}
