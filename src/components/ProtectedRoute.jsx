import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const rawUser = localStorage.getItem("user");
  const userData = rawUser
    ? (() => {
        try {
          return JSON.parse(rawUser);
        } catch {
          return null;
        }
      })()
    : null;
  const role = userData?.role || "user";

  // Jika tidak ada token atau userId, arahkan ke halaman login
  if (!token || !userId) {
    return <Navigate to="/auth" replace />;
  }

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserRoute =
    location.pathname.startsWith("/profil") ||
    location.pathname.startsWith("/pesanan-saya") ||
    location.pathname.startsWith("/keranjang") ||
    location.pathname.startsWith("/notifikasi") ||
    location.pathname.startsWith("/buat-pesanan");

  if (isAdminRoute && role !== "admin") {
    return <Navigate to="/profil" replace />;
  }

  if (isUserRoute && role === "admin") {
    return <Navigate to="/admin/statistik" replace />;
  }

  // Jika sudah login, render komponen anak (nested routes)
  return <Outlet />;
}
