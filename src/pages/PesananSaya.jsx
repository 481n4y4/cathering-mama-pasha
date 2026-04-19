import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilLayout from "../components/ProfilLayout";
import iconBack from "../assets/images/icon-back.webp";

const formatRp = (n) => "Rp " + n.toLocaleString("id-ID");

const riwayat = [
  {
    id: "MPX23901", nama: "Risoles Mayonaise", emoji: "🥟",
    tanggal: "12 Feb 2026 • 14:32", jumlah: 3, total: 75000,
    alamat: "Jl. Melati II No. 42", pembayaran: "OVO",
    status: "Selesai", rated: false,
  },
  {
    id: "MPX23901", nama: "Tahu Bakso", emoji: "🍢",
    tanggal: "12 Feb 2026 • 14:32", jumlah: 3, total: 75000,
    alamat: "Jl. Melati II No. 42", pembayaran: "OVO",
    status: "Selesai", rated: true,
  },
];

function PesananAktif() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="text-8xl mb-4 opacity-60">🛍️</div>
      <p className="text-text-mid text-sm text-center leading-relaxed">
        Belum ada pesanan aktif.<br />Yuk pesan snack favoritmu!
      </p>
    </div>
  );
}

function RiwayatPesanan() {
  const [filterAktif, setFilterAktif] = useState("Semua");
  const filters = ["Semua", "Selesai", "Dibatalkan"];
  const filtered = filterAktif === "Semua"
    ? riwayat
    : riwayat.filter((r) => r.status === filterAktif);

  return (
    <div className="px-4 lg:px-8 py-5">
      <p className="text-sm text-text-mid mb-4">
        Lihat semua pesanan yang sudah selesai atau dibatalkan
      </p>

      {/* Filter pills */}
      <div className="flex gap-1 bg-white/40 rounded-full p-1 mb-5 w-fit">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilterAktif(f)}
            className={`px-5 py-1.5 rounded-full text-sm font-bold transition-all duration-200 ${
              filterAktif === f
                ? "bg-pink-6 text-white"
                : "text-text-dark hover:bg-white/50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {filtered.map((p, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 shadow-card">
            {/* Atas */}
            <div className="flex gap-3 mb-3">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-pink-5 flex items-center justify-center text-3xl shrink-0">
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-extrabold text-text-dark text-sm lg:text-base">{p.nama}</p>
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-green-500 text-white shrink-0">
                    {p.status}
                  </span>
                </div>
                <p className="text-xs text-text-mid mt-0.5">{p.tanggal}</p>
                <p className="text-xs text-text-mid">Order ID: {p.id}</p>
              </div>
            </div>

            <div className="border-t border-pink-1 my-3" />

            {/* Bawah */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs text-text-mid">{p.jumlah} Item:</p>
                <p className="text-[11px] font-extrabold text-text-dark tracking-wide mt-0.5">
                  💳 RIWAYAT: {p.pembayaran}
                </p>
              </div>
              <div className="lg:text-right">
                <p className="text-xs text-text-mid">
                  Total <span className="font-extrabold text-text-dark">{formatRp(p.total)}</span>
                </p>
                <p className="text-[10px] text-text-mid">{p.alamat}</p>
              </div>
              {/* Tombol aksi */}
              <div className="flex gap-1.5 flex-wrap">
                <button className="text-[11px] font-bold border border-pink-2 text-text-dark px-3 py-1.5 rounded-full hover:bg-pink-5 active:scale-95 transition-all">
                  Lihat Detail
                </button>
                <button className="text-[11px] font-bold border border-pink-2 text-text-dark px-3 py-1.5 rounded-full hover:bg-pink-5 active:scale-95 transition-all">
                  Pesan Lagi
                </button>
                <button className={`text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-all flex items-center gap-1 ${
                  p.rated
                    ? "border border-yellow-400 text-yellow-600 bg-yellow-50"
                    : "border border-pink-2 text-text-dark hover:bg-pink-5"
                }`}>
                  {p.rated && <span>⭐</span>} Beri Rating
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PesananSaya({ onNavigate }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("aktif");

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (path === "beranda") {
      navigate("/");
    } else if (path === "profil-saya") {
      navigate("/profil");
    } else {
      navigate(`/${path}`);
    }
  };

  return (
    <ProfilLayout
      activeMenu="pesanan-saya"
      onNavigate={handleNavigate}
      title="Pesanan Saya"
      onBack={() => handleNavigate("beranda")}
    >
      {/* Top bar DESKTOP */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-3">
          <button onClick={() => handleNavigate("beranda")} className="text-text-dark font-bold text-xl flex items-center justify-center w-10 h-10 rounded-full transition-opacity">
            <img src={iconBack} alt="Back" className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-extrabold text-text-dark">Pesanan Saya</h1>
        </div>
      </div>

      {/* Tab */}
      <div className="flex shadow-md shadow-pink-800/20 bg-white/20">
        {[{ key: "aktif", label: "Pesanan Aktif" }, { key: "riwayat", label: "Riwayat Pesanan" }].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors relative ${
              activeTab === key ? "text-pink-6" : "text-text-mid hover:text-text-dark"
            }`}
          >
            {label}
            {activeTab === key && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-pink-6 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {activeTab === "aktif" ? <PesananAktif /> : <RiwayatPesanan />}
    </ProfilLayout>
  );
}