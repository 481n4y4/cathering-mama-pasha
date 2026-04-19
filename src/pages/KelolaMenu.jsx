import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, Edit, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";
import { getProducts, deleteProduct } from "../services/api";

const formatRupiah = (value) => {
  return typeof value === "number"
    ? `Rp ${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
    : value;
};

const KelolaMenu = () => {
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus menu ini?")) {
      try {
        await deleteProduct(id);
        // Hapus menu dari tampilan tanpa perlu fetch ulang
        setMenus(menus.filter((menu) => (menu.id || menu._id) !== id));
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus menu. Silakan coba lagi.");
      }
    }
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await getProducts();
        if (response.success && response.data) {
          setMenus(response.data);
        } else {
          setError("Gagal memuat data menu.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan sistem.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  // Hitung statistik
  const totalMenu = menus.length;
  const menuTersedia = menus.filter((m) => m.stok > 0).length;
  const menuHabis = menus.filter((m) => m.stok === 0).length;

  return (
    <div className="flex bg-[#f7c7cd] min-h-screen font-sans">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Content */}
        <NavbarProfile page="/" />

        <div className="p-10 pb-6 flex flex-col gap-8 shrink-0">
          {/* Stats Cards & Tambah Menu Button */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col w-48 border-2 border-white hover:border-pink-200 transition-colors">
              <span className="text-sm font-semibold text-gray-800 mb-2">
                Total Menu
              </span>
              <span className="text-4xl font-extrabold text-black">
                {totalMenu}
              </span>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col w-48 border-2 border-white hover:border-pink-200 transition-colors">
              <span className="text-sm font-semibold text-gray-800 mb-2">
                Menu Tersedia
              </span>
              <span className="text-4xl font-extrabold text-black">
                {menuTersedia}
              </span>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col w-48 border-2 border-white hover:border-pink-200 transition-colors">
              <span className="text-sm font-semibold text-gray-800 mb-2">
                Menu Habis
              </span>
              <span className="text-4xl font-extrabold text-black">
                {menuHabis}
              </span>
            </div>

            {/* Button */}
            <div className="ml-auto">
              <button
                onClick={() => navigate("/admin/kelola-menu/tambah")}
                className="bg-[#e96481] hover:bg-[#d45672] text-white font-bold py-4 px-6 rounded-2xl shadow-md flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" strokeWidth={3} />
                Tambah Menu
              </button>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="px-10 pb-10 flex-1 overflow-hidden flex flex-col">
          <div className="bg-white rounded-3xl shadow-md flex flex-col flex-1 overflow-hidden">
            {/* Table Header / Toolbar */}
            <div className="p-8 pb-4 flex justify-between items-center shrink-0">
              <h2 className="text-3xl font-bold text-black">Daftar Menu</h2>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Menu..."
                  className="bg-[#f0d8df] text-gray-800 pl-11 pr-4 py-3 rounded-xl w-72 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-500 font-medium"
                />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto px-8">
              <table className="w-full text-left border-collapse min-w-max">
                <thead className="bg-[#f2e1ce] sticky top-0 z-10">
                  <tr>
                    <th className="py-4 px-6 font-bold text-black rounded-l-lg">
                      No
                    </th>
                    <th className="py-4 px-6 font-bold text-black">
                      Nama Menu
                    </th>
                    <th className="py-4 px-6 font-bold text-black">Harga</th>
                    <th className="py-4 px-6 font-bold text-black text-center">
                      Stok
                    </th>
                    <th className="py-4 px-6 font-bold text-black text-center">
                      Status
                    </th>
                    <th className="py-4 px-6 font-bold text-black text-center rounded-r-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-5 px-6 text-center font-bold text-gray-500"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-5 px-6 text-center font-bold text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : menus.length > 0 ? (
                    menus.map((item, index) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-5 px-6 font-bold text-black">
                          {index + 1}
                        </td>
                        <td className="py-5 px-6 font-bold text-black">
                          {item.nama_produk}
                        </td>
                        <td className="py-5 px-6 font-bold text-black">
                          {formatRupiah(item.harga)}
                        </td>
                        <td className="py-5 px-6 font-bold text-black text-center">
                          {item.stok}
                        </td>
                        <td className="py-5 px-6 text-center">
                          <span
                            className={`py-1.5 px-4 rounded-full text-sm font-bold inline-block min-w-[100px] ${
                              item.stok > 0
                                ? "bg-[#bbf2c8] text-[#2c7847]" // Hijau (Tersedia)
                                : "bg-[#f2bbbb] text-[#a82b2b]" // Merah (Habis)
                            }`}
                          >
                            {item.stok > 0 ? "Tersedia" : "Habis"}
                          </span>
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/kelola-menu/edit/${item.id || item._id}`,
                                )
                              }
                              className="bg-[#ffe8a1] hover:bg-[#f5d774] p-2 rounded-lg text-[#9c7714] transition-colors shadow-sm"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id || item._id)}
                              className="bg-[#e86b6b] hover:bg-[#d65c5c] p-2 rounded-lg text-white transition-colors shadow-sm"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-5 px-6 text-center font-bold text-gray-500"
                      >
                        Belum ada data menu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 px-8 border-t border-gray-100 flex justify-between items-center shrink-0">
              <span className="text-gray-400 font-semibold text-sm">
                Menampilkan {menus.length > 0 ? 1 : 0} - {menus.length} dari{" "}
                {menus.length} menu
              </span>
              <div className="flex items-center gap-2 text-gray-600 font-bold">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                  &lt;
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-[#e4839e] text-white rounded-lg shadow-sm">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                  2
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                  3
                </button>
                <span className="px-1 text-gray-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                  16
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KelolaMenu;
