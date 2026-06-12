import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// 📄 นำเข้าหน้าหลักทั้งสอง ที่เราได้ทำการหั่นแยกบ้านไปเมื่อครู่นี้
import BookingPage from "./pages/BookingPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "900px", margin: "0 auto" }}>
        
        <h2>🎫 ระบบจองตั๋วจำลอง Distributed System (SPA)</h2>
        <nav>
          <Link to="/">หน้าจองตั๋ว</Link> | <Link to="/about">คำอธิบายระบบ</Link>
        </nav>
        <hr />

        {/* โค้ดสั้นลงและทำหน้าที่จัดการทิศทางอย่างเดียวชัดเจน */}
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}