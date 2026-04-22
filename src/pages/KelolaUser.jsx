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

  return (
    <SidebarAdmin title="Kelola User">
      <div className="flex-1 flex flex-col h-screen">
        {/* Navbar */}
        <NavbarProfile page="/" />

        {/* Header Title */}
        <div className="px-10 py-6 shrink-0">
          <h1 className="text-3xl font-semibold text-black">Kelola User</h1>
        </div>

        {/* Table Area */}
        <div className="px-10 pb-10 flex-1 overflow-hidden flex flex-col">
          <div className="bg-white rounded-3xl shadow-md flex flex-col flex-1 overflow-hidden">
            {/* Toolbar */}
            <div className="p-8 pb-6 flex gap-4 items-center shrink-0">
              <div className="relative flex-1 max-w-2xl">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Nama, atau No. HP..."
                  className="bg-[#f2e4e6] text-gray-800 pl-11 pr-4 py-3.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-500 font-medium"
                />
              </div>
              <select className="bg-[#f2e4e6] text-black font-semibold py-3.5 px-6 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 appearance-none ml-auto cursor-pointer">
                <option>Semua Pengguna</option>
              </select>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto px-8 pb-2">
              <table className="w-full text-left border-collapse min-w-max">
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
                    users.map((item, index) => (
                      <tr
                        key={item._id}
                        className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-6 px-6 font-bold text-black">
                          {index + 1}
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

            {/* Pagination */}
            <div className="p-6 px-8 border-t border-gray-200 flex justify-between items-center shrink-0">
              <span className="text-gray-400 font-semibold text-sm">
                Menampilkan {users.length > 0 ? 1 : 0} - {users.length} dari{" "}
                {users.length} pengguna
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
                  50
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors">
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
