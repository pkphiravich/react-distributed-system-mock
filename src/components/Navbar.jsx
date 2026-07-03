import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🎫</span>
        <div className="navbar__titles">
          <span className="navbar__title">ระบบจองตั๋วจำลอง</span>
          <span className="navbar__subtitle">Distributed System Mock</span>
        </div>
      </div>
      <nav className="navbar__nav" aria-label="เมนูหลัก">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}
        >
          จำลองระบบ
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}
        >
          คำอธิบาย
        </NavLink>
      </nav>
    </header>
  );
}
