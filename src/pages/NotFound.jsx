import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="panel panel--light" style={{ textAlign: "center", padding: "40px" }}>
      <h2>404 — ไม่พบหน้านี้</h2>
      <p>หน้าที่คุณมองหาไม่มีอยู่ในระบบ</p>
      <Link to="/" className="btn btn--primary" style={{ display: "inline-block", marginTop: "16px" }}>
        ← กลับหน้าหลัก
      </Link>
    </div>
  );
}
