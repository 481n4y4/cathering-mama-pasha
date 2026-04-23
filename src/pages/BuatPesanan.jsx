import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkCheckoutDate, getCart } from "../services/api";

/* ── Halaman Buat Pesanan ────────────────────────────────── */
export default function BuatPesanan({ onBack, produk, qty = 20, onPesan }) {
  const navigate = useNavigate();
  const [catatan, setCatatan] = useState("");
  const [showTanggal, setShowTanggal] = useState(false);
  const [tanggalKirim, setTanggalKirim] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState("cod");
  const [tanggalError, setTanggalError] = useState("");
  const [tanggalLoading, setTanggalLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [cartSubtotal, setCartSubtotal] = useState(null);

  const fallbackItem = produk ?? {
    nama: "Risoles Mayonaise",
    harga: 2500,
    emoji: "🥟",
  };
  const voucher = 0;

  const displayItems = cartItems.length
    ? cartItems
    : [
        {
          id: "fallback",
          name: fallbackItem.nama,
          price: fallbackItem.harga,
          qty,
          emoji: fallbackItem.emoji || "🥟",
        },
      ];

  const computedTotal = displayItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );
  const total = cartSubtotal ?? computedTotal;

  const minTanggal = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + 3);
    return now.toISOString().slice(0, 10);
  }, []);

  const formatTanggal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isTanggalValid = Boolean(tanggalKirim) && !tanggalError;

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        const items = response?.data?.cart?.items || [];
        const apiSubtotal =
          response?.data?.cart?.total ??
          response?.data?.cart?.total_harga ??
          response?.data?.total ??
          null;
        const mapped = items.map((item) => {
          const product = item.produk || {};
          return {
            id: item._id || product._id,
            name: product.nama_produk || "Produk",
            price: product.harga || 0,
            qty: item.kuantitas || 0,
            emoji: product.emoji || "🍱",
          };
        });
        setCartItems(mapped);
        if (apiSubtotal !== null && apiSubtotal !== undefined) {
          setCartSubtotal(apiSubtotal);
        }
      } catch (err) {
        console.error(err);
        setCartError("Gagal memuat keranjang.");
      } finally {
        setCartLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleTanggalChange = async (value) => {
    setTanggalError("");
    setTanggalLoading(true);
    try {
      await checkCheckoutDate({ tanggal_pengiriman: value });
      setTanggalKirim(value);
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Tanggal pengiriman tidak tersedia.";
      setTanggalError(message);
    } finally {
      setTanggalLoading(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/keranjang");
  };

  return (
    <div className="min-h-screen bg-pink-3 flex flex-col">
      {/* ══ Top Bar ══ */}
      <div className="sticky top-0 z-40 px-3 pt-3 lg:px-8 lg:pt-4 pointer-events-none">
        <div className="pointer-events-auto grid grid-cols-3 items-center h-13 lg:h-16 px-4 bg-white rounded-full border border-pink-2 shadow-nav">
          <div className="flex justify-start">
            <button
              onClick={handleBack}
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
              Buat Pesanan
            </span>
          </div>
          <div className="flex justify-end" />
        </div>
      </div>

      {/* ── Konten scroll ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-3 lg:px-8 pt-5 pb-36 flex flex-col gap-4">
        {/* Kartu alamat */}
        <div className="bg-white rounded-4xl p-5 shadow-card relative flex items-center gap-3">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-pink-6 text-base">
                <i className="fa-solid fa-location-dot"></i>
              </span>
              <span className="font-extrabold text-pink-6 text-base">Jeno</span>
              <span className="text-gray-400 text-sm">(+62) 123-4567-8910</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Jalan Neo Culture Technology Raya No. 127, Gangnam, Semarang Timur,
              Kota Semarang, Jawa Tengah, ID 50131
            </p>
          </div>
          <div className="flex-shrink-0 text-gray-400">
            <i className="fa-solid fa-angle-right"></i>
          </div>
        </div>

        {/* Kartu detail pesanan */}
        <div className="bg-white rounded-4xl p-5 shadow-card flex flex-col gap-4">
          {cartLoading ? (
            <p className="text-sm text-gray-500">Memuat item...</p>
          ) : cartError ? (
            <p className="text-sm text-red-500 font-semibold">{cartError}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {displayItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-pink-5 flex items-center justify-center text-4xl shrink-0 overflow-hidden">
                    {item.emoji}
                  </div>
                  <div>
                    <p className="font-extrabold text-pink-6 text-base mb-0.5">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-400 mb-1">x{item.qty}</p>
                    <p className="font-extrabold text-pink-6 text-lg">
                      Rp{(item.price * item.qty).toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-pink-6">Pesan untuk penjual</span>
            <span className="text-gray-500">Tinggalkan pesan</span>
          </div>

          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Tambahkan catatan untuk pesanan..."
            rows={3}
            className="w-full bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-2"
          />

          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-pink-6">Opsi Pengiriman</span>
            <button
              onClick={() => setShowTanggal(true)}
              className="text-gray-500 font-semibold flex items-center gap-2"
            >
              <i class="fa-solid fa-calendar"></i>
              Delivery
              {tanggalKirim ? ` (${formatTanggal(tanggalKirim)})` : ""}
              <i className="fa-solid fa-chevron-down text-xs"></i>
            </button>
          </div>

          <div className="bg-gray-200/90 rounded-2xl p-4">
            <p className="font-extrabold text-pink-6 mb-2">Metode Pembayaran</p>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 font-semibold">
                QRIS
              </span>
              <button
                onClick={() => setMetodePembayaran("cod")}
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  metodePembayaran === "cod"
                    ? "bg-pink-6 border-pink-6"
                    : "bg-white border-gray-300"
                }`}
              >
                {metodePembayaran === "cod" && (
                  <i className="fa-solid fa-check text-white text-[10px]"></i>
                )}
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-600 font-semibold">
                Transfer BRI / BCA
              </span>
              <button
                onClick={() => setMetodePembayaran("transfer")}
                className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  metodePembayaran === "transfer"
                    ? "bg-pink-6 border-pink-6"
                    : "bg-white border-gray-300"
                }`}
              >
                {metodePembayaran === "transfer" && (
                  <i className="fa-solid fa-check text-white text-[10px]"></i>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Ringkasan harga */}
        <div className="bg-white rounded-4xl p-5 shadow-card">
          <p className="text-base font-extrabold text-pink-6 mb-4">
            Rincian Pembayaran
          </p>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Subtotal Pesanan</span>
            <span className="font-semibold text-gray-700">
              Rp{total.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-500">Voucher Diskon</span>
            <span className="font-semibold text-gray-700">
              Rp{voucher.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="border-t border-pink-1 pt-3 flex justify-between">
            <span className="font-extrabold text-pink-6">Total Pembayaran</span>
            <span className="font-extrabold text-pink-6">
              Rp{(total - voucher).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar (fixed) ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 px-3 lg:px-8 py-3 bg-pink-6">
        <button
          onClick={() => onPesan && onPesan(produk, qty)}
          className="w-full bg-white text-pink-6 font-bold text-sm py-3.5 rounded-full"
        >
          Checkout
        </button>
      </div>

      {showTanggal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(184,68,94,0.35)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTanggal(false);
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-extrabold text-pink-6">
                Pilih Tanggal Pengiriman
              </p>
              <button
                onClick={() => setShowTanggal(false)}
                className="w-8 h-8 rounded-full bg-pink-5 text-pink-6 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
              Minimal 3 hari setelah pemesanan.
            </p>
            <input
              type="date"
              min={minTanggal}
              value={tanggalKirim}
              onChange={(e) => handleTanggalChange(e.target.value)}
              className="w-full border border-pink-2 rounded-xl px-3 py-2 text-sm"
            />
            {tanggalLoading && (
              <p className="text-xs text-gray-500 mt-2">Memeriksa tanggal...</p>
            )}
            {tanggalError && (
              <p className="text-xs text-red-500 mt-2">{tanggalError}</p>
            )}
            <button
              onClick={() => setShowTanggal(false)}
              className={`mt-4 w-full font-bold text-sm py-3 rounded-full transition-opacity ${
                tanggalLoading || !isTanggalValid
                  ? "bg-pink-3 text-white/70 cursor-not-allowed"
                  : "bg-pink-6 text-white"
              }`}
              disabled={tanggalLoading || !isTanggalValid}
            >
              Simpan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
