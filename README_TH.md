# ระบบจำลอง Distributed System — React SPA

[🇺🇸 English](README.md) | 🇹🇭 **ภาษาไทย**

---

โปรเจกต์นี้คือการจำลองพฤติกรรมของโครงสร้างพื้นฐานหลังบ้าน (Backend Infrastructure) แบบ Interactive สร้างด้วย React โดยไม่ต้องพึ่งพาเซิร์ฟเวอร์จริง, Cloud Account, หรือ DevOps Toolchain ใด ๆ ทั้งสิ้น

ระบบนี้จำลองการทำงานของ **Apache Kafka**, **Kubernetes (K8s)** และ **Containerized Microservices** เพื่อช่วยให้นักพัฒนาสร้างความเข้าใจเชิงสัญชาตญาณ (Intuition) เกี่ยวกับพฤติกรรมของระบบ High-Concurrency ภายใต้สถานการณ์โหลดสูง, ความล้มเหลว และการฟื้นตัวของระบบ

---

## สถาปัตยกรรมระบบ (Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                     React SPA (ฝั่ง Client)                  │
│                                                             │
│   การกระทำของผู้ใช้                                          │
│       │                                                     │
│       ▼                                                     │
│  [ Kafka Queue ]  ──────────────►  [ Kubernetes Cluster ]  │
│  (ตัวกลางรับส่งข้อความ)              (จัดการ Pod)             │
│  • รับงานแบบ Async                  • Auto-scaling (HPA)    │
│  • ตอบกลับ 202 Accepted             • Self-healing          │
│  • Consumer Loop ดึงงาน             • กระจายโหลด            │
│                                                             │
│   ตัวนับจำนวนการจองติดตามยอดตั๋วที่จองไปทั้งหมด               │
└─────────────────────────────────────────────────────────────┘
```

State การจำลองทั้งหมดบริหารจัดการผ่าน Custom Hook ชื่อ `useSimulation` ไม่มี API หรือ Backend จริงเข้ามาเกี่ยวข้อง

---

## ฟีเจอร์หลัก

### 🎟️ จองตั๋วพร้อมตัวนับแบบ Real-time
แต่ละครั้งที่กดปุ่ม **"จองตั๋วคอนเสิร์ต"** ระบบจะโยนคำสั่งจองเข้าสู่ Kafka Topic แบบ Async และเพิ่มตัวนับยอดการจองทันที สะท้อนจำนวนตั๋วที่จองไปแล้วทั้งหมดในเซสชันนั้น

### ⚡ Horizontal Pod Autoscaling (HPA)
เมื่อความลึกของคิว (Queue Depth) เกินค่า HPA Threshold ที่กำหนด Kubernetes จะสร้าง Backend Pod เพิ่มอัตโนมัติ (`Pending → Running`) เพื่อรองรับโหลดที่พุ่งสูง และ Scale ลงกลับสู่ขนาดปกติเมื่อคิวว่าง

### 💥 จำลองเซิร์ฟเวอร์ล่มและ Self-Healing
การสั่งให้เซิร์ฟเวอร์ล่มจะเปลี่ยนสถานะ Pod เป็น `Terminating` แล้วลบออก จากนั้น Kubernetes จะสร้าง Pod ใหม่ขึ้นมาแทนที่โดยอัตโนมัติ — จำลองพฤติกรรม Liveness Probe และ Restart Policy ภายใน 1.5 วินาที

### 📊 ปรับพารามิเตอร์การจำลองได้
- **Consumer Speed** — ปรับความเร็วการประมวลผลของ Kafka Consumer (0.5 – 5 วินาที)
- **HPA Threshold** — กำหนดความลึกคิวที่จะกระตุ้น Scale-up (2 – 5 รายการ)

### 📝 บันทึก Activity Log แบบถาวร
เหตุการณ์ทุกอย่างในระบบ (การจอง, Scale-up/down, เซิร์ฟเวอร์ล่ม, การฟื้นตัว) จะถูกบันทึกพร้อม Timestamp แบบ Thai Locale และเก็บไว้ใน `localStorage` แม้รีเฟรชหน้าเว็บ

---

## เทคโนโลยีที่ใช้

| ชั้น | เทคโนโลยี |
|---|---|
| Framework | React 19 (Hooks-based ทั้งหมด ไม่มี Class Component) |
| Routing | React Router v6 (Client-side SPA) |
| Build Tool | Vite 6 (HMR, File Polling สำหรับ WSL/Windows) |
| Styling | Vanilla CSS (Design Tokens, Dark Theme, BEM) |
| State | `useState`, `useRef`, `useCallback`, `useEffect` |
| Persistence | `localStorage` (เก็บประวัติ Log) |

---

## โครงสร้างโปรเจกต์

```
src/
├── hooks/
│   └── useSimulation.js      # เครื่องจักรจำลองหลัก (pods, queue, HPA, healing)
├── components/
│   ├── Navbar.jsx             # แถบนำทางด้านบน
│   ├── KubernetesCluster.jsx  # แสดงกริด Pod
│   ├── KafkaQueue.jsx         # แสดงความลึกของคิว
│   ├── PodCard.jsx            # การ์ดแสดงสถานะ Pod แต่ละตัว
│   ├── LogPanel.jsx           # บันทึก Event พร้อมปุ่มล้าง
│   └── SimControls.jsx        # Slider ปรับความเร็ว Consumer และ HPA Threshold
├── pages/
│   ├── SimulationPage.jsx     # หน้าหลักของระบบจำลอง
│   ├── AboutPage.jsx          # หน้าอธิบายแนวคิด
│   └── NotFound.jsx           # หน้า 404
├── constants/
│   └── simulation.js          # ค่าคงที่ Timing, State เริ่มต้น, Mock Users
└── index.css                  # Design System (Tokens, Dark Theme, Animations)
```

---

## วิธีติดตั้งและรันโปรเจกต์

```bash
# ติดตั้ง Dependencies
npm install

