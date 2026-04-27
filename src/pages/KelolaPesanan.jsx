import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";
import { getAdminOrders, updateOrderStatus } from "../services/api";

const statusOptions = ["Pending", "Diproses", "Dalam Pengiriman", "Selesai"];

const formatTanggal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusColorMap = {
  Pending: "bg-[#fde28a] text-[#85712e]",
  Diproses: "bg-[#fde28a] text-[#85712e]",
  "Dalam Pengiriman": "bg-[#dd696b] text-white",
  Selesai: "bg-[#6cc765] text-white",
};

const KelolaPesanan = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const handleDetail = (order) => {
    navigate(`/admin/kelola-pesanan/${order.id}`, { state: { order } });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAdminOrders();
        setOrders(response?.data || []);
      } catch (err) {
        const message =
          typeof err === "string"
            ? err
            : err?.message || "Gagal memuat pesanan.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const mappedOrders = useMemo(
    () =>
      orders.map((order) => {
        const firstItem = order.items?.[0];
        const product = firstItem?.produk || {};
        return {
          id: order._id,
          nama: order.user?.nama_user || "User",
          tanggal: formatTanggal(order.tanggal_pengiriman || order.createdAt),
          pesanan: `${order.jumlah_produk || 0} ${product.nama_produk || "Pesanan"}`,
          metode: order.metode_pembayaran,
          total: `Rp ${Number(order.total_harga || 0).toLocaleString("id-ID")}`,
          status: order.status,
          statusColor:
            statusColorMap[order.status] || "bg-gray-200 text-gray-700",
        };
      }),
    [orders],
  );

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus({ orderId, status });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status } : order,
        ),
      );
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Gagal memperbarui status.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <SidebarAdmin title="Kelola Pesanan">
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Navbar */}
        <NavbarProfile page="/" />

        {/* Header Title */}
        <div className="px-4 sm:px-6 lg:px-10 py-5 sm:py-6 shrink-0">
          <h1 className="text-2xl sm:text-3xl font-semibold text-black">
            Kelola Pesanan
          </h1>
        </div>

        {/* Table Area */}
        <div className="px-4 sm:px-6 lg:px-10 pb-6 lg:pb-10 flex-1 overflow-hidden flex flex-col">
          <div className="bg-white rounded-3xl shadow-md flex flex-col flex-1 overflow-hidden">
            {/* Toolbar */}
            <div className="p-5 sm:p-6 lg:p-8 pb-4 sm:pb-6 flex flex-col lg:flex-row gap-4 lg:items-center shrink-0">
              <div className="relative flex-1 max-w-2xl w-full">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari Pesanan, Nama, atau No. HP..."
                  className="bg-[#f2e4e6] text-gray-800 pl-11 pr-4 py-3.5 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-500 font-medium"
                />
              </div>
              <div className="relative w-full lg:w-auto lg:ml-auto">
                <select className="bg-[#f2e4e6] w-full lg:w-auto text-black font-semibold py-3.5 pl-6 pr-12 rounded-xl outline-none focus:ring-2 focus:ring-pink-300 appearance-none cursor-pointer">
                  <option>Semua Status</option>
                  <option>Sedang diproses</option>
                  <option>Sedang diantar</option>
                  <option>Selesai</option>
                </select>
                <ChevronDown className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-black pointer-events-none" />
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden px-5 sm:px-6 pb-6 space-y-4">
              {loading ? (
                <div className="text-sm text-gray-500">Memuat pesanan...</div>
              ) : error ? (
                <div className="text-sm text-red-500 font-semibold">
                  {error}
                </div>
              ) : mappedOrders.length === 0 ? (
                <div className="text-sm text-gray-500">Belum ada pesanan.</div>
              ) : (
                mappedOrders.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-pink-1 bg-[#fff7f8] p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold text-black">
                          {item.nama}
                        </p>
                        <p className="text-xs text-gray-500 whitespace-pre-line">
                          {item.tanggal}
                        </p>
                      </div>
                      <span
                        className={`${item.statusColor} py-1.5 px-3 rounded-xl text-xs font-bold inline-block text-center`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div className="mt-3 text-sm font-bold text-black whitespace-pre-line">
                      {item.pesanan}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                      <span>{item.metode === "BRI" ? "BRI" : item.metode}</span>
                      <span className="font-bold text-black">{item.total}</span>
                    </div>
                    <div className="mt-4 flex flex-col gap-2">
                      <select
                        value={item.status}
                        onChange={(event) =>
                          handleStatusChange(item.id, event.target.value)
                        }
                        className="bg-white border border-pink-2 text-sm font-semibold rounded-xl px-3 py-2"
                        disabled={updatingId === item.id}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDetail(item)}
                        className="w-full bg-[#fdeff2] hover:bg-[#fad8df] text-[#de6a84] font-bold py-2.5 rounded-xl transition-colors text-sm"
                      >
                        Detail pesanan
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Table */}
            <div className="hidden lg:block flex-1 overflow-auto px-8 py-2">
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
                  {loading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-10 text-center text-sm text-gray-500"
                      >
                        Memuat pesanan...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-10 text-center text-sm text-red-500 font-semibold"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : mappedOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-10 text-center text-sm text-gray-500"
                      >
                        Belum ada pesanan.
                      </td>
                    </tr>
                  ) : (
                    mappedOrders.map((item, index) => (
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
                          <div className="flex flex-col gap-2 items-center">
                            <select
                              value={item.status}
                              onChange={(event) =>
                                handleStatusChange(item.id, event.target.value)
                              }
                              className="bg-white border border-pink-2 text-sm font-semibold rounded-xl px-3 py-2"
                              disabled={updatingId === item.id}
                            >
                              {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleDetail(item)}
                              className="bg-[#fdeff2] hover:bg-[#fad8df] text-[#de6a84] font-bold py-2 px-4 rounded-xl transition-colors text-sm flex items-center justify-center mx-auto min-w-[140px]"
                            >
                              Detail pesanan
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-5 sm:p-6 px-5 sm:px-8 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shrink-0">
              <span className="text-gray-400 font-semibold text-sm text-center sm:text-left">
                Menampilkan 1 - 3 dari 120 pesanan
              </span>
              <div className="flex items-center justify-center sm:justify-end gap-2 text-gray-600 font-bold">
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
    </SidebarAdmin>
  );
};

export default KelolaPesanan;
