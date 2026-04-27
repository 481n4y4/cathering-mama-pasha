import { useMemo, useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";
import EditProfileForm from "../components/EditProfileForm";

const fieldRow = (label, value) => (
  <div className="flex items-center justify-between py-2 border-b border-pink-100 last:border-b-0">
    <span className="text-sm text-[#B8445E]/70 font-semibold">{label}</span>
    <span className="text-sm font-bold text-[#B8445E]">{value}</span>
  </div>
);

export default function ProfilAdmin() {
  const [showEdit, setShowEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editMsg, setEditMsg] = useState({ type: "", text: "" });

  const userData = useMemo(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }, []);

  const [editForm, setEditForm] = useState({
    nama_user: userData?.nama_user || userData?.nama || "",
    email: userData?.email || "",
    no_telepon: userData?.no_telepon ? String(userData.no_telepon) : "",
    alamat: userData?.alamat || "",
    foto_profile: userData?.foto_profile || userData?.photo || "",
  });

  const nama = userData?.nama_user || userData?.nama || "Admin";
  const email = userData?.email || "-";
  const telepon = userData?.no_telepon
    ? userData.no_telepon.toString().startsWith("0")
      ? userData.no_telepon
      : `0${userData.no_telepon}`
    : "-";
  const alamat = userData?.alamat || "-";
  const role = userData?.role || "admin";

  const handleSaveEdit = async (event) => {
    event.preventDefault();
    setEditLoading(true);
    setEditMsg({ type: "", text: "" });
    try {
      const updated = { ...userData, ...editForm };
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

  return (
    <SidebarAdmin title="Profil Admin">
      <main className="flex-1">
        <NavbarProfile page="/admin/statistik" />

        <section className="py-5 px-10">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-lg font-extrabold text-[#B8445E] mb-4">
              Informasi Akun
            </h2>
            {fieldRow("Nama", nama)}
            {fieldRow("Email", email)}
            {fieldRow("No. Telepon", telepon)}
            {fieldRow("Alamat", alamat)}
            {fieldRow("Role", role)}

            <button
              onClick={() => setShowEdit(true)}
              className="mt-6 px-6 py-3 rounded-full font-bold text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "linear-gradient(90deg, #B8445E, #E47990)" }}
            >
              ✏️ Edit Profil
            </button>
          </div>
        </section>
      </main>

      {showEdit && (
        <div
          className="fixed inset-0 z-50 flex items-start lg:items-center justify-center p-4 overflow-y-auto"
          style={{
            background: "rgba(184,68,94,0.35)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEdit(false);
          }}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{ background: "#FCC7D1" }}
          >
            <div className="px-6 py-6">
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
    </SidebarAdmin>
  );
}
