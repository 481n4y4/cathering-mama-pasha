import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import iconBack from "../assets/images/icon-back.webp";

/* ── Halaman Buat Pesanan ────────────────────────────────── */
export default function BuatPesanan({ onBack, onPesan, produk, qty = 1 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedIds = location.state?.selectedIds || [];
  const handleBack = onBack || (() => navigate(-1));
  const handlePesan = () => {
    if (onPesan) {
      onPesan(produk, qty);
    } else {
      alert("Pesanan berhasil diproses.");
      navigate("/");
    }
  };
  const [catatan, setCatatan] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cod");

  const item = produk ?? {
    nama: "Risoles Mayonaise",
    harga: 2500,
    emoji: "🥟",
  };

  const total = item.harga * qty;
  const shippingDate = "25 Apr 2026";

  return (
    <div
      className="min-h-screen text-slate-800"
      style={{
        background: "radial-gradient(circle at top, #ffe0eb 10%, #ffd2df 45%, #f4b0c6 100%)",
      }}
    >
      <div className="px-4 pt-5 pb-28">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-2xl bg-white shadow-lg shadow-pink-200/70 flex items-center justify-center"
          >
            <img src={iconBack} alt="Back" className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-extrabold text-pink-700">Buat Pesanan</h1>
        </div>

        <div className="rounded-[34px] bg-white/90 border border-white shadow-card p-5 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-700 text-xl">
              📍
            </div>
            <div className="space-y-1">
              <p className="font-bold text-pink-700">Jeno <span className="text-xs text-slate-400 font-medium">(+62) 123-4567-8910</span></p>
              <p className="text-sm text-slate-500 leading-relaxed">
                Jalan Kembang Sari No.34, Gangnam, Semarang Timur, Kota Semarang,
                Jawa Tengah, ID 50131
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[34px] bg-white/95 border border-white shadow-card p-5 mb-5">
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-3xl bg-pink-50 flex items-center justify-center text-5xl">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-extrabold text-pink-700 leading-tight">{item.nama}</p>
                <p className="text-sm text-slate-400 mt-1">x{qty}</p>
                <p className="text-xl font-extrabold text-pink-700 mt-3">Rp{total.toLocaleString("id-ID")}</p>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-pink-700">Pesan untuk penjual</span>
                <button className="text-sm font-semibold text-slate-500">Tinggalkan pesan</button>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-pink-700">Opsi Pengiriman</span>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-semibold">
                  Delivery
                  <span className="rounded-full bg-pink-50 px-3 py-1 text-pink-700">{shippingDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-slate-100 p-4">
            <p className="text-sm font-bold text-pink-700 mb-3">Metode Pembayaran</p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setSelectedPayment("cod")}
                className={`w-full rounded-3xl p-4 text-left transition ${
                  selectedPayment === "cod"
                    ? "bg-white border border-pink-200 shadow-sm"
                    : "bg-slate-50 border border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">COD (Cash on Delivery)</p>
                    <p className="text-xs text-slate-500 mt-1">Bayar saat pesanan sampai</p>
                  </div>
                  <span className="text-lg">{selectedPayment === "cod" ? "✓" : ""}</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedPayment("transfer")}
                className={`w-full rounded-3xl p-4 text-left transition ${
                  selectedPayment === "transfer"
                    ? "bg-white border border-pink-200 shadow-sm"
                    : "bg-slate-50 border border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-800">Transfer</p>
                    <p className="text-xs text-slate-500 mt-1">BRI • BCA</p>
                  </div>
                  <span className="text-lg">{selectedPayment === "transfer" ? "✓" : ""}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[34px] bg-white/95 border border-white shadow-card p-5 pb-6">
          <p className="text-lg font-bold text-pink-700 mb-5">Rincian Pembayaran</p>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal Pesanan</span>
              <span>Rp{total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Pengiriman</span>
              <span>Rp7.000</span>
            </div>
            <div className="flex justify-between">
              <span>Voucher Diskon</span>
              <span>Rp0</span>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-5 pt-4 flex items-center justify-between">
            <span className="font-bold text-pink-700">Total Pembayaran</span>
            <span className="text-xl font-extrabold text-pink-700">Rp{(total + 7000).toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-linear-to-t from-white/95 to-transparent shadow-[0_-12px_30px_rgba(244,176,198,0.25)]">
        <button
          onClick={handlePesan}
          className="w-full rounded-full bg-pink-700 text-white text-base font-bold py-4 shadow-xl shadow-pink-700/20"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
