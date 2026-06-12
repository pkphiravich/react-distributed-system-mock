import React, { useState, useEffect } from "react";
// 🧱 นำเข้า Components ที่เราแยกไปสร้างไว้ก่อนหน้านี้
import KubernetesCluster from "../components/KubernetesCluster";
import KafkaQueue from "../components/KafkaQueue";

// จำลองคิวเก็บข้อมูลนอก Component เพื่อไม่ให้ล้างค่าตอนถูก Render
const mockKafkaTopic = [];
let mockRunningPods = [
  { id: "Pod-Backend-1", status: "Healthy", processedCount: 0 },
  { id: "Pod-Backend-2", status: "Healthy", processedCount: 0 }
];

export default function BookingPage() {
  const [pods, setPods] = useState(mockRunningPods);
  const [kafkaQueue, setKafkaQueue] = useState([]);
  const [userTicketStatus, setUserTicketStatus] = useState("ยังไม่ได้กดจอง");
  const [systemLog, setSystemLog] = useState([]);

  const addLog = (msg) => setSystemLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  // Consumer แอบมาดึงงานจาก Kafka
  useEffect(() => {
    const consumerInterval = setInterval(() => {
      if (mockKafkaTopic.length > 0) {
        const currentOrder = mockKafkaTopic.shift();
        setKafkaQueue([...mockKafkaTopic]);

        const availablePodIndex = Math.floor(Math.random() * mockRunningPods.length);
        mockRunningPods[availablePodIndex].processedCount += 1;
        setPods([...mockRunningPods]);

        addLog(`🐳 Kafka Consumer: ดึงคำสั่งซื้อของ ${currentOrder.user} ส่งให้ [${mockRunningPods[availablePodIndex].id}] ประมวลผล`);
        setUserTicketStatus(`🎉 จองตั๋วสำเร็จแล้ว! (ประมวลผลโดย ${mockRunningPods[availablePodIndex].id})`);
      }
    }, 2000);

    return () => clearInterval(consumerInterval);
  }, []);

  const handleBookTicket = () => {
    setUserTicketStatus("⏳ ส่งคำสั่งซื้อเข้าท่อ Kafka แล้ว (หน้าเว็บกดเล่นต่อได้เลย ไม่ค้าง!)");
    addLog("📱 React Front-end: ผู้ใช้กดปุ่ม 'จองตั๋ว' ส่งคำขอ HTTP POST ➡️ 202 Accepted");

    mockKafkaTopic.push({ user: "คุณ (User-1)", action: "BOOK_TICKET" });
    setKafkaQueue([...mockKafkaTopic]);

    // Kubernetes Auto-scaling
    if (mockKafkaTopic.length >= 3 && mockRunningPods.length === 2) {
      addLog("⚠️ Kubernetes Notification: คิวใน Kafka แน่นมาก! CPU เกิน 80% สั่งสเกลขยาย Pod อัตโนมัติ!");
      mockRunningPods.push({ id: "Pod-Backend-3 (งอกใหม่)", status: "Healthy", processedCount: 0 });
      mockRunningPods.push({ id: "Pod-Backend-4 (งอกใหม่)", status: "Healthy", processedCount: 0 });
      setPods([...mockRunningPods]);
    }
  };

  const handleCrashPod = () => {
    addLog("💥 บั๊กสายฟ้าฟาด! [Pod-Backend-1] แครชพังเสียหาย (Error 500)");
    mockRunningPods = mockRunningPods.filter(p => p.id !== "Pod-Backend-1");
    setPods([...mockRunningPods]);

    setTimeout(() => {
      addLog("☸️ Kubernetes Self-healing: ตรวจพบ Pod หายไป! สั่งกู้ระบบเสก [Pod-Backend-1 (ชุบชีวิต)] ขึ้นมาแทนที่ให้เสถียรดังเดิม");
      mockRunningPods.push({ id: "Pod-Backend-1 (ชุบชีวิต)", status: "Healthy", processedCount: 0 });
      setPods([...mockRunningPods]);
    }, 1500);
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
      
      {/* ฝั่งซ้าย: หน้าบ้านและระบบบันทึก Log */}
      <div>
        <div style={{ background: "#f0f2f5", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
          <h3>📱 หน้าบ้าน (React App)</h3>
          <p>สถานะตั๋วของคุณ: <b style={{ color: "blue" }}>{userTicketStatus}</b></p>
          <button onClick={handleBookTicket} style={{ padding: "10px 20px", background: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "10px" }}>
            🎟️ กดจองตั๋วคอนเสิร์ต (High Concurrency)
          </button>
          <button onClick={handleCrashPod} style={{ padding: "10px 10px", background: "#dc3545", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            💥 แกล้งทำเซิร์ฟเวอร์ล่ม
          </button>
        </div>

        <div style={{ background: "#222", color: "#0fff00", padding: "15px", borderRadius: "8px", height: "200px", overflowY: "scroll" }}>
          <h4>📜 ระบบหลังบ้าน (Logs)</h4>
          {systemLog.length === 0 && <p style={{ color: "#aaa" }}>ยังไม่มีกิจกรรมเกิดขึ้น...</p>}
          {systemLog.map((log, index) => <div key={index} style={{ fontSize: "13px", marginBottom: "5px" }}>{log}</div>)}
        </div>
      </div>

      {/* ฝั่งขวา: แสดงโครงสร้างอินฟรา (ดึงชิ้นส่วนย่อยที่เราแยกไฟล์ไว้มาแปะใช้งานและส่งสเตตัสผ่าน props) */}
      <div>
        <KubernetesCluster pods={pods} />
        <KafkaQueue kafkaQueue={kafkaQueue} />
      </div>

    </div>
  );
}