import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h2 className="not-found__title">ไม่พบหน้านี้</h2>
      <p className="not-found__desc">หน้าที่คุณมองหาไม่มีอยู่ในระบบ</p>
      <Link to="/" className="btn btn--primary">
        ← กลับหน้าหลัก
      </Link>
    </div>
  );
}
