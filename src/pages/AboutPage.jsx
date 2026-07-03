export default function AboutPage() {
  return (
    <div className="about-page">
      <h2 className="about-title">📖 ทำความเข้าใจ Distributed System</h2>

      <p className="about-intro">
        เว็บนี้จำลองสถาปัตยกรรมที่ใช้งานจริงในบริษัทเทคขนาดใหญ่ เช่น Agoda, LINE, Shopee
        เพื่อรองรับผู้ใช้หลายแสนคนที่กดจองหรือซื้อของพร้อมกันในทันที
        โดยไม่ให้ระบบล่มหรือผู้ใช้รอนาน
      </p>

      <div className="concept-grid">
        <div className="concept-card">
          <div className="concept-icon">🐳</div>
          <h3>Docker Container</h3>
          <p>
            ลองนึกถึง "กล่องข้าวกลางวัน" ที่ห่อโปรแกรมและ dependencies ทุกอย่างไว้ในกล่องเดียว
            รันบนเครื่องไหนก็ได้ผลเหมือนกัน — ไม่มี "ในเครื่องฉันรันได้นะ" อีกต่อไป
          </p>
        </div>

        <div className="concept-card">
          <div className="concept-icon">☸️</div>
          <h3>Kubernetes (K8s)</h3>
          <p>
            "ผู้จัดการโรงงาน" ที่คอยดูแล Container ทั้งหมด ถ้า Pod ไหนล่มก็สั่งเปิดใหม่ทันที
            (Self-healing) และถ้าโหลดหนักก็เพิ่ม Pod ให้อัตโนมัติ (Auto-scaling)
            โดยไม่ต้องให้คนมานั่งดูตลอด
          </p>
        </div>

        <div className="concept-card">
          <div className="concept-icon">🪵</div>
          <h3>Apache Kafka</h3>
          <p>
            "กล่องจดหมายขนาดยักษ์" ที่รับคำสั่งซื้อทุกอัน แทนที่จะส่งตรงไปหลังบ้านทันที
            Kafka เก็บไว้ในคิวก่อน แล้วค่อยส่งให้ทีละคิว
            ทำให้ระบบรับออเดอร์ได้แม้หลังบ้านยังไม่ว่าง
          </p>
        </div>

        <div className="concept-card">
          <div className="concept-icon">📈</div>
          <h3>HPA — Horizontal Pod Autoscaler</h3>
          <p>
            เมื่อคิวใน Kafka แน่น (ตั้งค่า threshold ได้ในหน้าจำลอง)
            K8s จะสั่งสร้าง Pod เพิ่มโดยอัตโนมัติเพื่อช่วยรับมือโหลด
            และเมื่อโหลดเบาลง ก็ลด Pod กลับสู่ขนาดปกติเพื่อประหยัด Resource
          </p>
        </div>

        <div className="concept-card">
          <div className="concept-icon">💊</div>
          <h3>Self-healing</h3>
          <p>
            กด "ทำให้เซิร์ฟเวอร์ล่ม" แล้วดูว่าเกิดอะไรขึ้น K8s ตรวจพบ Pod ล้มเหลว
            แล้วสร้าง Pod ใหม่มาแทนที่โดยอัตโนมัติภายในไม่กี่วินาที
            ระบบแทบไม่มี Downtime เลย
          </p>
        </div>

        <div className="concept-card">
          <div className="concept-icon">⚡</div>
          <h3>Async Processing</h3>
          <p>
            สังเกตว่าพอกดจองตั๋ว หน้าเว็บตอบกลับ "202 Accepted" ทันทีโดยไม่รอหลังบ้าน
            นี่คือหัวใจของ Async — ผู้ใช้ไม่รอ ระบบรับงานไว้ก่อนแล้วค่อยประมวลผลทีหลัง
          </p>
        </div>
      </div>

      <div className="flow-section">
        <h3>🔄 ขั้นตอนการทำงาน (Flow)</h3>
        <ol className="flow-steps">
          <li>ผู้ใช้กด "จองตั๋ว" บน React App (หน้าบ้าน)</li>
          <li>React ส่ง HTTP POST ไปหลังบ้าน — ได้รับ <code>202 Accepted</code> ทันที ไม่ต้องรอ</li>
          <li>คำสั่งซื้อถูกเพิ่มเข้า Kafka Topic: <code>ticket-orders</code></li>
          <li>Kafka Consumer (หลังบ้าน) ดึงคำสั่งออกมาทีละคิวตามความเร็วที่ตั้งไว้</li>
          <li>ส่งงานให้ Kubernetes Pod ที่ว่างอยู่ประมวลผล (Load Balancing)</li>
          <li>ถ้าคิวแน่นเกิน threshold → HPA สร้าง Pod เพิ่ม | ถ้าคิวว่าง → HPA ลด Pod กลับ</li>
        </ol>
      </div>

      <div className="real-world-section">
        <h3>🌍 ใช้งานจริงที่ไหนบ้าง?</h3>
        <div className="use-cases">
          <div className="use-case">
            🎟️ <strong>จองตั๋วคอนเสิร์ต</strong> — ThaiTicket Major, Ticketmaster
            รับออเดอร์หลักแสนในเสี้ยววินาทีโดยไม่ให้เว็บค้าง
          </div>
          <div className="use-case">
            🛒 <strong>Flash Sale</strong> — Shopee, Lazada ช่วง 11.11
            สเกล Pod ขึ้นก่อนโปรโมชั่นเริ่ม ลดลงหลังโปรโมชั่นจบ
          </div>
          <div className="use-case">
            🏦 <strong>ธุรกรรมธนาคาร</strong> — KBank, SCB
            รับ Transaction หลายล้านครั้งต่อวันผ่าน Kafka เพื่อให้ไม่มีข้อมูลหาย
          </div>
          <div className="use-case">
            🚗 <strong>Ride-hailing</strong> — Grab
            จับคู่ผู้โดยสารและคนขับแบบ Real-time ด้วย Event-driven Architecture
          </div>
        </div>
      </div>

      <div className="spa-note">
        <strong>💡 นี่คือ SPA (Single Page Application)</strong> —
        สังเกตว่า Log ด้านซ้ายไม่หายไปแม้จะกดสลับมาหน้านี้ เพราะ React ไม่โหลดหน้าใหม่
        แค่สลับ Component แทน ทำให้ State ทั้งหมดยังคงอยู่
      </div>
    </div>
  );
}
