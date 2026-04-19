import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilLayout from "../components/ProfilLayout";

const notifikasiData = [
  {
    id: 1,
    judul: "Nikmati Diskon 20% Semua Snack!",
    deskripsi:
      "Ayo pesan snack favoritmu, diskon terbatas sampai akhir bulan ini.",
    waktu: "Baru saja",
    warna: "bg-orange-400",
    tipe: "Promo",
    aksi: null,
  },
  {
    id: 2,
    judul: "Risol Mayo Sedang Dikirim",
    deskripsi: "Pesananmu sedang dalam perjalanan, tunggu sebentar lagi ya!",
    waktu: "15 menit lalu",
    warna: "bg-yellow-400",
    tipe: "Pesan",
    aksi: null,
  },
  {
    id: 3,
    judul: "Pesanan Telah Selesai!",
    deskripsi: "Tahu Baksomu telah sukses diantar. Yuk beri rating!",
    waktu: "Kemarin",
    warna: "bg-green-500",
    tipe: "Pesan",
    aksi: "Beri Rating",
  },
  {
    id: 4,
    judul: "Promo Gratis Ongkir Minggu Ini!",
    deskripsi:
      "Nikmati gratis ongkir untuk semua pesanan minggu ini. S&K berlaku.",
    waktu: "2 hari lalu",
    warna: "bg-pink-4",
    tipe: "Promo",
    aksi: null,
  },
  {
    id: 5,
    judul: "Order #MPX28752 Telah Dibatalkan",
    deskripsi: "Pesanan Sosis Solomu telah dibatalkan. Yuk coba pesan lagi!",
    waktu: "2 minggu lalu",
    warna: "bg-pink-6",
    tipe: "Pesan",
    aksi: null,
  },
];

export default function Notifikasi({ onNavigate }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Semua");
  const tabs = ["Semua", "Promo", "Pesan"];
  const filtered =
    activeTab === "Semua"
      ? notifikasiData
      : notifikasiData.filter((n) => n.tipe === activeTab);

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
      activeMenu="notifikasi"
      onNavigate={handleNavigate}
      title="Notifikasi"
      onBack={() => handleNavigate("beranda")}
    >
      {/* Top bar DESKTOP */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-pink-2/40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate("beranda")}
            className="text-text-dark font-bold text-xl flex items-center justify-center w-10 h-10 rounded-full transition-opacity"
            aria-label="Kembali"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1 className="text-xl font-extrabold text-text-dark">Notifikasi</h1>
        </div>
      </div>

      <p className="px-4 lg:px-8 pt-4 pb-2 text-sm text-text-mid shadow-md shadow-pink-800/20">
        Cek pemberitahuan terbaru pesananmu disini
      </p>

      {/* Tab filter */}
      <div className="flex gap-6 px-4 lg:px-8 py-3 border-b border-pink-2/30">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`text-sm font-bold pb-1 relative transition-colors ${
              activeTab === t
                ? "text-pink-6"
                : "text-text-mid hover:text-text-dark"
            }`}
          >
            {t}
            {activeTab === t && (
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-6 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* List notifikasi */}
      <div className="flex flex-col gap-3 px-4 lg:px-8 py-4">
        {filtered.map((n) => (
          <div
            key={n.id}
            className="bg-white rounded-2xl p-4 shadow-card flex gap-3 items-start"
          >
            <div
              className={`w-10 h-10 rounded-full ${n.warna} shrink-0 mt-0.5`}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-extrabold text-text-dark leading-snug">
                  {n.judul}
                </p>
                <span className="text-[10px] text-text-mid whitespace-nowrap shrink-0">
                  {n.waktu}
                </span>
              </div>
              <p className="text-xs text-text-mid leading-relaxed">
                {n.deskripsi}
              </p>
              {n.aksi && (
                <button className="mt-2 text-[10px] font-bold border border-pink-2 text-text-dark px-3 py-1 rounded-full hover:bg-pink-5 active:scale-95 transition-all">
                  {n.aksi}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </ProfilLayout>
  );
}
