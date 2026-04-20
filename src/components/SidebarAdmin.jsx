import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { BarChart3, List, Users, ShoppingCart, Bell } from "lucide-react";
import logoMamaPasha from "../assets/images/logo-kecil.png";

const SidebarAdmin = ({ children, title = "Admin", onBack }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      key: "statistik",
      label: "Statistik",
      path: "/admin/statistik",
      Icon: BarChart3,
    },
    {
      key: "kelola-menu",
      label: "Kelola Menu",
      path: "/admin/kelola-menu",
      Icon: List,
    },
    {
      key: "kelola-user",
      label: "Kelola User",
      path: "/admin/kelola-user",
      Icon: Users,
    },
    {
      key: "kelola-pesanan",
      label: "Kelola Pesanan",
      path: "/admin/kelola-pesanan",
      Icon: ShoppingCart,
    },
    {
      key: "notifikasi",
      label: "Notifikasi",
      path: "/admin/notifikasi",
      Icon: Bell,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("auth-changed"));
    navigate("/auth");
  };

  const navItemClass = ({ isActive }) =>
    "flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 w-full text-left " +
    (isActive
      ? "bg-white/50 text-[#1a1a1a]"
      : "text-[#1a1a1a] hover:bg-white/40");

  const isActivePath = (path) => location.pathname.startsWith(path);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/admin/statistik");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside
        className="hidden lg:flex flex-col items-center pt-10 pb-8 px-6 min-h-screen sticky top-0 shrink-0"
        style={{
          width: 260,
          background: "#F0B3C5",
          borderLeft: "2px solid rgba(255,255,255,0.90)",
          borderRight: "2px solid rgba(255,255,255,0.90)",
          borderRadius: 0,
        }}
      >
        <div className="flex flex-col items-center mb-8">
          <div
            className="mb-3 shrink-0"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              overflow: "hidden",
              border: "4px solid white",
              boxShadow: "0 2px 16px rgba(184,68,94,0.20)",
              background: "white",
            }}
          >
            <img
              src={logoMamaPasha}
              alt="Logo Mama Pasha's Treats"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <p
            className="font-extrabold mb-2 text-center"
            style={{ color: "#1a1a1a", fontSize: 19 }}
          >
            Admin
          </p>
          <span className="text-[11px] font-bold text-[#B8445E] bg-white/60 px-3 py-1 rounded-full">
            Administrator
          </span>
        </div>

        <nav className="w-full flex flex-col gap-1 mb-auto">
          {menus.map(({ path, label, Icon }) => (
            <NavLink key={path} to={path} className={navItemClass}>
              <Icon className="w-5 h-5" strokeWidth={2.5} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full font-bold text-white transition-all hover:opacity-90 active:scale-95"
          style={{
            marginTop: 24,
            padding: "14px 0",
            borderRadius: 16,
            background: "#E53935",
            fontSize: 15,
            boxShadow: "0 4px 12px rgba(229,57,53,0.25)",
          }}
        >
          Logout
        </button>
      </aside>

      <div
        className="flex-1 min-w-0 min-h-screen flex flex-col font-sans"
        style={{ background: "#f7c7cd" }}
      >
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-pink-2/30">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              className="text-[#B8445E] font-bold text-xl flex items-center justify-center w-10 h-10 rounded-full transition-opacity"
              aria-label="Kembali"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="text-base font-extrabold text-[#B8445E]">{title}</h1>
          </div>
        </div>

        <div className="flex-1">{children}</div>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 flex z-50">
          {menus.map(({ path, label, Icon }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors"
              style={{ color: isActivePath(path) ? "#B8445E" : "#aaa" }}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
              <span className="text-[9px] font-bold">{label}</span>
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5"
            style={{ color: "#E53935" }}
          >
            <span className="text-lg">🚪</span>
            <span className="text-[9px] font-bold">Logout</span>
          </button>
        </div>

        <div className="lg:hidden h-20" />
      </div>
    </div>
  );
};

export default SidebarAdmin;
