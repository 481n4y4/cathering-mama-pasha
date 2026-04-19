import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Jika tidak ada token atau userId, arahkan ke halaman login
  if (!token || !userId) {
    return <Navigate to="/auth" replace />;
  }

  // Jika sudah login, render komponen anak (nested routes)
  return <Outlet />;
}
