import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilLayout from "../components/ProfilLayout";
import { getCart } from "../services/api";

const formatRp = (value) => `Rp ${value.toLocaleString("id-ID")}`;

const emojiByCategory = {
  Makanan: "🍛",
  Minuman: "🥤",
  Snack: "🍢",
  Dessert: "🍰",
};

export default function Keranjang({ onNavigate }) {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleNavigate = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (path === "beranda") {
      navigate("/");
    } else if (path === "profil-saya") {
      navigate("/profil");
    } else {
      navigate(`/${path}`);
    }
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await getCart();
        const cartItems = response?.data?.cart?.items || [];

        const mappedItems = cartItems.map((item) => {
          const product = item.produk || {};
          const category = product.kategori || "";
          return {
            id: item._id || product._id,
            name: product.nama_produk || "Produk",
            price: product.harga || 0,
            qty: item.kuantitas || 0,
            emoji: emojiByCategory[category] || "🍱",
          };
        });

        setItems(mappedItems);
        setSelectedIds(mappedItems.map((item) => item.id));
      } catch (err) {
        console.error(err);
        setError("Gagal memuat keranjang.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const toggleItem = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  };

  const toggleAll = () => {
    setSelectedIds((current) =>
      current.length === items.length ? [] : items.map((item) => item.id),
    );
  };

  const totalSelected = items
    .filter((item) => selectedIds.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.qty, 0);

  const selectedCount = selectedIds.length;

  const handleCheckout = () => {
    if (selectedCount === 0) {
      alert("Pilih minimal satu item untuk checkout.");
      return;
    }
    navigate("/buat-pesanan", { state: { selectedIds } });
  };

  return (
    <ProfilLayout
      activeMenu="keranjang"
      onNavigate={handleNavigate}
      title="Keranjang"
      onBack={() => handleNavigate("beranda")}
    >
      <div className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-pink-2/40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate("beranda")}
            className="text-text-dark font-bold text-xl flex items-center justify-center w-10 h-10 rounded-full transition-opacity"
            aria-label="Kembali"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <h1 className="text-xl font-extrabold text-text-dark">Keranjang</h1>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-5 space-y-5">
        <div className="rounded-3xl bg-white/40 border border-pink-100 p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-text-dark">
                Pilih item untuk checkout
              </p>
              <p className="text-xs text-text-mid mt-1">
                Centang item yang ingin kamu bayar pada satu transaksi.
              </p>
            </div>
            <button
              onClick={toggleAll}
              disabled={items.length === 0}
              className="text-[12px] font-bold text-pink-6 px-3 py-2 rounded-full border border-pink-200 hover:bg-pink-5 transition"
            >
              {selectedCount === items.length
                ? "Batal Pilih Semua"
                : "Pilih Semua"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-2xl p-6 shadow-card text-sm text-text-mid">
              Memuat keranjang...
            </div>
          ) : error ? (
            <div className="bg-white rounded-2xl p-6 shadow-card text-sm text-red-500 font-semibold">
              {error}
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 shadow-card text-sm text-text-mid">
              Keranjang masih kosong.
            </div>
          ) : (
            items.map((item) => {
              const isChecked = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 rounded-3xl p-4 shadow-card bg-white border ${
                    isChecked ? "border-pink-300" : "border-pink-100"
                  }`}
                >
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 rounded border-pink-300 text-pink-6 accent-pink-6"
                    />
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-3xl bg-pink-5 flex items-center justify-center text-3xl">
                      {item.emoji}
                    </div>
                  </label>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-extrabold text-text-dark text-sm lg:text-base">
                        {item.name}
                      </p>
                      <p className="text-sm font-bold text-pink-6">
                        {formatRp(item.price)}
                      </p>
                    </div>
                    <p className="text-xs text-text-mid mt-1">
                      Jumlah: {item.qty}
                    </p>
                    <p className="text-xs text-text-mid mt-2">
                      Total:{" "}
                      <span className="font-semibold text-text-dark">
                        {formatRp(item.qty * item.price)}
                      </span>
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="hidden lg:flex justify-end">
          <button
            onClick={handleCheckout}
            className="bg-pink-6 text-white text-sm font-bold px-6 py-4 rounded-full shadow-lg shadow-pink-700/20 hover:bg-pink-5 transition-all"
          >
            Checkout {selectedCount > 0 ? `(${selectedCount})` : ""}
          </button>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-20 left-0 right-0 z-40 bg-white/95 border-t border-pink-200 px-4 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-text-mid">Total</p>
            <p className="font-bold text-text-dark">
              {formatRp(totalSelected)}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            className="bg-pink-6 text-white text-sm font-bold px-5 py-3 rounded-full shadow-lg shadow-pink-700/20 w-full max-w-44"
          >
            Checkout
          </button>
        </div>
      </div>

      <div className="lg:hidden h-28" />
    </ProfilLayout>
  );
}
