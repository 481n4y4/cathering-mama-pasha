import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { getUserById } from "../services/api";
import NavbarProfile from "../components/NavbarProfile";

export default function ProfilSaya({ onNavigate }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      if (path === "beranda") navigate("/");
      else navigate(`/${path}`);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          setError("Silakan login terlebih dahulu");
          setLoading(false);
          return;
        }

        const response = await getUserById(userId);
        if (response.success && response.data) {
          setUserData(response.data);
        } else {
          setError("Gagal mengambil data pengguna");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan sistem");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const infoRows = userData
    ? [
        { label: "Username", value: userData.nama_user || "-" },
        { label: "Email", value: userData.email || "-" },
        {
          label: "Nomor Telepon",
          value: userData.no_telepon ? `0${userData.no_telepon}` : "-",
        },
        { label: "Alamat", value: userData.alamat || "-" },
      ]
    : [];

  return (
    <Sidebar
      activeMenu="profil-saya"
      onNavigate={handleNavigate}
      title="Profil Saya"
      onBack={() => handleNavigate("beranda")}
    >

      <NavbarProfile page="/"/>

      {/* ── Konten ── */}
      <div className="px-4 lg:px-8 py-6">
        {/* Kartu profil — warna pink muda sesuai Figma */}
        <div
          className="rounded-2xl p-6 lg:p-8 max-w-lg w-full min-h-75"
          style={{ background: "#FCC7D1" }}
        >
          <h2 className="text-xl lg:text-2xl font-extrabold text-text-dark mb-1">
            Profil Saya
          </h2>
          <p className="text-xs text-text-mid mb-6 leading-relaxed">
            Kelola informasi profil Anda untuk mengontrol, melindungi dan
            mengamankan akun
          </p>

          {loading ? (
            <p className="text-sm font-semibold text-text-mid animate-pulse">
              Memuat profil...
            </p>
          ) : error ? (
            <p className="text-sm text-red-500 font-semibold">{error}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {infoRows.map(({ label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  {/* Label — rata kanan, lebar tetap */}
                  <span
                    className="text-sm text-text-mid shrink-0 text-right"
                    style={{ width: 110 }}
                  >
                    {label}
                  </span>
                  {/* Nilai */}
                  <span className="text-sm font-semibold text-text-dark">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Sidebar>
  );
}
