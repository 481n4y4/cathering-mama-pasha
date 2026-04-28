import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom"; // Jika menggunakan React Router
import {
  addToCart,
  getProductById,
  getCommentsByProduct,
  createComment,
  deleteComment,
} from "../services/api";
import ProfilLayout from "../components/ProfilLayout";
import logoMamaPasha from "../assets/images/logo-kecil.png";

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
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentRating, setNewCommentRating] = useState(5);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLoggedIn] = useState(!!localStorage.getItem("token"));
  const [currentUserId, setCurrentUserId] = useState(null);
  const ratingSectionRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Ambil ID dari URL params (gunakan ini jika pakai React Router)
  const { id } = useParams();

  // Atau bisa juga terima sebagai prop
  // const { productId } = props;

  const handleAddToCart = async () => {
    if (!produk?.id) return;
    try {
      await addToCart({ produkId: produk.id, kuantitas: qty });
      setShowAddSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan ke keranjang. Coba lagi.");
    }
  };

  const handlePesanSekarang = async () => {
    if (!produk?.id) return;
    try {
      await addToCart({ produkId: produk.id, kuantitas: qty });
      setShowAddSuccess(true);
      navigate("/keranjang");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan ke keranjang. Coba lagi.");
    }
  };

  const handlePostComment = async () => {
    if (!newCommentText.trim()) {
      alert("Komentar tidak boleh kosong");
      return;
    }

    setSubmittingComment(true);
    try {
      await createComment({
        produk_id: produk.id,
        teks_komentar: newCommentText,
        rating: newCommentRating,
      });
      setNewCommentText("");
      setNewCommentRating(5);
      // Reload comments
      await fetchComments();
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim komentar. Pastikan Anda sudah login.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return;

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert(
        "Gagal menghapus komentar. Anda hanya bisa menghapus komentar sendiri.",
      );
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    navigate("/");
  };

  const cartButton = (
    <button
      onClick={() => navigate("/keranjang")}
      className="flex items-center gap-2 border border-pink-2 rounded-full px-3 py-1.5 bg-pink-5 hover:bg-pink-1 transition-colors"
    >
      <span className="text-sm lg:text-base">🛒</span>
      <span className="text-[11px] lg:text-sm font-bold text-text-dark">
        Keranjang
      </span>
      {cartCount > 0 && (
        <span className="bg-pink-6 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </button>
  );

  const fetchComments = async (productId) => {
    if (!productId) return;
    try {
      setLoadingComments(true);
      const response = await getCommentsByProduct(productId);
      if (response.success && response.data) {
        setComments(response.data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Extract user ID dari JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // JWT format: header.payload.signature
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        setCurrentUserId(decoded.id || decoded.userId);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);
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
            image:
              response.data.gambar ||
              response.data.image ||
              response.data.image_url ||
              response.data.foto ||
              response.data.foto_produk ||
              "",
            emoji: response.data.emoji || "🥟", // Default emoji jika tidak ada
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

    if (id) {
      fetchProduct();
    }
  }, [id]); // atau [props.productId]

  // Fetch comments ketika produk berhasil diload
  useEffect(() => {
    if (produk?.id) {
      fetchComments(produk.id);
    }
  }, [produk?.id]);

  useEffect(() => {
    if (!showAddSuccess) return undefined;
    const timeoutId = setTimeout(() => {
      setShowAddSuccess(false);
    }, 1600);
    return () => clearTimeout(timeoutId);
  }, [showAddSuccess]);

  useEffect(() => {
    if (location.hash !== "#rating") return;
    if (!produk?.id) return;

    // Delay kecil agar layout sudah final sebelum scroll ke section ulasan/rating.
    const timeoutId = setTimeout(() => {
      ratingSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);

    return () => clearTimeout(timeoutId);
  }, [location.hash, produk?.id]);

  // Tampilkan loading state
  if (loading) {
    return (
      <ProfilLayout
        title="Detail Produk"
        onBack={handleBack}
        rightSlot={cartButton}
        showMenus={false}
        showBottomBar={false}
      >
        <div className="min-h-[calc(100vh-5rem)] bg-pink-5 flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-4xl mb-4">🍳</div>
            <p className="text-pink-6 font-semibold">Memuat produk...</p>
          </div>
        </div>
      </ProfilLayout>
    );
  }

  // Tampilkan error state
  if (error || !produk) {
    return (
      <ProfilLayout
        title="Detail Produk"
        onBack={handleBack}
        rightSlot={cartButton}
        showMenus={false}
        showBottomBar={false}
      >
        <div className="min-h-[calc(100vh-5rem)] bg-pink-5 flex items-center justify-center px-4">
          <div className="text-center p-6 max-w-sm">
            <div className="text-6xl mb-4">😞</div>
            <p className="text-gray-600 mb-4">
              {error || "Produk tidak ditemukan"}
            </p>
            <button
              onClick={handleBack}
              className="bg-pink-6 text-white px-6 py-2 rounded-full"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      </ProfilLayout>
    );
  }

  return (
    <ProfilLayout
      title="Detail Produk"
      onBack={handleBack}
      rightSlot={cartButton}
      showMenus={false}
      showBottomBar={false}
      useDefaultBackground={false}
      contentClassName="bg-white"
    >
      {/* ── Konten scroll ──────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Foto produk */}
        <div className="w-full h-56 lg:h-120 bg-pink-2 flex items-center justify-center text-8xl overflow-hidden">
          {produk.image ? (
            <img
              src={produk.image}
              alt={produk.nama}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <span>{produk.emoji}</span>
          )}
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
            >
              −
            </button>
            <div className="w-10 h-9 rounded-xl bg-pink-6 text-white font-extrabold flex items-center justify-center text-sm">
              {qty}
            </div>
            <button
              onClick={() => setQty((n) => n + 1)}
              className="w-9 h-9 rounded-xl bg-pink-6 text-white text-xl font-bold flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* ── Ulasan ─────────────────────────────────────────── */}
        <div
          id="rating"
          ref={ratingSectionRef}
          className="mx-4 mt-4 bg-pink-1/40 rounded-2xl overflow-hidden"
        >
          {/* Header ulasan */}
          <div className="px-4 py-3 border-b-2 border-pink-6/30">
            <h2 className="text-base font-extrabold text-pink-6">
              Ulasan ({comments.length || 0})
            </h2>
          </div>

          {/* Form tambah komentar */}
          {isLoggedIn ? (
            <div className="px-4 py-4 border-b border-pink-2/50 bg-white">
              <p className="text-xs font-bold text-gray-600 mb-2">
                Berikan komentar Anda
              </p>
              <div className="flex items-center gap-2 mb-2">
                <label className="text-xs text-gray-600">Rating:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setNewCommentRating(star)}
                      className={`text-lg ${
                        star <= newCommentRating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Tulis komentar Anda di sini..."
                className="w-full text-xs p-2 border border-pink-2 rounded-lg resize-none focus:outline-none focus:border-pink-6"
                rows="3"
              />
              <div className="flex gap-2 mt-2 justify-end">
                <button
                  onClick={() => {
                    setNewCommentText("");
                    setNewCommentRating(5);
                  }}
                  className="text-xs font-bold px-3 py-1 rounded-full border border-pink-2 text-text-dark hover:bg-pink-1"
                >
                  Batal
                </button>
                <button
                  onClick={handlePostComment}
                  disabled={submittingComment}
                  className="text-xs font-bold px-3 py-1 rounded-full bg-pink-6 text-white hover:opacity-90 disabled:opacity-60"
                >
                  {submittingComment ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-gray-600 bg-white border-b border-pink-2/50">
              <a
                href="#"
                onClick={() => navigate("/login")}
                className="text-pink-6 font-bold"
              >
                Login
              </a>{" "}
              untuk memberikan komentar.
            </div>
          )}

          {/* Loading komentar */}
          {loadingComments && (
            <div className="px-4 py-4 text-center text-xs text-gray-600">
              Memuat komentar...
            </div>
          )}

          {/* List komentar */}
          {!loadingComments && comments.length === 0 && (
            <div className="px-4 py-4 text-center text-xs text-gray-600">
              Belum ada komentar. Jadilah yang pertama!
            </div>
          )}

          {!loadingComments &&
            comments.map((comment, i) => (
              <div
                key={comment._id}
                className={`px-4 py-4 ${
                  i < comments.length - 1 ? "border-b border-pink-2/50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                      <span className="text-gray-400 text-lg">👤</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-600">
                        {comment.user_id?.nama_user || "User"}
                      </p>
                      <Stars rating={comment.rating || 0} size="text-sm" />
                    </div>
                  </div>
                  {/* Tombol hapus jika pemilik */}
                  {currentUserId === comment.user_id._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-xs text-red-500 hover:text-red-700 font-bold"
                    >
                      Hapus
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed mt-1">
                  {comment.teks_komentar}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* ── Bottom Bar (fixed) ──────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 px-4 py-3 bg-pink-6">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-pink-6 font-bold text-sm py-3.5 rounded-full"
        >
          + Keranjang
        </button>
        <button
          onClick={handlePesanSekarang}
          className="flex-1 flex items-center justify-center gap-2 bg-white text-pink-6 font-bold text-sm py-3.5 rounded-full"
        >
          Pesan Sekarang
        </button>
      </div>

      {showAddSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            background: "rgba(184,68,94,0.35)",
            backdropFilter: "blur(6px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddSuccess(false);
          }}
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-base font-extrabold text-pink-6">
              Berhasil ditambahkan
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Item sudah masuk ke keranjang.
            </p>
            <button
              onClick={() => setShowAddSuccess(false)}
              className="mt-4 w-full bg-pink-6 text-white font-bold text-sm py-3 rounded-full"
            >
              Oke
            </button>
          </div>
        </div>
      )}
    </ProfilLayout>
  );
}
