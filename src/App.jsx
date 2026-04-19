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
import DashboardAdmin from "./pages/DashboardAdmin.jsx";
import KelolaMenu from "./pages/KelolaMenu.jsx";
import KelolaUser from "./pages/KelolaUser.jsx";
import KelolaPesanan from "./pages/KelolaPesanan.jsx";
import NotifAdmin from "./pages/NotifAdmin.jsx";
import TambahMenu from "./pages/TambahMenu.jsx";
import EditMenu from "./pages/EditMenu.jsx";
import DetailUser from "./pages/DetailUser.jsx";

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
          <Route path="/profil/:id" element={<ProfilSaya />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/admin/kelola-menu" element={<KelolaMenu />} />
          <Route path="/admin/kelola-user" element={<KelolaUser />} />
          <Route path="/admin/kelola-pesanan" element={<KelolaPesanan />} />
          <Route path="/admin/notifikasi" element={<NotifAdmin />} />
          <Route path="/admin/kelola-menu/tambah" element={<TambahMenu />} />
          <Route path="/admin/kelola-menu/edit/:id" element={<EditMenu />} />
          <Route path="/admin/kelola-user/:id" element={<DetailUser />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
