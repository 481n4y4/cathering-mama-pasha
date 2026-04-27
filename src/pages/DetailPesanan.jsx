import React, { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";

const STATUS_OPTIONS = [
  "Sedang diproses",
  "Dalam pengiriman",
  "Selesai",
];

export default function DetailPesanan() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const order = useMemo(() => {
    if (state?.order) return state.order;
    return {
      id,
      nama: "-",
      tanggal: "-",
      pesanan: "-",
      metode: "-",
      total: "-",
      status: "Sedang diproses",
    };
  }, [id, state]);

  const initialStatus =
    order.status === "Sedang diantar"
      ? "Dalam pengiriman"
      : order.status || "Sedang diproses";
  const [status, setStatus] = useState(initialStatus);

  return (
    <SidebarAdmin title="Detail Pesanan">
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <NavbarProfile page="/admin/kelola-pesanan" />

        <div className="px-4 sm:px-6 lg:px-10 py-5 sm:py-6 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-semibold text-black">
              Detail Pesanan
            </h1>
            <button
              onClick={() => navigate("/admin/kelola-pesanan")}
              className="bg-[#fdeff2] hover:bg-[#fad8df] text-[#de6a84] font-bold py-2 px-5 rounded-xl transition-colors text-sm"
            >
              Kembali
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-10 pb-8 lg:pb-10 flex-1 overflow-auto">
          <div className="bg-white rounded-3xl shadow-md p-5 sm:p-6 lg:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Order ID
                  </p>
                  <p className="text-xl font-extrabold text-black">{order.id}</p>
                  <p className="text-sm text-gray-500 mt-1">{order.tanggal}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                      Status Pesanan
                    </p>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="bg-[#f2e4e6] w-full md:w-auto text-black font-semibold py-2.5 pl-4 pr-10 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 appearance-none cursor-pointer"
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#f9f1f2] rounded-2xl p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-black mb-4">
                    Informasi Pemesan
                  </h2>
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Nama</span>
                      <span className="font-bold text-black">{order.nama}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Metode Pembayaran</span>
                      <span className="font-bold text-black">{order.metode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Total</span>
                      <span className="font-bold text-black">{order.total}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f9f1f2] rounded-2xl p-5 sm:p-6">
                  <h2 className="text-lg font-bold text-black mb-4">
                    Rincian Pesanan
                  </h2>
                  <div className="text-sm text-black whitespace-pre-line leading-relaxed font-bold">
                    {order.pesanan}
                  </div>
                </div>
              </div>

              <div className="bg-[#f9f1f2] rounded-2xl p-5 sm:p-6">
                <h2 className="text-lg font-bold text-black mb-4">
                  Catatan Admin
                </h2>
                <textarea
                  rows={4}
                  className="w-full bg-white rounded-xl border border-pink-1 p-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-pink-300"
                  placeholder="Tambahkan catatan internal untuk pesanan ini..."
                />
              </div>

              <div className="flex justify-center sm:justify-end">
                <button className="w-full sm:w-auto bg-[#de6a84] hover:bg-[#c85a74] text-white font-bold py-3 px-6 rounded-xl transition-colors text-sm">
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </SidebarAdmin>
  );
}
