import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilLayout from "../components/ProfilLayout";
import EditProfileForm from "../components/EditProfileForm";
import { getUserById } from "../services/api";
import iconBack from "../assets/images/icon-back.webp";
import logoMamaPasha from "../assets/images/logo-kecil.webp";

export default function ProfilSaya({ onNavigate }) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ── State popup edit ──
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    nama_user: "",
    email: "",
    no_telepon: "",
    alamat: "",
    foto_profile: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editMsg, setEditMsg] = useState({ type: "", text: "" });

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      if (path === "beranda") navigate("/");
      else if (path === "profil-saya") {
        navigate("/profil");
      } else {
        navigate(`/${path}`);
      }
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const cachedUser = localStorage.getItem("user");
        if (cachedUser) {
          const parsed = JSON.parse(cachedUser);
          setUserData(parsed);
          setEditForm({
            nama_user: parsed.nama_user || "",
            email: parsed.email || "",
            no_telepon: parsed.no_telepon ? String(parsed.no_telepon) : "",
            alamat: parsed.alamat || "",
            foto_profile: parsed.foto_profile || parsed.photo || "",
          });
          setLoading(false);
          return;
        }

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
          setEditForm({
            nama_user: response.data.nama_user || "",
            email: response.data.email || "",
            no_telepon: response.data.no_telepon ? String(response.data.no_telepon) : "",
            alamat: response.data.alamat || "",
            foto_profile: response.data.foto_profile || response.data.photo || "",
          });
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

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const profilePhoto = userData?.foto_profile || userData?.photo || logoMamaPasha;

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditMsg({ type: "", text: "" });
    try {
      const updated = { ...userData, ...editForm };
      setUserData(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setEditMsg({ type: "success", text: "Profil berhasil diperbarui! ✅" });
      setTimeout(() => {
        setShowEdit(false);
        setEditMsg({ type: "", text: "" });
      }, 1200);
    } catch (err) {
      setEditMsg({ type: "error", text: "Gagal menyimpan. Coba lagi." });
    } finally {
      setEditLoading(false);
    }
  };

  // Baris info sesuai desain UI/UX
  const usernameValue = userData?.username || userData?.nama_user || "-";
  const infoRows = userData
    ? [
        { label: "Username",      value: usernameValue },
        { label: "Nama",          value: userData.nama_user || "-" },
        { label: "Email",         value: userData.email || "-" },
        {
          label: "Nomor Telepon",
          value: userData.no_telepon ? `(+62) ${String(userData.no_telepon).replace(/^0/, "")}` : "-",
        },
        { label: "Jenis Kelamin", value: userData.jenis_kelamin || "-" },
        { label: "Tanggal lahir", value: userData.tanggal_lahir || "-" },
      ]
    : [];

  return (
    <ProfilLayout
      activeMenu="profil-saya"
      onNavigate={handleNavigate}
      title="Profil Saya"
      onBack={() => handleNavigate("beranda")}
    >
      {/* ══ Top bar DESKTOP ══ */}
      <div className="hidden lg:flex items-center gap-3 px-8 py-5 shadow-md shadow-pink-800/20">
        <button
          onClick={() => handleNavigate("beranda")}
          className="text-[#B8445E] font-bold text-xl hover:opacity-70 transition-opacity flex items-center justify-center w-10 h-10 rounded-full"
        >
          <img src={iconBack} alt="Back" className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-extrabold text-text-dark">Profil Saya</h1>

        {/* Tombol search kanan atas */}
      </div>

      {/* ══════════════════════════════════
          WRAPPER KONTEN
      ══════════════════════════════════ */}
      <div className="px-4 py-6 lg:px-8 lg:py-8">

        {/* ── SKELETON ── */}
        {loading && (
          <div
            className="rounded-3xl p-6 lg:p-8 animate-pulse w-full max-w-2xl"
            style={{ background: "#FCC7D1" }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex gap-8 mb-4 items-center">
                <div className="w-28 h-3  bg-pink-300 shrink-0" />
                <div className="w-40 h-4  bg-pink-200" />
              </div>
            ))}
          </div>
        )}

        {/* ── ERROR ── */}
        {!loading && error && (
          <div
            className="rounded-3xl p-6 text-center w-full max-w-sm"
            style={{ background: "#FCC7D1" }}
          >
            <p className="text-4xl mb-3">😕</p>
            <p className="text-sm text-red-500 font-semibold">{error}</p>
            <button
              onClick={() => handleNavigate("beranda")}
              className="mt-4 px-6 py-2 bg-[#B8445E] text-white rounded-full text-sm font-bold hover:bg-[#E47990] transition-all"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}

        {/* ── KONTEN UTAMA ── */}
        {!loading && !error && (
          <>
            {/* ════════ MOBILE ════════ */}
            <div className="lg:hidden w-full rounded-4xl border border-white/50 bg-white/75 p-6 shadow-card backdrop-blur-sm">
              <div className="flex flex-col items-center mb-6 gap-3">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={profilePhoto}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-base font-extrabold text-[#B8445E]">
                    {userData?.nama_user || "-"}
                  </p>
                  <p className="text-xs text-[#E47990] mt-0.5">{userData?.email || "-"}</p>
                </div>
              </div>

              <div className="h-px mb-5 bg-[#B8445E]/20" />

              <h2 className="text-base font-extrabold text-[#B8445E] mb-1">Profil Saya</h2>
              <p className="text-xs text-[#B8445E]/70 mb-5 leading-relaxed">
                Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun
              </p>

              <div className="grid gap-4">
                {infoRows.map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-[110px_1px_minmax(0,1fr)] items-center gap-4">
                    <span className="text-sm text-[#B8445E]/70 font-semibold text-right">
                      {label}
                    </span>
                    <div className="w-px h-6 bg-[#B8445E]/20" />
                    <span className="text-sm font-bold text-[#B8445E]">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowEdit(true)}
                className="mt-6 w-full py-3.5 rounded-full font-bold text-white text-sm shadow transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(90deg, #B8445E, #E47990)" }}
              >
                ✏️ Edit Profil
              </button>
            </div>

            {/* ════════ DESKTOP ════════ */}
            {/* Sesuai desain: panel konten di kanan Sidebar, card dengan judul + label-value */}
            <div className="hidden lg:block">
              <div className="max-w-3xl mx-auto">
                <div className="rounded-4xl border border-white/50 bg-white/80 p-10 shadow-card backdrop-blur-sm">
                  <div className="mb-8">
                    <h2 className="text-3xl font-extrabold text-[#B8445E] mb-2">Profil Saya</h2>
                    <p className="text-sm text-[#B8445E]/70 leading-relaxed">
                      Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun
                    </p>
                  </div>

                  <div className="grid gap-5">
                    {infoRows.map(({ label, value }) => (
                      <div key={label} className="grid grid-cols-[140px_1px_minmax(0,1fr)] items-center gap-6">
                        <span className="text-sm font-semibold text-[#B8445E]/70 text-right">
                          {label}
                        </span>
                        <div className="h-6 w-px bg-[#B8445E]/15" />
                        <span className="text-sm font-bold text-[#B8445E]">{value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowEdit(true)}
                    className="mt-10 px-8 py-3 rounded-full font-bold text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
                    style={{ background: "linear-gradient(90deg, #B8445E, #E47990)" }}
                  >
                    ✏️ Edit Profil
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ════════════════════════════════════════
          POPUP EDIT PROFIL
      ════════════════════════════════════════ */}
      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-start lg:items-center justify-center p-4 overflow-y-auto"
          style={{ background: "rgba(184,68,94,0.35)", backdropFilter: "blur(6px)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowEdit(false); }}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{ background: "#FCC7D1" }}
          >
            <div className="px-6 py-6">

              {/* Header popup */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-extrabold text-[#B8445E] uppercase tracking-widest mb-0.5">
                    Edit Profil
                  </p>
                  <h2 className="text-lg font-extrabold text-[#B8445E]">
                    Perbarui Informasi
                  </h2>
                </div>
                <button
                  onClick={() => setShowEdit(false)}
                  className="w-9 h-9 rounded-full bg-white/40 hover:bg-white/70 flex items-center justify-center text-[#B8445E] font-bold text-lg transition-all"
                >
                  ✕
                </button>
              </div>

              <EditProfileForm
                userData={userData}
                editForm={editForm}
                setEditForm={setEditForm}
                editLoading={editLoading}
                editMsg={editMsg}
                onClose={() => setShowEdit(false)}
                onSave={handleSaveEdit}
              />
            </div>
          </div>
        </div>
      )}

    </ProfilLayout>
  );
}