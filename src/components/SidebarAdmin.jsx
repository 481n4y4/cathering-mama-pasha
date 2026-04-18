import React from "react";
import { NavLink } from "react-router-dom";
import { Home, List, Users, ShoppingCart, Bell } from "lucide-react";

const SidebarAdmin = () => {
  return (
    <div className="w-[280px] min-h-screen bg-[#f8c5c9] flex flex-col items-center py-10 shadow-lg shrink-0">
      {/* Profile Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 mb-4 shadow-sm">
          {/* Default placeholder, you can replace with the actual image */}
          <img
            src="https://i.pravatar.cc/150?img=47"
            alt="Admin Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold font-serif text-gray-900">Admin</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col w-full px-6 gap-6 text-gray-800 font-semibold mb-auto">
        <NavLink
          to="/admin/dashboard"
          className="flex items-center gap-4 text-lg hover:text-black transition-colors text-black"
        >
          <Home className="w-6 h-6" strokeWidth={2.5} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/kelola-menu"
          className="flex items-center gap-4 text-lg hover:text-black transition-colors text-black"
        >
          <List className="w-6 h-6" strokeWidth={2.5} />
          Kelola Menu
        </NavLink>

        <NavLink
          to="/admin/kelola-user"
          className="flex items-center gap-4 text-lg hover:text-black transition-colors text-black"
        >
          <Users className="w-6 h-6" strokeWidth={2.5} />
          Kelola User
        </NavLink>

        <NavLink
          to="/admin/kelola-pesanan"
          className="flex items-center gap-4 text-lg hover:text-black transition-colors text-black"
        >
          <ShoppingCart className="w-6 h-6" strokeWidth={2.5} />
          Kelola Pesanan
        </NavLink>

        <NavLink
          to="/admin/notifikasi"
          className="flex items-center gap-4 text-lg hover:text-black transition-colors text-black"
        >
          <Bell className="w-6 h-6" strokeWidth={2.5} />
          Notifikasi
        </NavLink>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
