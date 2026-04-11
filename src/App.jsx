import { useState } from "react";
import Navbar       from "./components/Navbar";
import Dashboard    from "./components/Dashboard";
import DetailProduk from "./components/DetailProduk";
import BuatPesanan  from "./components/BuatPesanan";
import ProfilSaya   from "./components/ProfilSaya";
import PesananSaya  from "./components/PesananSaya";
import Notifikasi   from "./components/Notifikasi";
import "./index.css";

/*
  Daftar halaman:
  "dashboard"     → halaman utama
  "detail"        → detail produk
  "buat-pesanan"  → form buat pesanan
  "profil-saya"   → profil pengguna
  "pesanan-saya"  → pesanan & riwayat
  "notifikasi"    → notifikasi
*/

export default function App() {
  const [halaman, setHalaman]             = useState("dashboard");
  const [cartCount, setCartCount]         = useState(0);
  const [produkDipilih, setProdukDipilih] = useState(null);
  const [qtyDipilih, setQtyDipilih]       = useState(1);

  /* Navigasi dari sidebar profil */
  const handleNavProfilMenu = (key) => {
    if (key === "beranda")       setHalaman("dashboard");
    else if (key === "pesanan-saya")  setHalaman("pesanan-saya");
    else if (key === "notifikasi")    setHalaman("notifikasi");
    else if (key === "profil-saya")   setHalaman("profil-saya");
    else setHalaman("dashboard");
  };

  /* Halaman dengan sidebar (tidak pakai Navbar atas) */
  const halamanProfil = ["profil-saya", "pesanan-saya", "notifikasi", "disimpan"];
  const tampilNavbar  = !halamanProfil.includes(halaman);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--color-pink-1)_0%,_var(--color-pink-5)_55%,_var(--color-pink-2)_100%)]">

      {/* Navbar hanya di dashboard & detail produk */}
      {tampilNavbar && halaman !== "buat-pesanan" && halaman !== "detail" && (
        <Navbar
          cartCount={cartCount}
          onCartClick={() => setHalaman("pesanan-saya")}
          onProfilClick={() => setHalaman("profil-saya")}
        />
      )}

      {/* ── Routing ── */}
      {halaman === "dashboard" && (
        <Dashboard
          onAddToCart={() => setCartCount((n) => n + 1)}
          onDetailProduk={(produk) => {
            setProdukDipilih(produk);
            setHalaman("detail");
          }}
        />
      )}

      {halaman === "detail" && (
        <DetailProduk
          produk={produkDipilih}
          cartCount={cartCount}
          onBack={() => setHalaman("dashboard")}
          onKeranjang={(produk, qty) => {
            setCartCount((n) => n + qty);
            setHalaman("dashboard");
          }}
          onPesan={(produk, qty) => {
            setProdukDipilih(produk);
            setQtyDipilih(qty);
            setHalaman("buat-pesanan");
          }}
        />
      )}

      {halaman === "buat-pesanan" && (
        <BuatPesanan
          produk={produkDipilih}
          qty={qtyDipilih}
          onBack={() => setHalaman("detail")}
        />
      )}

      {halaman === "profil-saya" && (
        <ProfilSaya onNavigate={handleNavProfilMenu} />
      )}

      {halaman === "pesanan-saya" && (
        <PesananSaya onNavigate={handleNavProfilMenu} />
      )}

      {halaman === "notifikasi" && (
        <Notifikasi onNavigate={handleNavProfilMenu} />
      )}

    </div>
  );
}