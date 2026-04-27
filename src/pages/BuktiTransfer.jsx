import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadBuktiTransfer } from "../services/api";

export default function BuktiTransfer() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const orderId = state.orderId;
  const rekening =
    state.noRekeningPenjual || state.paymentInstruction?.account_number || "";

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const langkah = useMemo(
    () => [
      "Transfer sesuai total pesanan ke rekening penjual.",
      "Simpan bukti transfer (screenshot atau foto struk).",
      "Upload foto bukti transfer di bawah ini.",
    ],
    [],
  );

  const handleUpload = async () => {
    setError("");
    if (!orderId) {
      setError("Order tidak ditemukan. Silakan buat pesanan ulang.");
      return;
    }
    if (!file) {
      setError("Pilih foto bukti transfer terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      await uploadBuktiTransfer({ orderId, file });
      setSuccess(true);
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Gagal upload bukti transfer.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-3 flex flex-col">
      <div className="sticky top-0 z-40 px-3 pt-3 lg:px-8 lg:pt-4">
        <div className="grid grid-cols-3 items-center h-13 lg:h-16 px-4 bg-white rounded-full border border-pink-2 shadow-nav">
          <div className="flex justify-start">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 border border-pink-2 rounded-full px-3 py-1.5 bg-pink-5 hover:bg-pink-1 transition-colors"
              aria-label="Kembali"
            >
              <i className="fa-solid fa-arrow-left text-text-dark"></i>
              <span className="text-[11px] lg:text-sm font-bold text-text-dark">
                Kembali
              </span>
            </button>
          </div>
          <div className="flex justify-center">
            <span className="text-sm lg:text-base font-extrabold text-text-dark">
              Bukti Transfer
            </span>
          </div>
          <div className="flex justify-end" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 lg:px-8 pt-5 pb-32 flex flex-col gap-4">
        <div className="bg-white rounded-4xl p-5 shadow-card">
          <p className="text-base font-extrabold text-pink-6 mb-2">
            Nomor Rekening Penjual
          </p>
          <div className="flex items-center justify-between bg-pink-5 rounded-2xl px-4 py-3">
            <span className="text-lg font-extrabold text-pink-6">
              {rekening || "-"}
            </span>
            <i className="fa-solid fa-building-columns text-pink-6"></i>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Pastikan nominal transfer sesuai total pesanan.
          </p>
        </div>

        <div className="bg-white rounded-4xl p-5 shadow-card">
          <p className="text-base font-extrabold text-pink-6 mb-3">
            Langkah Transfer
          </p>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-2">
            {langkah.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="bg-white rounded-4xl p-5 shadow-card">
          <p className="text-base font-extrabold text-pink-6 mb-3">
            Upload Foto Bukti Transfer
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="block w-full text-xs text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-pink-5 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-pink-6"
          />
          {file && (
            <p className="mt-2 text-[11px] text-gray-500">File: {file.name}</p>
          )}
          {error && (
            <p className="mt-2 text-xs text-red-500 font-semibold">{error}</p>
          )}
          {success && (
            <p className="mt-2 text-xs text-green-600 font-semibold">
              Bukti transfer berhasil diupload.
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-3 lg:px-8 py-3 bg-pink-6">
        <button
          onClick={handleUpload}
          className="w-full bg-white text-pink-6 font-bold text-sm py-3.5 rounded-full disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Mengupload..." : "Kirim Bukti Transfer"}
        </button>
      </div>
    </div>
  );
}
