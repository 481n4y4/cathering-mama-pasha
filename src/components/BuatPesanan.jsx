import { useState } from "react";

/* ── Halaman Buat Pesanan ────────────────────────────────── */
export default function BuatPesanan({ onBack, produk, qty = 20 }) {
  const [catatan, setCatatan] = useState("");

  const item = produk ?? {
    nama:  "Risoles Mayonaise",
    harga: 2500,
    emoji: "🥟",
  };

  const total = item.harga * qty;

  return (
    <div className="min-h-screen bg-pink-3 flex flex-col">

      {/* ── Top Bar ────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white">
        <button
          onClick={onBack}
          className="text-pink-6 text-lg"
        >
          ←
        </button>
        <span className="text-pink-6 font-semibold text-sm">Buat Pesanan</span>
      </div>

      {/* ── Konten scroll ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-32 flex flex-col gap-4">

        {/* Kartu alamat */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-pink-6 text-base">📍</span>
            <span className="font-extrabold text-pink-6 text-base">Jeno</span>
            <span className="text-gray-400 text-sm">(+62) 123-4567-8910</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Jalan Neo Culture Technology Raya No. 127, Gangnam, Semarang Timur,
            Kota Semarang, Jawa Tengah, ID 50131
          </p>
        </div>

        {/* Kartu detail pesanan */}
        <div className="bg-white rounded-2xl p-4 shadow-card flex flex-col gap-4">

          {/* Item produk */}
          <div className="flex items-center gap-3">
            {/* Foto / emoji */}
            <div className="w-20 h-20 rounded-xl bg-pink-5 flex items-center justify-center text-4xl shrink-0 overflow-hidden">
              {item.emoji}
            </div>

            {/* Info */}
            <div>
              <p className="font-extrabold text-pink-6 text-base mb-0.5">
                {item.nama}
              </p>
              <p className="text-sm text-gray-400 mb-1">x{qty}</p>
              <p className="font-extrabold text-pink-6 text-lg">
                Rp{total.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          {/* Area catatan */}
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Tambahkan catatan untuk pesanan..."
            rows={4}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-2"
          />
        </div>

        {/* Ringkasan harga */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
            Ringkasan Pembayaran
          </p>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">{item.nama} x{qty}</span>
            <span className="font-semibold text-gray-700">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Ongkos kirim</span>
            <span className="font-semibold text-green-600">Gratis</span>
          </div>
          <div className="border-t border-pink-1 pt-2 mt-2 flex justify-between">
            <span className="font-extrabold text-pink-6">Total</span>
            <span className="font-extrabold text-pink-6">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

      </div>

      {/* ── Bottom Bar (fixed) ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 px-4 py-3 bg-pink-6">
        <button
          onClick={() => onPesan && onPesan(produk, qty)}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-pink-6 font-bold text-sm py-3.5 rounded-full"
        >
          Pesan Sekarang
        </button>
      </div>

    </div>
  );
}
