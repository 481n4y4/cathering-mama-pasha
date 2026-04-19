import React from "react";
import { Search, ChevronDown } from "lucide-react";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";

const pesananData = [
  {
    id: 1,
    nama: "Jeno",
    tanggal: "Sabtu,\n25 Apr 2026",
    pesanan: "60 Risoles\nMayonaise",
    metode: "QRIS",
    total: "Rp 150.000",
    status: "Sedang diproses",
    statusColor: "bg-[#fde28a] text-[#85712e]", // Kuning
  },
  {
    id: 2,
    nama: "Haikal",
    tanggal: "Rabu,\n15 Apr 2026",
    pesanan: "75 Sosis Solo",
    metode: "QRIS",
    total: "Rp 112.000",
    status: "Sedang diantar",
    statusColor: "bg-[#dd696b] text-white", // Merah
  },
  {
    id: 3,
    nama: "Jamal",
    tanggal: "Rabu,\n15 Apr 2026",
    pesanan: "100 Tahu Bakso",
    metode: "BRI",
    total: "Rp 250.000",
    status: "Selesai",
    statusColor: "bg-[#6cc765] text-white", // Hijau
  },
];

const KelolaPesanan = () => {
  return (
    <div className="flex bg-[#f7c7cd] min-h-screen font-sans">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <NavbarProfile page="/" />

        {/* Header Title */}
        <div className="px-10 py-6 shrink-0">
          <h1 className="text-3xl font-semibold text-black">Kelola Pesanan</h1>
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
                  placeholder="Cari Pesanan, Nama, atau No. HP..."
                  className="bg-[#f2e4e6] text-gray-800 pl-11 pr-4 py-3.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-500 font-medium"
                />
              </div>
              <div className="relative ml-auto">
                <select className="bg-[#f2e4e6] text-black font-semibold py-3.5 pl-6 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 appearance-none cursor-pointer">
                  <option>Semua Status</option>
                  <option>Sedang diproses</option>
                  <option>Sedang diantar</option>
                  <option>Selesai</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto px-8 py-2">
              <table className="w-full text-left border-collapse min-w-max">
                <thead className="bg-[#f3e3d2] sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="py-5 px-6 font-bold text-black rounded-l-lg whitespace-nowrap">
                      No
                    </th>
                    <th className="py-5 px-6 font-bold text-black whitespace-nowrap">
                      Nama
                    </th>
                    <th className="py-5 px-6 font-bold text-black whitespace-nowrap">
                      Tanggal
                    </th>
                    <th className="py-5 px-6 font-bold text-black whitespace-nowrap">
                      Pesanan
                    </th>
                    <th className="py-5 px-6 font-bold text-black text-center whitespace-nowrap">
                      Metode
                      <br />
                      Pembayaran
                    </th>
                    <th className="py-5 px-6 font-bold text-black whitespace-nowrap">
                      Total
                    </th>
                    <th className="py-5 px-6 font-bold text-black text-center whitespace-nowrap">
                      Status
                    </th>
                    <th className="py-5 px-6 font-bold text-black text-center rounded-r-lg whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pesananData.map((item, index) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-200 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-6 px-6 font-bold text-black align-middle">
                        {index + 1}
                      </td>
                      <td className="py-6 px-6 font-bold text-black align-middle">
                        {item.nama}
                      </td>
                      <td className="py-6 px-6 font-bold text-black align-middle whitespace-pre-line leading-relaxed">
                        {item.tanggal}
                      </td>
                      <td className="py-6 px-6 font-bold text-black align-middle whitespace-pre-line leading-relaxed">
                        {item.pesanan}
                      </td>
                      <td className="py-6 px-6 font-bold text-black text-center align-middle">
                        {item.metode === "BRI" ? (
                          <span className="text-[#0f54a8] text-xl font-extrabold tracking-tighter flex items-center justify-center gap-1">
                            <span className="text-xl">◨</span>BRI
                          </span>
                        ) : (
                          item.metode
                        )}
                      </td>
                      <td className="py-6 px-6 font-bold text-black align-middle whitespace-nowrap">
                        {item.total}
                      </td>
                      <td className="py-6 px-6 text-center align-middle">
                        <span
                          className={`${item.statusColor} py-2 px-4 rounded-xl text-sm font-bold inline-block min-w-[120px] text-center`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-6 px-6 text-center align-middle">
                        <button className="bg-[#fdeff2] hover:bg-[#fad8df] text-[#de6a84] font-bold py-2 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-1 mx-auto min-w-[120px]">
                          Ubah Status <ChevronDown className="w-4 h-4 ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 px-8 border-t border-gray-200 flex justify-between items-center shrink-0">
              <span className="text-gray-400 font-semibold text-sm">
                Menampilkan 1 - 3 dari 120 pesanan
              </span>
              <div className="flex items-center gap-2 text-gray-600 font-bold">
                <button className="w-8 h-8 flex items-center justify-center bg-[#de6a84] text-white rounded-lg shadow-sm">
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
                  40
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

export default KelolaPesanan;
