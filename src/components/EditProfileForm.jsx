import logoMamaPasha from "../assets/images/logo-kecil.webp";

export default function EditProfileForm({
  userData,
  editForm,
  setEditForm,
  editLoading,
  editMsg,
  onClose,
  onSave,
}) {
  const photoPreview =
    editForm.foto_profile || userData?.foto_profile || logoMamaPasha;

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditForm((prev) => ({ ...prev, foto_profile: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <form
      onSubmit={onSave}
      className="grid gap-5"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
          <img
            src={photoPreview}
            alt="Foto Profil"
            className="w-full h-full object-cover"
          />
        </div>
        <label
          htmlFor="profilePhoto"
          className="cursor-pointer px-4 py-2 rounded-full bg-pink-6 text-white text-sm font-bold shadow-sm hover:bg-pink-5 transition-all"
        >
          📸 Ubah Foto Profil
        </label>
        <input
          id="profilePhoto"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoChange}
          disabled={editLoading}
        />
      </div>

      {editMsg.text && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-2xl text-sm font-semibold ${
            editMsg.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {editMsg.text}
        </div>
      )}

      <div className="grid gap-3">
        <div>
          <label className="text-[10px] font-bold text-[#E47990] uppercase tracking-wide block mb-1">
            👤 Nama Lengkap
          </label>
          <input
            type="text"
            value={editForm.nama_user}
            onChange={handleChange("nama_user")}
            className="w-full px-4 py-3 rounded-2xl bg-white/50 text-[#B8445E] font-semibold text-sm placeholder-[#E47990] focus:outline-none focus:ring-2 focus:ring-[#B8445E]/40 transition-all"
            placeholder="Nama lengkap"
            required
            disabled={editLoading}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#E47990] uppercase tracking-wide block mb-1">
            ✉️ Email
          </label>
          <input
            type="email"
            value={editForm.email}
            onChange={handleChange("email")}
            className="w-full px-4 py-3 rounded-2xl bg-white/50 text-[#B8445E] font-semibold text-sm placeholder-[#E47990] focus:outline-none focus:ring-2 focus:ring-[#B8445E]/40 transition-all"
            placeholder="Email"
            required
            disabled={editLoading}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#E47990] uppercase tracking-wide block mb-1">
            📞 Nomor Telepon
          </label>
          <input
            type="tel"
            value={editForm.no_telepon}
            onChange={handleChange("no_telepon")}
            className="w-full px-4 py-3 rounded-2xl bg-white/50 text-[#B8445E] font-semibold text-sm placeholder-[#E47990] focus:outline-none focus:ring-2 focus:ring-[#B8445E]/40 transition-all"
            placeholder="Nomor telepon"
            pattern="[0-9]{10,13}"
            title="10–13 digit angka"
            disabled={editLoading}
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-[#E47990] uppercase tracking-wide block mb-1">
            📍 Alamat
          </label>
          <textarea
            value={editForm.alamat}
            onChange={handleChange("alamat")}
            rows={3}
            className="w-full px-4 py-3 rounded-2xl bg-white/50 text-[#B8445E] font-semibold text-sm placeholder-[#E47990] focus:outline-none focus:ring-2 focus:ring-[#B8445E]/40 transition-all resize-none"
            placeholder="Alamat lengkap"
            disabled={editLoading}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-full font-bold text-[#B8445E] text-sm bg-white/50 hover:bg-white/70 transition-all"
          disabled={editLoading}
        >
          Batal
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-full font-bold text-white text-sm shadow-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-60"
          style={{ background: "linear-gradient(90deg, #B8445E, #E47990)" }}
          disabled={editLoading}
        >
          {editLoading ? "Menyimpan..." : "💾 Simpan"}
        </button>
      </div>
    </form>
  );
}
