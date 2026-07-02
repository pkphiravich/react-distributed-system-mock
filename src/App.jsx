import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";

function navStyle({ isActive }) {
  return isActive ? { fontWeight: "bold", textDecoration: "underline" } : {};
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <h2>🎫 ระบบจองตั๋วจำลอง Distributed System (SPA)</h2>
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink to="/" end style={navStyle}>หน้าจองตั๋ว</NavLink>
          {" | "}
          <NavLink to="/about" style={navStyle}>คำอธิบายระบบ</NavLink>
        </nav>
        <hr />
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
