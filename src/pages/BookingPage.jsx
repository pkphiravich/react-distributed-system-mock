import { useState, useEffect, useRef, useCallback } from "react";
import KubernetesCluster from "../components/KubernetesCluster";
import KafkaQueue from "../components/KafkaQueue";
import {
  CONSUMER_INTERVAL_MS,
  HPA_QUEUE_THRESHOLD,
  SELF_HEAL_DELAY_MS,
  SCALE_DOWN_DELAY_MS,
  POD_PENDING_DELAY_MS,
  MOCK_USERS,
  INITIAL_PODS,
} from "../constants/simulation";

let podIdCounter = 3;

function makeId() {
  return `pod-${podIdCounter++}`;
}

function loadLogs() {
  try {
    return JSON.parse(localStorage.getItem("sim_logs") || "[]");
  } catch {
    return [];
  }
}

export default function BookingPage() {
  const [pods, setPods] = useState(() =>
    INITIAL_PODS.map((p) => ({ ...p }))
  );
  const [kafkaQueue, setKafkaQueue] = useState([]);
  const [userTicketStatus, setUserTicketStatus] = useState("ยังไม่ได้กดจอง");
  const [systemLog, setSystemLog] = useState(loadLogs);
  const [userIndex, setUserIndex] = useState(0);

  // Configurable params
  const [consumerSpeed, setConsumerSpeed] = useState(CONSUMER_INTERVAL_MS);
  const [hpaThreshold, setHpaThreshold] = useState(HPA_QUEUE_THRESHOLD);

  // Refs to always have fresh state inside intervals/timeouts
  const kafkaRef = useRef([]);
  const podsRef = useRef(pods);
  const scaleDownTimer = useRef(null);

  const addLog = useCallback((msg) => {
    setSystemLog((prev) => {
      const next = [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 200);
      localStorage.setItem("sim_logs", JSON.stringify(next));
      return next;
    });
  }, []);

  // Keep refs in sync
  useEffect(() => {
    podsRef.current = pods;
  }, [pods]);

  const scheduleScaleDown = useCallback(() => {
    if (scaleDownTimer.current) clearTimeout(scaleDownTimer.current);
    scaleDownTimer.current = setTimeout(() => {
      const current = podsRef.current;
      if (current.length > INITIAL_PODS.length && kafkaRef.current.length === 0) {
        addLog("📉 Kubernetes HPA: โหลดลดลง — สเกลดาวน์กลับเหลือ Pod หลัก");
        setPods(current.slice(0, INITIAL_PODS.length));
      }
    }, SCALE_DOWN_DELAY_MS);
  }, [addLog]);

  // Consumer loop — restarts when consumerSpeed changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (kafkaRef.current.length === 0) return;

      const order = kafkaRef.current.shift();
      setKafkaQueue([...kafkaRef.current]);

      // Pick a Running pod
      const runningPods = podsRef.current.filter((p) => p.status === "Running");
      if (runningPods.length === 0) return;

      const target = runningPods[Math.floor(Math.random() * runningPods.length)];
      setPods((prev) =>
        prev.map((p) =>
          p.id === target.id ? { ...p, processedCount: p.processedCount + 1 } : p
        )
      );
      addLog(
        `🐳 Kafka Consumer: ดึงคำสั่งซื้อของ ${order.user} ส่งให้ [${target.name}] ประมวลผล`
      );
      setUserTicketStatus(`🎉 จองตั๋วสำเร็จแล้ว! (ประมวลผลโดย ${target.name})`);

      // Schedule scale-down if queue now empty
      if (kafkaRef.current.length === 0) {
        scheduleScaleDown();
      }
    }, consumerSpeed);

    return () => clearInterval(interval);
  }, [consumerSpeed, addLog, scheduleScaleDown]);

  const handleBookTicket = () => {
    const user = `คุณ (${MOCK_USERS[userIndex % MOCK_USERS.length]})`;
    setUserIndex((i) => i + 1);

    setUserTicketStatus("⏳ ส่งคำสั่งซื้อเข้าท่อ Kafka แล้ว (หน้าเว็บกดเล่นต่อได้เลย ไม่ค้าง!)");
    addLog(`📱 React Front-end: ${user} กดปุ่ม 'จองตั๋ว' ส่งคำขอ HTTP POST ➡️ 202 Accepted`);

    const order = { user, action: "BOOK_TICKET" };
    kafkaRef.current.push(order);
    setKafkaQueue([...kafkaRef.current]);

    // Cancel pending scale-down since queue has items again
    if (scaleDownTimer.current) clearTimeout(scaleDownTimer.current);

    // HPA trigger
    const currentPods = podsRef.current;
    const runningCount = currentPods.filter((p) => p.status === "Running").length;
    if (kafkaRef.current.length >= hpaThreshold && runningCount <= INITIAL_PODS.length) {
      addLog("⚠️ Kubernetes HPA: คิวใน Kafka แน่นมาก! CPU เกิน 80% สั่งสเกลขยาย Pod อัตโนมัติ!");

      const newPods = [
        { id: makeId(), name: "Pod-Backend-3", status: "Pending", processedCount: 0 },
        { id: makeId(), name: "Pod-Backend-4", status: "Pending", processedCount: 0 },
      ];
      setPods((prev) => [...prev, ...newPods]);

      // Transition Pending → Running
      newPods.forEach((pod) => {
        setTimeout(() => {
          setPods((prev) =>
            prev.map((p) => (p.id === pod.id ? { ...p, status: "Running" } : p))
          );
          addLog(`✅ ${pod.name}: Pending → Running`);
        }, POD_PENDING_DELAY_MS);
      });
    }
  };

  const handleCrashPod = () => {
    const target = podsRef.current.find((p) => p.status === "Running");
    if (!target) {
      addLog("⚠️ ไม่มี Pod ที่ Running อยู่เลย");
      return;
    }

    addLog(`💥 บั๊กสายฟ้าฟาด! [${target.name}] แครชพังเสียหาย (Error 500)`);
    setPods((prev) =>
      prev.map((p) => (p.id === target.id ? { ...p, status: "Terminating" } : p))
    );

    setTimeout(() => {
      setPods((prev) => prev.filter((p) => p.id !== target.id));

      const healed = { id: makeId(), name: `${target.name} (ชุบชีวิต)`, status: "Pending", processedCount: 0 };
      setPods((prev) => [...prev, healed]);

      setTimeout(() => {
        setPods((prev) =>
          prev.map((p) => (p.id === healed.id ? { ...p, status: "Running" } : p))
        );
        addLog(`☸️ Kubernetes Self-healing: กู้ระบบ [${healed.name}] เสก Running แทนที่สำเร็จ`);
      }, POD_PENDING_DELAY_MS);
    }, SELF_HEAL_DELAY_MS);
  };

  const handleClearLogs = () => {
    setSystemLog([]);
    localStorage.removeItem("sim_logs");
  };

  return (
    <div className="sim-grid">
      {/* Left: frontend + logs */}
      <div>
        <div className="panel panel--light">
          <h3>📱 หน้าบ้าน (React App)</h3>
          <p>
            สถานะตั๋วของคุณ:{" "}
            <b className="status-text">{userTicketStatus}</b>
          </p>

          <div className="button-row">
            <button
              className="btn btn--primary"
              onClick={handleBookTicket}
              aria-label="กดจองตั๋วคอนเสิร์ต ทดสอบ High Concurrency"
            >
              🎟️ กดจองตั๋วคอนเสิร์ต (High Concurrency)
            </button>
            <button
              className="btn btn--danger"
              onClick={handleCrashPod}
              aria-label="จำลองเซิร์ฟเวอร์ล่ม เพื่อทดสอบ Self-healing"
            >
              💥 แกล้งทำเซิร์ฟเวอร์ล่ม
            </button>
          </div>

          <div className="sim-controls">
            <label className="sim-control">
              <span>⚡ ความเร็ว Consumer: {consumerSpeed / 1000}s</span>
              <input
                type="range"
                min="500"
                max="5000"
                step="500"
                value={consumerSpeed}
                onChange={(e) => setConsumerSpeed(Number(e.target.value))}
                aria-label="ปรับความเร็ว Kafka Consumer"
              />
            </label>
            <label className="sim-control">
              <span>📊 HPA threshold: {hpaThreshold} items</span>
              <input
                type="range"
                min="2"
                max="5"
                step="1"
                value={hpaThreshold}
                onChange={(e) => setHpaThreshold(Number(e.target.value))}
                aria-label="ปรับ HPA threshold"
              />
            </label>
          </div>
        </div>

        <div
          className="log-panel"
          role="log"
          aria-live="polite"
          aria-label="ระบบบันทึก Logs"
        >
          <div className="log-header">
            <h4>📜 ระบบหลังบ้าน (Logs)</h4>
            <button
              className="btn btn--ghost"
              onClick={handleClearLogs}
              aria-label="ล้าง Logs ทั้งหมด"
            >
              ล้าง
            </button>
          </div>
          {systemLog.length === 0 && (
            <p className="log-empty">ยังไม่มีกิจกรรมเกิดขึ้น...</p>
          )}
          {systemLog.map((log, index) => (
            <div key={index} className="log-entry">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Right: infra */}
      <div>
        <KubernetesCluster pods={pods} />
        <KafkaQueue kafkaQueue={kafkaQueue} />
      </div>
    </div>
  );
}
