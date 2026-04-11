import { useState } from "react";

/*
  ProfilLayout — responsif:
  - HP      : tidak ada sidebar, navigasi via bottom tab bar
  - Desktop : sidebar kiri fixed + konten kanan
*/
export default function ProfilLayout({ activeMenu, onNavigate, children, title, onBack }) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const menus = [
    { key: "beranda",      icon: "🏠", label: "Beranda"      },
    { key: "pesanan-saya", icon: "📥", label: "Pesanan Saya" },
    { key: "disimpan",     icon: "🔖", label: "Disimpan"     },
    { key: "notifikasi",   icon: "🔔", label: "Notifikasi"   },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ══════════════════════════════════════════
          SIDEBAR — hanya desktop (lg ke atas)
      ══════════════════════════════════════════ */}
      <aside
        className="hidden lg:flex flex-col items-center pt-10 pb-8 px-5 min-h-screen sticky top-0 w-[240px] shrink-0"
        style={{ background: "#F0B3C5" }}
      >
        {/* Foto profil */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-card mb-3">
          <div className="w-full h-full bg-pink-2 flex items-center justify-center text-5xl">
            👤
          </div>
        </div>

        {/* Nama */}
        <p className="font-extrabold text-text-dark text-xl mb-10">Jeno</p>

        {/* Menu navigasi */}
        <nav className="w-full flex flex-col gap-1 mb-auto">
          {menus.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-base font-bold text-text-dark hover:bg-white/40 transition-all duration-200 w-full text-left"
            >
              <span className="text-xl w-7 text-center">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Tombol Keluar */}
        <button className="w-full mt-8 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-bold py-3.5 rounded-2xl transition-all">
          Keluar
        </button>
      </aside>

      {/* ══════════════════════════════════════════
          KONTEN UTAMA
      ══════════════════════════════════════════ */}
      <div
        className="flex-1 min-w-0 min-h-screen flex flex-col"
        style={{ background: "linear-gradient(160deg, #FCC7D1 0%, #F0B3C5 50%, #E47990 100%)" }}
      >

        {/* ── Top bar MOBILE ── */}
        <div className="lg:hidden flex items-center justify-between px-4 py-4 bg-white/30 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack || (() => onNavigate("beranda"))}
              className="text-text-dark font-bold text-lg"
            >
              ←
            </button>
            <h1 className="text-base font-extrabold text-text-dark">{title}</h1>
          </div>
          <button className="text-text-dark text-lg">🔍</button>
        </div>

        {/* Konten halaman */}
        <div className="flex-1">
          {children}
        </div>

        {/* ── Bottom Tab Bar MOBILE ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-2 flex z-50">
          {menus.map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => onNavigate(key)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors ${
                activeMenu === key ? "text-pink-6" : "text-text-mid"
              }`}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-[9px] font-bold">{label}</span>
            </button>
          ))}
          {/* Keluar di mobile */}
          <button
            onClick={() => onNavigate("beranda")}
            className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 text-red-500"
          >
            <span className="text-lg">🚪</span>
            <span className="text-[9px] font-bold">Keluar</span>
          </button>
        </div>

        {/* Padding bawah supaya konten tidak ketutup bottom bar di HP */}
        <div className="lg:hidden h-20" />
      </div>

    </div>
  );
}