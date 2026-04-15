import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DetailProduk from "./pages/DetailProduk.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/produk/:id" element={<DetailProduk />} />
      </Routes>
    </BrowserRouter>
  );
}
