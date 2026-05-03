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

  const totalMenu = menus.length;

  return (
    <SidebarAdmin title="Kelola Menu">
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Content */}
        <div className="sticky top-0 z-20">
          <NavbarProfile backTo="/" />
        </div>

        <div className="flex-1 overflow-auto">
          <div className="px-4 py-5 sm:p-6 sm:pb-4 flex flex-col gap-6 shrink-0">
            {/* Stats Cards & Tambah Menu Button */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
              {/* Cards */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col w-full sm:w-52 border-2 border-white hover:border-pink-200 transition-colors text-center">
                <span className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                  Total Menu
                </span>
                <span className="text-3xl sm:text-4xl font-extrabold text-black">
                  {totalMenu}
                </span>
              </div>

              {/* Button */}
              <div className="w-full sm:w-auto sm:ml-auto">
                <button
                  onClick={() => navigate("/admin/kelola-menu/tambah")}
                  className="bg-[#e96481] hover:bg-[#d45672] text-white font-bold py-2.5 px-4 sm:py-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center gap-2 transition-colors w-full sm:w-auto text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3} />
                  Tambah Menu
                </button>
              </div>
            </div>
          </div>

          {/* Table Area */}
          <div className="px-4 pb-6 sm:px-6 flex flex-col">
            <div className="bg-white rounded-3xl shadow-md flex flex-col overflow-hidden">
              {/* Table Header / Toolbar */}
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-3 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center shrink-0">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-black">
                  Daftar Menu
                </h2>
                <div className="relative w-full sm:w-auto">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari Menu..."
                    className="bg-[#f0d8df] text-gray-800 pl-11 pr-4 py-2 sm:py-3 rounded-xl w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-500 font-medium text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="md:flex-1 md:overflow-auto px-4 sm:px-6">
                {/* Mobile Cards */}
                <div className="flex flex-col gap-3 md:hidden">
                  {loading ? (
                    <div className="py-4 px-4 text-center font-bold text-gray-500">
                      Memuat data...
                    </div>
                  ) : error ? (
                    <div className="py-4 px-4 text-center font-bold text-red-500">
                      {error}
                    </div>
                  ) : menus.length > 0 ? (
                    menus.map((item, index) => (
                      <div
                        key={item._id}
                        className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[11px] font-semibold text-gray-400">
                              No {index + 1}
                            </p>
                            <p className="text-sm font-bold text-black">
                              {item.nama_produk}
                            </p>
                            <p className="text-[11px] font-semibold text-gray-700">
                              {formatRupiah(item.harga)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(
                                  `/admin/kelola-menu/edit/${item.id || item._id}`,
                                )
                              }
                              className="bg-[#ffe8a1] hover:bg-[#f5d774] p-1.5 rounded-lg text-[#9c7714] transition-colors shadow-sm"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id || item._id)}
                              className="bg-[#e86b6b] hover:bg-[#d65c5c] p-1.5 rounded-lg text-white transition-colors shadow-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 px-4 text-center font-bold text-gray-500">
                      Belum ada data menu.
                    </div>
                  )}
                </div>

                {/* Desktop Table */}
                <table className="hidden md:table w-full text-left border-collapse md:min-w-max">
                  <thead className="bg-[#f2e1ce] sticky top-0 z-10">
                    <tr>
                      <th className="py-3 px-6 font-bold text-black rounded-l-lg">
                        No
                      </th>
                      <th className="py-3 px-6 font-bold text-black">
                        Nama Menu
                      </th>
                      <th className="py-3 px-6 font-bold text-black">Harga</th>
                      <th className="py-3 px-6 font-bold text-black text-center rounded-r-lg">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-4 px-6 text-center font-bold text-gray-500"
                        >
                          Memuat data...
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="py-4 px-6 text-center font-bold text-red-500"
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
                          <td className="py-3 px-6 font-bold text-black">
                            {index + 1}
                          </td>
                          <td className="py-3 px-6 font-bold text-black">
                            {item.nama_produk}
                          </td>
                          <td className="py-3 px-6 font-bold text-black">
                            {formatRupiah(item.harga)}
                          </td>
                          <td className="py-3 px-6">
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
                          colSpan="4"
                          className="py-4 px-6 text-center font-bold text-gray-500"
                        >
                          Belum ada data menu.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-5 sm:px-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center shrink-0">
                <span className="text-gray-400 font-semibold text-sm">
                  Menampilkan {menus.length > 0 ? 1 : 0} - {menus.length} dari{" "}
                  {menus.length} menu
                </span>
                <div className="flex items-center gap-2 text-gray-600 font-bold flex-wrap">
                  <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
                    &lt;
                  </button>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#e4839e] text-white rounded-lg shadow-sm text-sm sm:text-base">
                    1
                  </button>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
                    2
                  </button>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
                    3
                  </button>
                  <span className="px-1 text-gray-400">...</span>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
                    16
                  </button>
                  <button className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-sm sm:text-base">
                    &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarAdmin>
  );
};

export default KelolaMenu;
