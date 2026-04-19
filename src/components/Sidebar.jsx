import { useState } from "react";
import logoMamaPasha from "../assets/images/logo-kecil.webp";

export default function Sidebar({
  activeMenu,
  onNavigate,
  children,
  title,
  onBack,
}) {
  // Ambil data user dari localStorage untuk foto & nama
  const rawUser = localStorage.getItem("user");
  const userData = rawUser
    ? (() => {
        try {
          return JSON.parse(rawUser);
        } catch {
          return null;
        }
      })()
    : null;
  const namaUser = userData?.nama_user || userData?.nama || "User";
  const profilePhoto =
    userData?.foto_profile ||
    userData?.foto_profil ||
    userData?.photo ||
    logoMamaPasha;

  const menus = [
    { key: "profil-saya", icon: "👤", label: "Profile" },
    { key: "pesanan-saya", icon: "📥", label: "Pesanan Saya" },
    { key: "keranjang", icon: "🛒", label: "Keranjang" },
    { key: "notifikasi", icon: "🔔", label: "Notifikasi" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.dispatchEvent(new Event("auth-changed"));
    onNavigate("beranda");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* ══════════════════════════════════════════════════════
          SIDEBAR DESKTOP
          - border kiri & kanan putih, ketebalan SAMA (2px)
          - TIDAK ada border-radius sama sekali
          - TIDAK ada margin — nempel ke tepi kiri
          - Lebar 260px
      ══════════════════════════════════════════════════════ */}
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
        {/* ── Foto profil bulat 120px ── */}
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
            src={profilePhoto}
            alt="Foto Profil"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* ── Nama user ── */}
        <p
          className="font-extrabold mb-8 text-center"
          style={{ color: "#1a1a1a", fontSize: 19 }}
        >
          {namaUser}
        </p>

        {/* ── Menu navigasi ── */}
        <nav className="w-full flex flex-col gap-1 mb-auto">
          {menus.map(({ key, icon, label }) => {
            const isActive = activeMenu === key;
            return (
              <button
                key={key}
                onClick={() => onNavigate(key)}
                className="flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-200 w-full text-left"
                style={{
                  background: isActive
                    ? "rgba(255,255,255,0.45)"
                    : "transparent",
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontSize: 15,
                }}
              >
                <span className="text-xl w-7 flex items-center justify-center shrink-0">
                  {icon}
                </span>
                {label}
              </button>
            );
          })}
        </nav>

        {/* ── Tombol Logout ── */}
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

      {/* ══════════════════════════════════════════
          KONTEN UTAMA
      ══════════════════════════════════════════ */}
      <div
        className="flex-1 min-w-0 min-h-screen flex flex-col"
        style={{
          background:
            "linear-gradient(160deg, #FCC7D1 0%, #F0B3C5 50%, #E47990 100%)",
        }}
      >
        {/* ── Top bar MOBILE ── */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-pink-2/30">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack || (() => onNavigate("beranda"))}
              className="text-[#B8445E] font-bold text-xl flex items-center justify-center w-10 h-10 rounded-full transition-opacity"
              aria-label="Kembali"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="text-base font-extrabold text-[#B8445E]">{title}</h1>
          </div>
        </div>

        {/* Konten halaman */}
        <div className="flex-1">{children}</div>

        {/* ── Bottom Tab Bar MOBILE ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 flex z-50">
          {menus.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors"
              style={{ color: activeMenu === key ? "#B8445E" : "#aaa" }}
            >
              <span className="text-lg">{icon}</span>
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

        {/* Padding bawah mobile */}
        <div className="lg:hidden h-20" />
      </div>
    </div>
  );
}
