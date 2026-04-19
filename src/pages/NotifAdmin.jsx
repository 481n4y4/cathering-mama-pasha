import React, { useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";
import { FileText, Truck, Frown, Check, MoreHorizontal } from "lucide-react";

const notifData = [
  {
    id: 1,
    title: "Ada yang pesan Risol Mayonaise nih",
    desc: "Segera siapkan pesanan ini yuk!",
    time: "Baru saja",
    iconBg: "bg-[#4da9f6]", // Biru
    Icon: FileText,
  },
  {
    id: 2,
    title: "Driver sedang dalam perjalanan",
    desc: "75 Sosis Solo sedang diantarkan menuju alamat pembeli",
    time: "15 menit lalu",
    iconBg: "bg-[#f6c352]", // Kuning
    Icon: Truck,
  },
  {
    id: 3,
    title: "Pesanan Telah Dibatalkan",
    desc: "60 Dadar Gulung dibatalkan oleh pembeli",
    time: "Kemarin",
    iconBg: "bg-[#c94b4b]", // Merah
    Icon: Frown,
  },
  {
    id: 4,
    title: "Pesanan Selesai",
    desc: "100 Tahu Bakso sudah sampai ditujuan dan diterima oleh pembeli",
    time: "2 hari lalu",
    iconBg: "bg-[#6bb66b]", // Hijau
    Icon: Check,
  },
];

const NotifAdmin = () => {
  const [activeTab, setActiveTab] = useState("Semua");

  return (
    <div className="flex bg-[#f7c7cd] min-h-screen font-sans">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <NavbarProfile page="/"/>

        {/* Header Title */}
        <div className="px-10 mt-4 shrink-0 flex items-center">
          <h1 className="text-3xl font-semibold text-black">Notifikasi</h1>
        </div>

        {/* Tabs */}
        <div className="px-10 mt-8 mb-6 flex gap-4">
          <button
            onClick={() => setActiveTab("Semua")}
            className={`px-8 py-2.5 rounded-3xl font-bold text-lg transition-colors ${
              activeTab === "Semua"
                ? "bg-[#dfa0af] text-[#71162f]"
                : "text-black hover:bg-[#dfa0af]/50"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveTab("Belum dibaca")}
            className={`px-8 py-2.5 rounded-3xl font-bold text-lg transition-colors ${
              activeTab === "Belum dibaca"
                ? "bg-[#dfa0af] text-[#71162f]"
                : "text-gray-900 hover:bg-[#dfa0af]/50"
            }`}
          >
            Belum dibaca
          </button>
        </div>

        {/* Notifications List */}
        <div className="px-10 pb-10 flex-1 overflow-auto flex flex-col gap-5">
          {notifData.map((notif) => (
            <div
              key={notif.id}
              className="bg-[#f4d8de] rounded-3xl p-6 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm border border-white/40 relative hover:bg-[#eed0d5] transition-colors"
            >
              {/* Icon Wrap */}
              <div
                className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center mt-3 sm:mt-0 ${notif.iconBg} shadow-sm border border-white/20`}
              >
                <notif.Icon className="w-8 h-8 text-black" strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="flex-1 mt-2 sm:mt-0">
                <h3 className="text-xl font-bold text-black mb-1.5">
                  {notif.title}
                </h3>
                <p className="text-gray-800 font-medium text-[15px]">
                  {notif.desc}
                </p>
              </div>

              {/* Time */}
              <div className="absolute sm:relative top-6 right-6 sm:top-auto sm:right-auto self-start">
                <span className="text-gray-700 font-medium text-sm">
                  {notif.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default NotifAdmin;
