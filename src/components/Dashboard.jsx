import { useState } from "react";
import products from "../data/products";

/* ── Format harga ─────────────────────────────────────────── */
const formatRp = (n) => "Rp" + n.toLocaleString("id-ID");

/* ── Bintang rating ───────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 mb-1">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={`text-[11px] lg:text-xs ${
            i < Math.round(rating) ? "text-yellow-400" : "text-pink-1"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-[10px] lg:text-xs text-text-mid font-semibold ml-0.5">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

/* ── Kartu Produk ─────────────────────────────────────────── */
function ProductCard({ product, isFav, onToggleFav, onDetailProduk }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onDetailProduk && onDetailProduk(product)}
      className={`bg-white rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-200 ${
        hovered ? "shadow-card-hover -translate-y-1" : "shadow-card"
      }`}
    >
      {/* Gambar / emoji */}
      <div className="w-full aspect-square bg-pink-5 flex items-center justify-center text-4xl lg:text-5xl">
        {product.emoji}
      </div>

      {/* Badge diskon/HOT */}
      {product.badge && (
        <span className="absolute top-2 left-2 bg-pink-6 text-white text-[9px] lg:text-[10px] font-extrabold px-2 py-0.5 rounded-full">
          {product.badge}
        </span>
      )}

      {/* Tombol favorit */}
      <button
        onClick={() => onToggleFav(product.id)}
        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-sm border-none cursor-pointer"
        aria-label="Toggle favorit"
      >
        {isFav ? "❤️" : "🤍"}
      </button>

      {/* Info */}
      <div className="px-3 pt-2 pb-3">
        <p className="text-xs lg:text-sm font-bold text-text-dark truncate mb-0.5">
          {product.name}
        </p>
        <Stars rating={product.rating} />
        <p className="text-xs lg:text-sm font-extrabold text-pink-6">
          {formatRp(product.price)}
        </p>
      </div>
    </div>
  );
}

/* ── Dashboard utama ──────────────────────────────────────── */
export default function Dashboard({ onAddToCart, onDetailProduk }) {
  const [activeTab, setActiveTab] = useState("Snack");
  const [search, setSearch]       = useState("");
  const [favs, setFavs]           = useState(
    () => products.reduce((acc, p) => ({ ...acc, [p.id]: p.fav }), {})
  );

  const toggleFav = (id) =>
    setFavs((prev) => ({ ...prev, [id]: !prev[id] }));

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabs = [
    { label: "🍿 Snack",    key: "Snack"    },
    { label: "🍱 Catering", key: "Catering" },
    { label: "🔥 Promo",    key: "Promo"    },
  ];

  return (
    /* max-w: 500px di HP, penuh tapi dibatasi 860px di desktop */
    <main className="w-full max-w-[500px] lg:max-w-[860px] mx-auto px-4 lg:px-10 pt-7 pb-16">

      {/* ── Greeting ─────────────────────────────────────────── */}
      <div className="text-center mb-5 animate-fade-up">
        <h1 className="font-script text-pink-6 font-bold leading-tight text-[34px] lg:text-5xl">
          Halo, Jeno!
        </h1>
        <p className="text-sm lg:text-base font-semibold text-text-mid mt-1">
          Mau makan enak hari ini?
        </p>
      </div>

      {/* ── Search Bar ───────────────────────────────────────── */}
      <div className="relative mb-4">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base text-text-mid">
          🔍
        </span>
        <input
          type="text"
          placeholder="Cari snack atau catering..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 lg:py-3.5 rounded-full border-2 border-pink-2 bg-white text-sm lg:text-base text-text-dark placeholder:text-text-mid focus:border-pink-3 transition-colors"
        />
      </div>

      {/* ── Category Tabs ────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2.5 mb-5">
        {tabs.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-1.5 px-5 lg:px-7 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-bold border-2 transition-all duration-200 ${
              activeTab === key
                ? "bg-pink-6 text-white border-pink-6"
                : "bg-white text-text-mid border-pink-2 hover:border-pink-3 hover:text-text-dark"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Banner Diskon ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-pink-6 px-6 lg:px-10 py-5 lg:py-8 flex items-center justify-between mb-7">
        {/* Dekorasi lingkaran */}
        <span className="absolute -right-5 -top-5 w-40 h-40 rounded-full bg-white/[0.08] block" />
        <span className="absolute right-16 -bottom-14 w-28 h-28 rounded-full bg-white/[0.06] block" />

        {/* Teks */}
        <div className="relative z-10">
          <p className="text-[11px] lg:text-xs font-bold text-white/80 tracking-widest uppercase mb-1">
            Promo Hari Ini
          </p>
          <h2 className="text-3xl lg:text-5xl font-black text-white leading-none mb-1 lg:mb-2">
            Diskon 20%
          </h2>
          <p className="text-sm lg:text-base text-white/85 mb-4 lg:mb-6">
            Semua paket nasi box
          </p>
          <button className="bg-white text-pink-6 text-sm lg:text-base font-extrabold px-5 lg:px-7 py-2 lg:py-2.5 rounded-full hover:scale-105 transition-transform shadow-button">
            Pesan Sekarang
          </button>
        </div>

        {/* Emoji mengambang */}
        <span className="relative z-10 text-6xl lg:text-9xl animate-float">🍱</span>
      </div>

      {/* ── Section: Rekomendasi ──────────────────────────────── */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[15px] lg:text-lg font-extrabold text-text-dark">
          Rekomendasi Untukmu
        </span>
        <button className="text-xs lg:text-sm font-bold text-pink-6 bg-transparent border-none cursor-pointer">
          Lihat Semua
        </button>
      </div>

      {/* Grid: 3 kolom HP → 4 kolom desktop */}
      <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5 mb-8">
        {filtered.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            isFav={favs[p.id]}
            onToggleFav={toggleFav}
            onDetailProduk={onDetailProduk}
          />
        ))}
      </div>

      {/* ── Tentang Kami ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border-2 border-pink-1 shadow-card flex items-center gap-4 lg:gap-8 p-5 lg:p-8">

        {/* Teks */}
        <div className="flex-1">
          <p className="text-[11px] lg:text-xs font-bold text-text-mid uppercase tracking-wide mb-1">
            Tentang Kami
          </p>
          <h3 className="font-script text-pink-6 font-bold mb-1.5 text-xl lg:text-3xl">
            Mama Pasha&apos;s Treats
          </h3>
          <p className="text-xs lg:text-sm text-text-mid leading-relaxed mb-3 lg:mb-5 lg:max-w-md">
            Selamat Datang di Mama Pasha&apos;s Treats! Nikmati berbagai macam
            snack lokal dan layanan catering profesional untuk acara anda.
          </p>
          <button className="bg-pink-6 text-white text-sm lg:text-base font-bold px-5 lg:px-7 py-2 lg:py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-button">
            Lihat Menu →
          </button>
        </div>

        {/* Logo bulat */}
        <div className="w-20 h-20 lg:w-32 lg:h-32 rounded-full bg-pink-5 border-[3px] border-pink-2 flex flex-col items-center justify-center shrink-0 gap-0.5">
          <span className="text-3xl lg:text-5xl">👩‍🍳</span>
          <span
            className="font-script text-pink-6 font-bold text-center leading-tight"
            style={{ fontSize: 7 }}
          >
            MAMA PASHA&apos;S<br />Treats
          </span>
        </div>

      </div>
    </main>
  );
}