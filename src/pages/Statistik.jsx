import React, { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SidebarAdmin from "../components/SidebarAdmin";
import { MenuSquare, ShoppingCart, Wallet } from "lucide-react";
import NavbarProfile from "../components/NavbarProfile";
import { getAdminOrders, getProducts } from "../services/api";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const formatRupiah = (value) => {
  return typeof value === "number"
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : value;
};

const DashboardAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalMenuCount, setTotalMenuCount] = useState(0);
  const [salesPage, setSalesPage] = useState(1);
  const salesPageSize = 10;

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
            : err?.message || "Gagal memuat data statistik.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await getProducts();
        if (response?.success && Array.isArray(response.data)) {
          setTotalMenuCount(response.data.length);
        }
      } catch (err) {
        console.error("Gagal memuat total menu:", err);
      }
    };

    fetchMenus();
  }, []);

  const orders2026 = useMemo(() => {
    return orders.filter((order) => {
      const dateValue = order.createdAt || order.tanggal_pengiriman;
      const date = dateValue ? new Date(dateValue) : null;
      if (!date || Number.isNaN(date.getTime())) return false;
      return date.getFullYear() === 2026;
    });
  }, [orders]);

  const chartData = useMemo(() => {
    const totals = Array.from({ length: 12 }, () => 0);
    orders2026.forEach((order) => {
      const dateValue = order.createdAt || order.tanggal_pengiriman;
      const date = dateValue ? new Date(dateValue) : null;
      if (!date || Number.isNaN(date.getTime())) return;
      const monthIndex = date.getMonth();
      totals[monthIndex] += Number(order.total_harga || 0);
    });
    return MONTH_LABELS.map((label, index) => ({
      name: label,
      value: totals[index],
    }));
  }, [orders2026]);

  const last30DaysSales = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 30);
    return orders
      .map((order) => {
        const dateValue = order.createdAt || order.tanggal_pengiriman;
        const date = dateValue ? new Date(dateValue) : null;
        if (!date || Number.isNaN(date.getTime())) return null;
        return {
          id: order._id,
          date,
          total: Number(order.total_harga || 0),
        };
      })
      .filter((order) => order && order.date >= start && order.date <= now)
      .sort((a, b) => b.date - a.date);
  }, [orders]);

  const totalMenu = totalMenuCount;
  const totalOrders = useMemo(() => orders.length, [orders]);
  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (sum, order) => sum + Number(order.total_harga || 0),
      0,
    );
  }, [orders]);

  const totalSalesPages = Math.max(
    1,
    Math.ceil(last30DaysSales.length / salesPageSize),
  );
  const paginatedSales = last30DaysSales.slice(
    (salesPage - 1) * salesPageSize,
    salesPage * salesPageSize,
  );
  const salesStart =
    last30DaysSales.length === 0
      ? 0
      : (salesPage - 1) * salesPageSize + 1;
  const salesEnd = Math.min(
    salesPage * salesPageSize,
    last30DaysSales.length,
  );

  useEffect(() => {
    if (salesPage > totalSalesPages) {
      setSalesPage(totalSalesPages);
    }
  }, [salesPage, totalSalesPages]);

  const salesPageItems = (() => {
    if (totalSalesPages <= 5) {
      return Array.from({ length: totalSalesPages }, (_, i) => i + 1);
    }
    const items = [1];
    if (salesPage > 3) items.push("ellipsis-left");
    const start = Math.max(2, salesPage - 1);
    const end = Math.min(totalSalesPages - 1, salesPage + 1);
    for (let i = start; i <= end; i += 1) {
      items.push(i);
    }
    if (salesPage < totalSalesPages - 2) items.push("ellipsis-right");
    items.push(totalSalesPages);
    return items;
  })();

  return (
    <SidebarAdmin title="Statistik">
      <main className="flex-1">
        <NavbarProfile backTo="/" />

        <section className="py-5 px-4 sm:px-6 lg:px-10 overflow-auto">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-12 text-gray-900">
            Statistik
          </h1>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-md relative overflow-hidden transition-transform hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Total Menu
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-extrabold text-black">
                  {totalMenu}
                </span>
                <MenuSquare
                  className="w-10 h-10 text-gray-700 absolute bottom-6 right-6"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-md relative overflow-hidden transition-transform hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Total Pesanan
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-4xl sm:text-5xl font-extrabold text-black">
                  {totalOrders}
                </span>
                <ShoppingCart
                  className="w-10 h-10 text-gray-700 absolute bottom-6 right-6"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-md relative overflow-hidden transition-transform hover:scale-[1.02]">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
                Total Pendapatan
              </h3>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Rp. {formatRupiah(totalRevenue)}
                </span>
                <Wallet
                  className="w-10 h-10 text-gray-700 absolute bottom-6 right-6"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="border border-blue-400 bg-[#e8ccd5] bg-opacity-60 rounded-lg p-4 sm:p-6 shadow-sm w-full h-[360px] sm:h-[420px] lg:h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-semibold text-gray-900 ml-2">
                Grafik Pendapatan 2026
              </h3>
              {loading && (
                <span className="text-sm text-gray-500">Memuat...</span>
              )}
            </div>
            {error ? (
              <div className="text-sm text-red-500 font-semibold">
                {error}
              </div>
            ) : (
              <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#cbd5e1"
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#475569" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#475569" }}
                      tickFormatter={formatRupiah}
                      domain={[0, "auto"]}
                      width={80}
                      dx={-10}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `Rp. ${formatRupiah(value)}`,
                        "Pendapatan",
                      ]}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Line
                      type="linear"
                      dataKey="value"
                      stroke="#7879f1"
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        fill: "#fff",
                        stroke: "#7879f1",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Sales Table */}
          <div className="mt-10 bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                Data Penjualan 1 Bulan Terakhir
              </h3>
              <span className="text-xs text-gray-500">
                {last30DaysSales.length} transaksi
              </span>
            </div>
            <div className="overflow-auto">
              <table className="w-full min-w-[420px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-sm text-gray-500">
                    <th className="py-3 pr-4 font-semibold">Tanggal Pesanan</th>
                    <th className="py-3 font-semibold">Jumlah Transaksi</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="py-4 text-sm text-gray-500" colSpan={2}>
                        Memuat data...
                      </td>
                    </tr>
                  ) : last30DaysSales.length === 0 ? (
                    <tr>
                      <td className="py-4 text-sm text-gray-500" colSpan={2}>
                        Belum ada transaksi 1 bulan terakhir.
                      </td>
                    </tr>
                  ) : (
                    paginatedSales.map((row) => (
                      <tr key={row.id} className="border-b border-gray-100">
                        <td className="py-3 pr-4 text-sm text-gray-700">
                          {row.date.toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 text-sm font-semibold text-gray-900">
                          Rp. {formatRupiah(row.total)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <span className="text-gray-400 font-semibold text-sm text-center sm:text-left">
                Menampilkan {salesStart} - {salesEnd} dari {last30DaysSales.length} transaksi
              </span>
              <div className="flex items-center justify-center sm:justify-end gap-2 text-gray-600 font-bold">
                <button
                  type="button"
                  onClick={() => setSalesPage((prev) => Math.max(prev - 1, 1))}
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  disabled={salesPage === 1}
                  aria-label="Sebelumnya"
                >
                  &lt;
                </button>
                {salesPageItems.map((item, index) =>
                  typeof item === "number" ? (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSalesPage(item)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                        salesPage === item
                          ? "bg-[#de6a84] text-white shadow-sm"
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
                    setSalesPage((prev) => Math.min(prev + 1, totalSalesPages))
                  }
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                  disabled={salesPage === totalSalesPages}
                  aria-label="Berikutnya"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </SidebarAdmin>
  );
};

export default DashboardAdmin;
