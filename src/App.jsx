import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DetailProduk from "./pages/DetailProduk.jsx";
import ProfilSaya from "./pages/ProfilSaya.jsx";
import PesananSaya from "./pages/PesananSaya.jsx";
import Notifikasi from "./pages/Notifikasi.jsx";
import Keranjang from "./pages/Keranjang.jsx";
import BuatPesanan from "./pages/BuatPesanan.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/produk/:id" element={<DetailProduk />} />

        {/* Routes yang butuh login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profil" element={<ProfilSaya />} />
          <Route path="/pesanan-saya" element={<PesananSaya />} />
          <Route path="/keranjang" element={<Keranjang />} />
          <Route path="/buat-pesanan" element={<BuatPesanan />} />
          <Route path="/notifikasi" element={<Notifikasi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
