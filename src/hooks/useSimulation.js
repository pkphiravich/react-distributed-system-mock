import { useState, useEffect, useRef, useCallback } from "react";
import {
  CONSUMER_INTERVAL_MS,
  HPA_QUEUE_THRESHOLD,
  SELF_HEAL_DELAY_MS,
  SCALE_DOWN_DELAY_MS,
  POD_PENDING_DELAY_MS,
  MOCK_USERS,
  INITIAL_PODS,
} from "../constants/simulation";

function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem("sim_logs") || "[]");
  } catch {
    return [];
  }
}

export function useSimulation() {
  const podCounter = useRef(INITIAL_PODS.length);

  const [pods, setPods] = useState(() => INITIAL_PODS.map((p) => ({ ...p })));
  const [queue, setQueue] = useState([]);
  const [logs, setLogs] = useState(loadLogs);
  const [userIndex, setUserIndex] = useState(0);
  const [ticketStatus, setTicketStatus] = useState("ยังไม่ได้จองตั๋ว");
  const [consumerSpeed, setConsumerSpeed] = useState(CONSUMER_INTERVAL_MS);
  const [hpaThreshold, setHpaThreshold] = useState(HPA_QUEUE_THRESHOLD);
  const [bookingCount, setBookingCount] = useState(0);

  const queueRef = useRef([]);
  const podsRef = useRef(pods);
  const scaleDownTimer = useRef(null);

  useEffect(() => {
    podsRef.current = pods;
  }, [pods]);

  const addLog = useCallback((msg) => {
    setLogs((prev) => {
      const next = [
        `[${new Date().toLocaleTimeString("th-TH")}] ${msg}`,
        ...prev,
      ].slice(0, 200);
      localStorage.setItem("sim_logs", JSON.stringify(next));
      return next;
    });
  }, []);

  const scheduleScaleDown = useCallback(() => {
    if (scaleDownTimer.current) clearTimeout(scaleDownTimer.current);
    scaleDownTimer.current = setTimeout(() => {
      const current = podsRef.current;
      if (current.length > INITIAL_PODS.length && queueRef.current.length === 0) {
        addLog("📉 Kubernetes HPA: โหลดลดลงแล้ว — สเกลดาวน์กลับสู่ขนาดปกติ");
        setPods(current.slice(0, INITIAL_PODS.length));
        podCounter.current = INITIAL_PODS.length;
      }
    }, SCALE_DOWN_DELAY_MS);
  }, [addLog]);

  // Consumer loop — restarts on speed change
  useEffect(() => {
    const interval = setInterval(() => {
      if (queueRef.current.length === 0) return;

      const order = queueRef.current.shift();
      setQueue([...queueRef.current]);

      const runningPods = podsRef.current.filter((p) => p.status === "Running");
      if (runningPods.length === 0) return;

      const target = runningPods[Math.floor(Math.random() * runningPods.length)];
      setPods((prev) =>
        prev.map((p) =>
          p.id === target.id ? { ...p, processedCount: p.processedCount + 1 } : p
        )
      );
      addLog(`✅ Kafka Consumer: ดึงออเดอร์ของ "${order.user}" → ส่งให้ [${target.name}] ประมวลผล`);
      setTicketStatus(`✅ "${order.user}" จองตั๋วสำเร็จ! (ประมวลผลโดย ${target.name})`);

      if (queueRef.current.length === 0) {
        scheduleScaleDown();
      }
    }, consumerSpeed);

    return () => clearInterval(interval);
  }, [consumerSpeed, addLog, scheduleScaleDown]);

  const bookTicket = useCallback(() => {
    const user = MOCK_USERS[userIndex % MOCK_USERS.length];
    setUserIndex((i) => i + 1);

    setBookingCount((c) => c + 1);
    setTicketStatus(`⏳ "${user}" กำลังรอในคิว Kafka...`);
    addLog(`📱 React: "${user}" กด "จองตั๋ว" → HTTP POST → 202 Accepted (Async)`);

    const order = { id: `order-${Date.now()}`, user, action: "BOOK_TICKET" };
    queueRef.current.push(order);
    setQueue([...queueRef.current]);

    if (scaleDownTimer.current) clearTimeout(scaleDownTimer.current);

    const currentPods = podsRef.current;
    const runningCount = currentPods.filter((p) => p.status === "Running").length;

    if (queueRef.current.length >= hpaThreshold && runningCount <= INITIAL_PODS.length) {
      addLog("⚠️ Kubernetes HPA: คิว Kafka แน่น! CPU เกิน 80% — สั่งสเกลอัพอัตโนมัติ!");

      const newPods = [1, 2].map(() => {
        const n = ++podCounter.current;
        return { id: `pod-${n}`, name: `Backend-${n}`, status: "Pending", processedCount: 0 };
      });

      setPods((prev) => [...prev, ...newPods]);

      newPods.forEach((pod) => {
        setTimeout(() => {
          setPods((prev) =>
            prev.map((p) => (p.id === pod.id ? { ...p, status: "Running" } : p))
          );
          addLog(`🚀 ${pod.name}: Pending → Running พร้อมรับงานแล้ว`);
        }, POD_PENDING_DELAY_MS);
      });
    }
  }, [userIndex, hpaThreshold, addLog]);

  const crashPod = useCallback(() => {
    const target = podsRef.current.find((p) => p.status === "Running");
    if (!target) {
      addLog("⚠️ ไม่มี Pod ที่กำลัง Running — ไม่สามารถทดสอบ Self-healing ได้");
      return;
    }

    addLog(`💥 [${target.name}] เกิด Error 500 — Pod ล่มแล้ว!`);
    setPods((prev) =>
      prev.map((p) => (p.id === target.id ? { ...p, status: "Terminating" } : p))
    );

    setTimeout(() => {
      setPods((prev) => prev.filter((p) => p.id !== target.id));

      const n = ++podCounter.current;
      const healed = { id: `pod-${n}`, name: `Backend-${n}`, status: "Pending", processedCount: 0 };
      setPods((prev) => [...prev, healed]);
      addLog(`☸️ Kubernetes Self-healing: ตรวจพบ Pod ล่ม — กำลังสร้างใหม่...`);

      setTimeout(() => {
        setPods((prev) =>
          prev.map((p) => (p.id === healed.id ? { ...p, status: "Running" } : p))
        );
        addLog(`✅ Self-healing สำเร็จ! [${healed.name}] พร้อมรับงานแล้ว`);
      }, POD_PENDING_DELAY_MS);
    }, SELF_HEAL_DELAY_MS);
  }, [addLog]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    localStorage.removeItem("sim_logs");
  }, []);

  return {
    pods,
    queue,
    logs,
    ticketStatus,
    bookingCount,
    consumerSpeed,
    setConsumerSpeed,
    hpaThreshold,
    setHpaThreshold,
    bookTicket,
    crashPod,
    clearLogs,
  };
}
