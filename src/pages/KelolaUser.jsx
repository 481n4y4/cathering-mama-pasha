import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";
import { getAllUsers } from "../services/api";

const KelolaUser = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        if (response.success && response.data) {
          setUsers(response.data);
        } else {
          setError("Gagal memuat data pengguna.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan sistem.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const totalPages = Math.max(1, Math.ceil(users.length / pageSize));
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const pageStart = users.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const pageEnd = Math.min(currentPage * pageSize, users.length);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pageItems = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const items = [1];
    if (currentPage > 3) items.push("ellipsis-left");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i += 1) {
      items.push(i);
    }
    if (currentPage < totalPages - 2) items.push("ellipsis-right");
    items.push(totalPages);
    return items;
  })();

  return (
    <SidebarAdmin title="Kelola User">
      <div className="flex-1 flex flex-col h-screen">
        {/* Navbar */}
        <NavbarProfile backTo="/" />

        {/* Table Area */}
        <div className="px-4 sm:px-6 lg:px-10 pt-3 pb-0 flex flex-col md:flex-1 md:overflow-hidden">
          <div className="bg-white rounded-3xl shadow-md flex flex-col md:flex-1 overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 sm:p-6 lg:p-8 pb-4 sm:pb-6 flex flex-col lg:flex-row gap-3 lg:gap-4 lg:items-center shrink-0">
              <div className="relative flex-1 max-w-2xl w-full">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Nama, atau No. HP..."
                  className="bg-[#f2e4e6] text-gray-800 pl-11 pr-4 py-3.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-500 font-medium"
                />
              </div>
            </div>

            <div className="md:flex-1 md:overflow-auto">
              {/* Mobile Cards */}
              <div className="lg:hidden px-4 sm:px-6 pb-4 space-y-3">
                {loading ? (
                  <div className="py-4 px-4 text-center font-bold text-gray-500">
                    Memuat data...
                  </div>
                ) : error ? (
                  <div className="py-4 px-4 text-center font-bold text-red-500">
                    {error}
                  </div>
                ) : users.length > 0 ? (
                  paginatedUsers.map((item, index) => (
                    <div
                      key={item._id}
                      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-semibold text-gray-400">
                            No {(currentPage - 1) * pageSize + index + 1}
                          </p>
                          <p className="text-sm font-bold text-black">
                            {item.nama_user}
                          </p>
                          <p className="text-[11px] font-semibold text-gray-700">
                            {item.no_telepon
                              ? item.no_telepon.toString().startsWith("0")
                                ? item.no_telepon
                                : `0${item.no_telepon}`
                              : "-"}
                          </p>
                          <p className="text-[11px] text-gray-600 mt-1">
                            {item.alamat || "-"}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/admin/kelola-user/${item._id || item.id}`)
                          }
                          className="bg-[#f5e3e6] hover:bg-[#eabbc3] text-[#d65f7c] font-bold py-2 px-3 rounded-xl transition-colors text-xs"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 px-4 text-center font-bold text-gray-500">
                    Belum ada data pengguna.
                  </div>
                )}
              </div>

              {/* Table */}
              <div className="hidden md:block px-4 sm:px-6 pb-2">
                <table className="hidden md:table w-full text-left border-collapse md:min-w-max">
                <thead className="bg-[#f3e3d2] sticky top-0 z-20">
                  <tr>
                    <th className="py-4 px-6 font-bold text-black rounded-l-lg bg-[#f3e3d2]">
                      No
                    </th>
                    <th className="py-4 px-6 font-bold text-black bg-[#f3e3d2]">
                      Nama
                    </th>
                    <th className="py-4 px-6 font-bold text-black text-center bg-[#f3e3d2]">
                      No HP
                    </th>
                    <th className="py-4 px-6 font-bold text-black bg-[#f3e3d2]">
                      Alamat
                    </th>
                    <th className="py-4 px-6 font-bold text-black text-center rounded-r-lg bg-[#f3e3d2]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 px-6 text-center font-bold text-gray-500"
                      >
                        Memuat data...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 px-6 text-center font-bold text-red-500"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    paginatedUsers.map((item, index) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-6 px-6 font-bold text-black">
                          {(currentPage - 1) * pageSize + index + 1}
                        </td>
                        <td className="py-6 px-6 font-bold text-black">
                          {item.nama_user}
                        </td>
                        <td className="py-6 px-6 font-bold text-black text-center">
                          {item.no_telepon
                            ? item.no_telepon.toString().startsWith("0")
                              ? item.no_telepon
                              : `0${item.no_telepon}`
                            : "-"}
                        </td>
                        <td className="py-6 px-6 font-bold text-black">
                          {item.alamat || "-"}
                        </td>
                        <td className="py-6 px-6 text-center">
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/kelola-user/${item._id || item.id}`,
                              )
                            }
                            className="bg-[#f5e3e6] hover:bg-[#eabbc3] text-[#d65f7c] font-bold py-2.5 px-6 rounded-xl transition-colors text-sm"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-6 px-6 text-center font-bold text-gray-500"
                      >
                        Belum ada data pengguna.
                      </td>
                    </tr>
                  )}
                </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="p-4 sm:p-6 px-4 sm:px-8 border-t border-gray-200 flex flex-col lg:flex-row gap-2 sm:gap-4 lg:gap-0 justify-between items-center shrink-0">
              <div className="text-gray-400 font-semibold text-sm text-center lg:text-left">
                <div>Menampilkan {pageStart} - {pageEnd} dari {users.length} pengguna</div>
                <div className="text-gray-500">Page {currentPage} of {totalPages}</div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 font-bold">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  disabled={currentPage === 1}
                  aria-label="Sebelumnya"
                >
                  &lt;
                </button>
                {pageItems.map((item, index) =>
                  typeof item === "number" ? (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCurrentPage(item)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                        currentPage === item
                          ? "bg-[#e4839e] text-white shadow-sm"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {item}
                    </button>
                  ) : (
                    <span key={`${item}-${index}`} className="px-1 text-gray-400">
                      ...
                    </span>
                  ),
                )}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  aria-label="Berikutnya"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarAdmin>
  );
};

export default KelolaUser;
