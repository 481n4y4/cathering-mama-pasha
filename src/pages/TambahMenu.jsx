import React, { useState } from "react";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";
import { createProduct } from "../services/api";

const TambahMenu = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nama_produk: "",
    harga: "",
    kategori: "Makanan",
    image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const submitData = new FormData();
      submitData.append("nama_produk", formData.nama_produk);
      submitData.append("harga", Number(formData.harga));
      submitData.append("kategori", formData.kategori);
      submitData.append("image", formData.image);

      await createProduct(submitData);
      setSuccess(true);
      setTimeout(() => navigate("/admin/kelola-menu"), 2000);
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Gagal menambahkan menu. Periksa kembali data atau koneksi Anda.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarAdmin title="Tambah Menu">
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <NavbarProfile page="/admin/kelola-menu" />

        <div className="p-10 flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-8">
            <div className="flex items-center gap-4 border-b pb-6 mb-8">
              <button
                onClick={() => navigate("/admin/kelola-menu")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-3xl font-bold text-gray-800">Tambah Menu</h2>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                Menu berhasil ditambahkan! Mengalihkan...
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload Area */}
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="font-semibold text-gray-700">
                    Foto Produk
                  </label>
                  <label className="border-2 border-dashed border-gray-300 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      required
                    />
                    {previewImage ? (
                      <>
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="w-8 h-8 text-white mb-2" />
                          <span className="text-white font-medium">
                            Ubah Foto
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-gray-500 font-medium">
                          Klik untuk mengunggah foto
                        </span>
                        <span className="text-sm text-gray-400 mt-1">
                          (PNG, JPG, maksimal 5MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex flex-col gap-2 md:col-span-2">
                  <label
                    htmlFor="nama_produk"
                    className="font-semibold text-gray-700"
                  >
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    id="nama_produk"
                    name="nama_produk"
                    value={formData.nama_produk}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e96481] focus:border-transparent transition-all"
                    placeholder="Contoh: Nasi Goreng Spesial"
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="kategori"
                    className="font-semibold text-gray-700"
                  >
                    Kategori
                  </label>
                  <select
                    id="kategori"
                    name="kategori"
                    value={formData.kategori}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e96481] focus:border-transparent transition-all"
                    required
                  >
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack">Snack</option>
                    <option value="Dessert">Dessert</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="harga"
                    className="font-semibold text-gray-700"
                  >
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    id="harga"
                    name="harga"
                    value={formData.harga}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e96481] focus:border-transparent transition-all"
                    placeholder="Contoh: 25000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate("/admin/kelola-menu")}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-[#e96481] hover:bg-[#d45672] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Simpan Menu
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </SidebarAdmin>
  );
};

export default TambahMenu;
