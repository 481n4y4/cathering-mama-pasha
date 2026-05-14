import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadBuktiQris } from "../services/api";

const QRIS_IMAGE =
  "https://res.cloudinary.com/dxznzq3kl/image/upload/v1778772554/qris_h016nn.jpg";

export default function PembayaranQris() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};
  const orderId = state.orderId;

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const langkah = useMemo(
    () => [
      "Buka aplikasi mobile banking atau e-wallet Anda.",
      "Scan QRIS di bawah untuk melakukan pembayaran sesuai total pesanan.",
      "Simpan atau screenshot bukti pembayaran, lalu upload bukti di bawah.",
    ],
    [],
  );

  const handleCopyLink = async () => {
    setError("");
    try {
      await navigator.clipboard.writeText(QRIS_IMAGE);
    } catch (err) {
      setError("Gagal menyalin link. Silakan salin secara manual.");
    }
  };

  const handleUpload = async () => {
    setError("");

    if (!orderId) {
      setError("Order tidak ditemukan. Silakan buat pesanan ulang.");
      return;
    }
    if (!file) {
      setError("Pilih foto bukti pembayaran terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      await uploadBuktiQris({ orderId, file });
      navigate("/pesanan-saya", {
        replace: true,
        state: { uploadSuccess: true, method: "qris" },
      });
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Gagal upload bukti pembayaran.";
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
              Pembayaran QRIS
            </span>
          </div>
          <div className="flex justify-end" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 lg:px-8 pt-5 pb-32 flex flex-col gap-4">
        <div className="bg-white rounded-4xl p-5 shadow-card">
          <p className="text-base font-extrabold text-pink-6 mb-2">Scan QRIS</p>
          <div className="flex items-center justify-center bg-pink-5 rounded-2xl px-4 py-6">
            <img
              src={QRIS_IMAGE}
              alt="QRIS"
              className="w-48 h-48 object-contain"
            />
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Scan QR di atas menggunakan aplikasi pembayaran Anda.
          </p>
          <div className="mt-3 flex gap-3">
            <button
              onClick={handleCopyLink}
              className="bg-pink-5 text-pink-6 font-semibold px-4 py-2 rounded-full"
            >
              Salin Link QRIS
            </button>
            <a
              href={QRIS_IMAGE}
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-pink-2 text-pink-6 font-semibold px-4 py-2 rounded-full flex items-center"
            >
              Buka Gambar
            </a>
          </div>
        </div>

        <div className="bg-white rounded-4xl p-5 shadow-card">
          <p className="text-base font-extrabold text-pink-6 mb-3">
            Langkah Pembayaran
          </p>
          <ol className="text-sm text-gray-600 list-decimal list-inside space-y-2">
            {langkah.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ol>
        </div>

        <div className="bg-white rounded-4xl p-5 shadow-card">
          <p className="text-base font-extrabold text-pink-6 mb-3">
            Upload Bukti Pembayaran
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
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-3 lg:px-8 py-3 bg-pink-6">
        <button
          onClick={handleUpload}
          className="w-full bg-white text-pink-6 font-bold text-sm py-3.5 rounded-full disabled:opacity-70"
          disabled={loading}
        >
          {loading ? "Mengupload..." : "Kirim Bukti Pembayaran"}
        </button>
      </div>
    </div>
  );
}
