import React from "react";
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

const data = [
  { name: "Jan", value: 200000 },
  { name: "Feb", value: 180000 },
  { name: "Mar", value: 230000 },
  { name: "Apr", value: 275000 },
  { name: "Mei", value: 255000 },
  { name: "Jun", value: 320000 },
  { name: "Jul", value: 365000 },
  { name: "Agu", value: 335000 },
  { name: "Sep", value: 380000 },
  { name: "Okt", value: 410000 },
  { name: "Nov", value: 450000 },
  { name: "Des", value: 500000 },
];

const formatRupiah = (value) => {
  return typeof value === "number"
    ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    : value;
};

const DashboardAdmin = () => {
  return (
    <SidebarAdmin title="Statistik">
      <main className="flex-1">
        <NavbarProfile page="/" />

        <section className="py-5 px-10 overflow-auto">
          <h1 className="text-3xl font-semibold mb-12 text-gray-900">
            Statistik
          </h1>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden transition-transform hover:scale-[1.02]">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Total Menu
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-5xl font-extrabold text-black">80</span>
                <MenuSquare
                  className="w-10 h-10 text-gray-700 absolute bottom-6 right-6"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden transition-transform hover:scale-[1.02]">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Total Pesanan
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-5xl font-extrabold text-black">60</span>
                <ShoppingCart
                  className="w-10 h-10 text-gray-700 absolute bottom-6 right-6"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden transition-transform hover:scale-[1.02]">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Total Pendapatan
              </h3>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-3xl font-bold text-gray-900">
                  Rp. 3.930.000
                </span>
                <Wallet
                  className="w-10 h-10 text-gray-700 absolute bottom-6 right-6"
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="border border-blue-400 bg-[#e8ccd5] bg-opacity-60 rounded-lg p-6 shadow-sm w-full h-[500px] flex flex-col">
            <h3 className="text-2xl font-semibold text-gray-900 mb-8 ml-2">
              Grafik Pendapatan 2025
            </h3>
            <div className="flex-1 w-full min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
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
                    domain={[100000, "auto"]}
                    ticks={[100000, 200000, 300000, 400000, 500000]}
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
          </div>
        </section>
      </main>
    </SidebarAdmin>
  );
};

export default DashboardAdmin;
