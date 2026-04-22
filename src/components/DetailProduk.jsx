import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Jika menggunakan React Router
import { getProductById } from "../services/api";
import logoMamaPasha from "../assets/images/logo-kecil.png";

/* ── Data ulasan ─────────────────────────────────────────── */
const ulasan = [
  {
    id: 1,
    user: "b****e",
    rating: 5,
    liked: false,
    teks: "Risolesnya enak, mantap, pengirimannya juga tepat waktu, worth it pesan disini!",
  },
  {
    id: 2,
    user: "j****8",
    rating: 5,
    liked: true,
    teks: "ga ragu pesan catering disini, murah enak, cocok untuk berbagai acara,,, sukses selalu Mama Pasha's Treats...",
  },
];

/* ── Bintang ─────────────────────────────────────────────── */
function Stars({ rating, size = "text-lg" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`${size} ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ── Halaman Detail Produk ───────────────────────────────── */
export default function DetailProduk({
  onBack,
  onPesan,
  onKeranjang,
  cartCount = 0,
}) {
  const [qty, setQty] = useState(1);
  const [likes, setLikes] = useState({ 1: false, 2: true });
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil ID dari URL params (gunakan ini jika pakai React Router)
  const { id } = useParams();

  // Atau bisa juga terima sebagai prop
  // const { productId } = props;

  const toggleLike = (id) => setLikes((prev) => ({ ...prev, [id]: !prev[id] }));

  // Fetch data produk saat component mount atau ID berubah
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gunakan ID dari params atau props
        const productId = id; // atau props.productId

        if (!productId) {
          throw new Error("Product ID tidak ditemukan");
        }

        const response = await getProductById(productId);

        if (response.success && response.data) {
          // Mapping data dari API ke format yang digunakan component
          const productData = {
            id: response.data._id,
            nama: response.data.nama_produk,
            harga: response.data.harga,
            rating: response.data.rating || 4.5, // Default rating jika tidak ada
            deskripsi:
              response.data.deskripsi || "Deskripsi produk belum tersedia",
            emoji: response.data.emoji || "🥟", // Default emoji jika tidak ada
            stok: response.data.stok,
            kategori: response.data.kategori,
          };
          setProduk(productData);
        } else {
          throw new Error("Gagal mengambil data produk");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err.message || "Terjadi kesalahan saat memuat produk");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]); // atau [props.productId]

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-pink-5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍳</div>
          <p className="text-pink-6 font-semibold">Memuat produk...</p>
        </div>
      </div>
    );
  }

  // Tampilkan error state
  if (error || !produk) {
    return (
      <div className="min-h-screen bg-pink-5 flex flex-col">
        <div className="flex items-center px-4 py-3 bg-white">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-pink-6 font-semibold text-sm"
          >
            <span className="text-lg">←</span>
            Kembali
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="text-6xl mb-4">😞</div>
            <p className="text-gray-600 mb-4">
              {error || "Produk tidak ditemukan"}
            </p>
            <button
              onClick={onBack}
              className="bg-pink-6 text-white px-6 py-2 rounded-full"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-5 flex flex-col">
      {/* ── Top Bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-white">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-pink-6 font-semibold text-sm"
        >
          <span className="text-lg">←</span>
          Detail Produk
        </button>
        <button
          onClick={onKeranjang}
          className="flex items-center gap-2 bg-pink-6 text-white text-sm font-bold px-4 py-2 rounded-full"
        >
          <span>🛒</span>
          Keranjang
          {cartCount > 0 && (
            <span className="bg-white text-pink-6 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Konten scroll ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Foto produk */}
        <div className="w-full h-56 lg:h-72 bg-pink-2 flex items-center justify-center text-8xl overflow-hidden">
          {produk.emoji}
        </div>

        {/* Info produk */}
        <div className="bg-white px-5 py-5">
          {/* Nama */}
          <h1 className="text-xl lg:text-2xl font-extrabold text-pink-6 mb-1">
            {produk.nama}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <Stars rating={Math.floor(produk.rating)} />
            <span className="text-sm font-semibold text-gray-500">
              {produk.rating}
            </span>
          </div>

          {/* Toko */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-pink-2 shrink-0">
              <img
                src={logoMamaPasha}
                alt="Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">
              Mama Pasha&apos;s Treats
            </span>
          </div>

          {/* Stok info (optional) */}
          {produk.stok !== undefined && (
            <p className="text-xs text-gray-500 mb-2">
              Stok: {produk.stok} tersisa
            </p>
          )}

          {/* Harga */}
          <p className="text-2xl lg:text-3xl font-extrabold text-pink-6 mb-3">
            Rp{produk.harga.toLocaleString("id-ID")}
          </p>

          {/* Deskripsi */}
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            {produk.deskripsi}
          </p>

          {/* Counter qty */}
          <div className="flex justify-end items-center gap-2 mb-2">
            <button
              onClick={() => setQty((n) => Math.max(1, n - 1))}
              className="w-9 h-9 rounded-xl bg-pink-6 text-white text-xl font-bold flex items-center justify-center"
              disabled={produk.stok === 0}
            >
              −
            </button>
            <div className="w-10 h-9 rounded-xl bg-pink-6 text-white font-extrabold flex items-center justify-center text-sm">
              {qty}
            </div>
            <button
              onClick={() =>
                setQty((n) => Math.min(n + 1, produk.stok || Infinity))
              }
              className="w-9 h-9 rounded-xl bg-pink-6 text-white text-xl font-bold flex items-center justify-center"
              disabled={produk.stok === 0}
            >
              +
            </button>
          </div>
          {produk.stok === 0 && (
            <p className="text-red-500 text-xs text-right mt-1">Stok habis</p>
          )}
        </div>

        {/* ── Ulasan ─────────────────────────────────────────── */}
        <div className="mx-4 mt-4 bg-pink-1/40 rounded-2xl overflow-hidden">
          {/* Header ulasan */}
          <div className="px-4 py-3 border-b-2 border-pink-6/30">
            <h2 className="text-base font-extrabold text-pink-6">
              Ulasan ({ulasan.length * 25})
            </h2>
          </div>

          {/* List ulasan */}
          {ulasan.map((u, i) => (
            <div
              key={u.id}
              className={`px-4 py-4 ${i < ulasan.length - 1 ? "border-b border-pink-2/50" : ""}`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-2">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                    <span className="text-gray-400 text-lg">👤</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600">{u.user}</p>
                    <Stars rating={u.rating} size="text-sm" />
                  </div>
                </div>
                {/* Tombol like */}
                <button
                  onClick={() => toggleLike(u.id)}
                  className="text-lg mt-1"
                >
                  {likes[u.id] ? "👍" : "👍🏻"}
                </button>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mt-1">
                {u.teks}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar (fixed) ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 px-4 py-3 bg-pink-6">
        <button
          onClick={() => onKeranjang && onKeranjang(produk, qty)}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-pink-6 font-bold text-sm py-3.5 rounded-full"
          disabled={produk.stok === 0}
        >
          + Keranjang
        </button>
        <button
          onClick={() => onPesan && onPesan(produk, qty)}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-pink-6 font-bold text-sm py-3.5 rounded-full"
          disabled={produk.stok === 0}
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
}