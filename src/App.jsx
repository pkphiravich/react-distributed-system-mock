import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// ==========================================
// 🛠️ 1. MOCK KAFKA (ท่อส่งสารอัจฉริยะ)
// ==========================================
// จำลองคิว (Queue) เก็บจดหมายคำสั่งซื้อตั๋วที่โยนเข้ามาแบบ Asynchronous
const mockKafkaTopic = [];

// ==========================================
// ☸️ 2. MOCK KUBERNETES & BACKEND (กองทัพเซิร์ฟเวอร์)
// ==========================================
// เริ่มต้นระบบสะเทือนเลื่อนลั่นด้วยหลังบ้าน 2 เครื่อง (Pods)
let mockRunningPods = [
  { id: "Pod-Backend-1", status: "Healthy", processedCount: 0 },
  { id: "Pod-Backend-2", status: "Healthy", processedCount: 0 }
];

export default function App() {
  // สรุปสถานะต่าง ๆ บนหน้าจอ React
  const [pods, setPods] = useState(mockRunningPods);
  const [kafkaQueue, setKafkaQueue] = useState([]);
  const [userTicketStatus, setUserTicketStatus] = useState("ยังไม่ได้กดจอง");
  const [systemLog, setSystemLog] = useState([]);

  // ฟังก์ชันช่วยบันทึก Log เหตุการณ์บนหน้าจอ
  const addLog = (msg) => setSystemLog((prev) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

  // ==========================================
  // ⚡ EVENT STREAMING PROCESSING (สายพาน Kafka)
  // ==========================================
  // โค้ดส่วนนี้ทำหน้าที่เหมือน "Consumer" คอยแอบมาล้วงจดหมายจาก Kafka ไปประมวลผลเงียบ ๆ
  useEffect(() => {
    const consumerInterval = setInterval(() => {
      if (mockKafkaTopic.length > 0) {
        // ล้วงออเดอร์แรกสุดในท่อ Kafka ออกมาทำ (FIFO)
        const currentOrder = mockKafkaTopic.shift();
        setKafkaQueue([...mockKafkaTopic]);

        // จำลอง Kubernetes สั่งเอา Pod ที่ว่างอยู่ตัวหนึ่งมาสับงานไปทำ
        const availablePodIndex = Math.floor(Math.random() * mockRunningPods.length);
        mockRunningPods[availablePodIndex].processedCount += 1;
        setPods([...mockRunningPods]);

        addLog(`🐳 Kafka Consumer: ดึงคำสั่งซื้อของ ${currentOrder.user} ส่งให้ [${mockRunningPods[availablePodIndex].id}] ประมวลผล`);
        
        // เมื่อประมวลผลเสร็จ (จำลองการดึงตั๋วเสร็จสิ้น)
        setUserTicketStatus(`🎉 จองตั๋วสำเร็จแล้ว! (ประมวลผลโดย ${mockRunningPods[availablePodIndex].id})`);
      }
    }, 10000); // ทุก ๆ 2 วินาที คอนซูเมอร์จะแวะมาดูท่อหนึ่งครั้ง

    return () => clearInterval(consumerInterval);
  }, []);

  // ==========================================
  // 🎟️ HIGH CONCURRENCY ROUTE: ปุ่มกดจองตั๋ว
  // ==========================================
  const handleBookTicket = () => {
    setUserTicketStatus("⏳ ส่งคำสั่งซื้อเข้าท่อ Kafka แล้ว (หน้าเว็บกดเล่นต่อได้เลย ไม่ค้าง!)");
    addLog("📱 React Front-end: ผู้ใช้กดปุ่ม 'จองตั๋ว' ส่งคำขอ HTTP POST ➡️ 202 Accepted");

    // โยนจดหมายแหมะไว้ใน Kafka ทันที ไม่ต้องรอดึงฐานข้อมูลให้หน้าเว็บหมุนค้าง
    mockKafkaTopic.push({ user: "คุณ (User-1)", action: "BOOK_TICKET" });
    setKafkaQueue([...mockKafkaTopic]);

    // 🔥 ☸️ MOCK KUBERNETES AUTO-SCALING (ระเบิดพลังงอกตู้เมื่อคิวแน่น)
    if (mockKafkaTopic.length >= 3 && mockRunningPods.length === 2) {
      addLog("⚠️ Kubernetes Notification: คิวใน Kafka แน่นมาก! CPU เกิน 80% สั่งสเกลขยาย Pod อัตโนมัติ!");
      mockRunningPods.push({ id: "Pod-Backend-3 (งอกใหม่)", status: "Healthy", processedCount: 0 });
      mockRunningPods.push({ id: "Pod-Backend-4 (งอกใหม่)", status: "Healthy", processedCount: 0 });
      setPods([...mockRunningPods]);
    }
  };

  // จำลองกรณีจำลอง Pod พังล่มตัวหนึ่ง (Self-healing)
  const handleCrashPod = () => {
    addLog("💥 บั๊กสายฟ้าฟาด! [Pod-Backend-1] แครชพังเสียหาย (Error 500)");
    mockRunningPods = mockRunningPods.filter(p => p.id !== "Pod-Backend-1");
    setPods([...mockRunningPods]);

    // Kubernetes ทำการชุบชีวิตเครื่องใหม่ทันทีใน 1.5 วินาที
    setTimeout(() => {
      addLog("☸️ Kubernetes Self-healing: ตรวจพบ Pod หายไป! สั่งกู้ระบบเสก [Pod-Backend-1 (ชุบชีวิต)] ขึ้นมาแทนที่ให้เสถียรดังเดิม");
      mockRunningPods.push({ id: "Pod-Backend-1 (ชุบชีวิต)", status: "Healthy", processedCount: 0 });
      setPods([...mockRunningPods]);
    }, 1500);
  };

  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        
        <h2>🎫 ระบบจองตั๋วจำลอง Distributed System (SPA)</h2>
        <nav>
          <Link to="/">หน้าจองตั๋ว</Link> | <Link to="/about">คำอธิบายระบบ</Link>
        </nav>
        <hr />

        <Routes>
          {/* หน้าหลัก: สังเวียนทดสอบระบบกระจายศูนย์ */}
          <Route path="/" element={
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              
              {/* ฝั่งซ้าย: ปุ่มกดกระตุ้น Event */}
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

              {/* ฝั่งขวา: แสดงโครงสร้างสถาปัตยกรรมอินฟรา */}
              <div>
                {/* ตู้คอนเทนเนอร์จำลองที่อยู่ใต้เงา K8s */}
                <div style={{ border: "2px solid #326ce5", padding: "15px", borderRadius: "8px", marginBottom: "15px" }}>
                  <h3 style={{ color: "#326ce5", margin: "0 0 10px 0" }}>☸️ คลัสเตอร์ Kubernetes (Docker Containers)</h3>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {pods.map(pod => (
                      <div key={pod.id} style={{ background: "#e6f0ff", border: "1px solid #326ce5", padding: "10px", borderRadius: "5px", textAlign: "center", minWidth: "140px" }}>
                        <div style={{ fontSize: "12px", fontWeight: "bold" }}>🐳 {pod.id}</div>
                        <div style={{ fontSize: "11px", color: "green" }}>● {pod.status}</div>
                        <div style={{ fontSize: "12px", marginTop: "5px", background: "#fff", padding: "2px", borderRadius: "3px" }}>สับไปแล้ว: <b>{pod.processedCount}</b> งาน</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ท่อ Kafka คั่นกลาง */}
                <div style={{ border: "2px solid #e05e00", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ color: "#e05e00", margin: "0 0 10px 0" }}>🪓 ท่อคิว Apache Kafka (Topic: ticket-orders)</h3>
                  <div style={{ background: "#fff3eb", padding: "10px", minHeight: "50px", borderRadius: "5px", border: "1px dashed #e05e00" }}>
                    {kafkaQueue.length === 0 ? (
                      <span style={{ color: "#666", fontSize: "13px" }}>ท่อว่างเปล่า (พร้อมรับแรงกระแทกจากออเดอร์ถัดไป)</span>
                    ) : (
                      <div style={{ display: "flex", gap: "5px" }}>
                        {kafkaQueue.map((item, i) => (
                          <div key={i} style={{ background: "#ff771c", color: "white", padding: "5px 10px", borderRadius: "4px", fontSize: "12px" }}>
                            📩 งานจองจาก: {item.user}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          } />

          {/* หน้ารองเพื่อพิสูจน์ความเป็น Single Page App */}
          <Route path="/about" element={
            <div style={{ padding: "20px", background: "#f8f9fa", borderRadius: "8px" }}>
              <h3>📖 คำอธิบายระบบจำลอง</h3>
              <p>นี่คือ Single Page Application ตัวตเลข Log ด้านล่างจะไม่หายไปแม้คุณจะกดสลับหน้า!</p>
              <ul>
                <li><b>Docker:</b> เปรียบเสมือนกล่องสี่เหลี่ยมสีฟ้าแต่ละอัน (Pods) ที่ห่อหุ้มหลังบ้านไว้</li>
                <li><b>Kubernetes:</b> คอยเฝ้าดู ถ้าคุณกดปุ่ม <i>"แกล้งทำเซิร์ฟเวอร์ล่ม"</i> มันจะรีบชุบชีวิตกล่องใหม่ขึ้นมาให้ในทันที และถ้าคุณรัวจองตั๋วจนคิวแน่น มันจะงอกกล่องใหม่เพิ่มช่วยรับงานเอง</li>
                <li><b>Kafka:</b> ตอนกดจองปุ่มสีฟ้า สังเกตว่าข้อความเปลี่ยนเป็น "ส่งคำขอ" ทันที โดยหน้าเว็บไม่ยอมค้างหมุนติ้ว เพราะงานถูกแหมะไว้ในกล่องส้ม (Kafka) เรียบร้อยแล้วนั่นเอง</li>
              </ul>
            </div>
          } />
        </Routes>

      </div>
    </BrowserRouter>
  );
}