# รัน Development Server (localhost:5173)
npm run dev

# Build สำหรับ Production
npm run build
```

---

## คู่มือทดสอบระบบ

| การกระทำ | สิ่งที่จะเห็น |
|---|---|
| กด **"จองตั๋วคอนเสิร์ต"** ครั้งเดียว | คำสั่งเข้า Kafka → Pod รับไปประมวลผล → ตัวนับการจองเพิ่มขึ้น |
| กด **4–5 ครั้งรัว ๆ** | คิวเกิน HPA Threshold → Pod ใหม่ 2 ตัว Spin up (Pending → Running) |
| รอ ~10 วินาที | คิวว่าง → HPA Scale down กลับสู่จำนวน Pod ปกติ |
| กด **"ทำให้เซิร์ฟเวอร์ล่ม"** | Pod เปลี่ยนเป็น Terminating → ลบออก → Pod ใหม่ Self-heal ภายใน 1.5 วินาที |
| เลื่อน **Slider Consumer Speed** | สังเกตคิวสะสมหรือระบายออกเร็วขึ้น |
| เลื่อน **Slider HPA Threshold** | ค่าต่ำ = Scale-up กระตุ้นได้ง่ายขึ้นภายใต้โหลด |

---

## แนวคิดที่โปรเจกต์นี้สาธิต

- **Asynchronous Messaging** — Fire-and-forget พร้อม `202 Accepted` และการประมวลผลแบบแยกอิสระ
- **Event-Driven Architecture** — แยก Producer/Consumer ออกจากกันผ่าน Message Queue
- **Horizontal Scaling** — เพิ่ม Stateless Pod แบบ Dynamic ตามโหลดที่สังเกตได้จริง
- **Fault Tolerance & Self-Healing** — ตรวจจับความล้มเหลวและแทนที่ Pod โดยอัตโนมัติ
- **Single-Page Application Routing** — นำทางฝั่ง Client โดยไม่ต้องโหลดหน้าใหม่

---

*สร้างขึ้นเป็นเครื่องมือเรียนรู้เชิงแนวคิด ไม่มี Kafka Broker, Kubernetes Cluster, หรือเซิร์ฟเวอร์จริงในระบบนี้*
