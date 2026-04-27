import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilLayout from "../components/ProfilLayout";

const formatRp = (n) => "Rp " + n.toLocaleString("id-ID");

const riwayat = [];

function PesananAktif() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="text-8xl mb-4 opacity-60">🛍️</div>
      <p className="text-text-mid text-sm text-center leading-relaxed">
        Belum ada pesanan aktif.
        <br />
        Yuk pesan snack favoritmu!
      </p>
    </div>
  );
}

function RiwayatPesanan() {
  const navigate = useNavigate();
  const filtered = riwayat;

  return (
    <div className="px-4 lg:px-8 py-5">
      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="text-6xl mb-3 opacity-60">📭</div>
          <p className="text-text-mid text-sm text-center leading-relaxed">
            Belum ada riwayat pesanan.
            <br />
            Yuk mulai pesan menu favoritmu!
          </p>
        </div>
      ) : (
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
                  <p className="font-extrabold text-text-dark text-sm lg:text-base">
                    {p.nama}
                  </p>
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
                  Total{" "}
                  <span className="font-extrabold text-text-dark">
                    {formatRp(p.total)}
                  </span>
                </p>
                <p className="text-[10px] text-text-mid">{p.alamat}</p>
              </div>
              {/* Tombol aksi */}
              <div className="flex gap-1.5 flex-wrap">
                <button className="text-[11px] font-bold border border-pink-2 text-text-dark px-3 py-1.5 rounded-full hover:bg-pink-5 active:scale-95 transition-all">
                  Lihat Detail
                </button>
                <button
                  onClick={() => navigate(`/produk/${p.productId}`)}
                  className="text-[11px] font-bold border border-pink-2 text-text-dark px-3 py-1.5 rounded-full hover:bg-pink-5 active:scale-95 transition-all"
                >
                  Pesan Lagi
                </button>
                <button
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-all flex items-center gap-1 ${
                    p.rated
                      ? "border border-yellow-400 text-yellow-600 bg-yellow-50"
                      : "border border-pink-2 text-text-dark hover:bg-pink-5"
                  }`}
                >
                  {p.rated && <span>⭐</span>} Beri Rating
                </button>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}
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
      {/* ══ Top bar DESKTOP ══ */}
      <div className="hidden lg:block sticky top-0 z-40 px-3 pt-3 lg:px-8 lg:pt-4 pointer-events-none">
        <div className="pointer-events-auto grid grid-cols-3 items-center h-13 lg:h-16 px-4 bg-white rounded-full border border-pink-2 shadow-nav">
          <div className="flex justify-start">
            <button
              onClick={() => handleNavigate("beranda")}
              className="flex items-center gap-2 border border-pink-2 rounded-full px-3 py-1.5 bg-pink-5 hover:bg-pink-1 transition-colors"
              aria-label="Kembali"
            >
              <i className="fa-solid fa-arrow-left text-text-dark"></i>
              <span className="text-[11px] lg:text-sm font-bold text-text-dark">
                Kembali
              </span>
            </button>
          </div>
          <div className="flex justify-center">
            <span className="text-sm lg:text-base font-extrabold text-text-dark">
              Pesanan Saya
            </span>
          </div>
          <div className="flex justify-end" />
        </div>
      </div>

      {/* Tab */}
      <div className="flex shadow-md shadow-pink-800/20 bg-white/20">
        {[
          { key: "aktif", label: "Pesanan Aktif" },
          { key: "riwayat", label: "Riwayat Pesanan" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors relative ${
              activeTab === key
                ? "text-pink-6"
                : "text-text-mid hover:text-text-dark"
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
