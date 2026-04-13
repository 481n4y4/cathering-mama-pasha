import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
