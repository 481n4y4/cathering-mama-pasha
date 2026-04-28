import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilLayout from "../components/ProfilLayout";
import { getUserOrders } from "../services/api";

const formatRp = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

const formatPhone = (phone) => {
  if (!phone) return "-";
  const phoneStr = phone.toString();
  return phoneStr.startsWith("0") ? phoneStr : `0${phoneStr}`;
};

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

const normalizeStatus = (status) => {
  if (!status) return "Diproses";
  if (status === "Pending") return "Diproses";
  if (status === "Dalam Pengiriman" || status === "Sedang diantar") {
    return "Diproses";
  }
  if (status === "Sedang diproses") return "Diproses";
  return status;
};

function PesananAktif({ orders }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="text-8xl mb-4 opacity-60">🛍️</div>
      <p className="text-text-mid text-sm text-center leading-relaxed">
        Belum ada pesanan aktif.
        <br />
        Yuk pesan snack favoritmu!
      </p>
    </div>
  );
}

const statusToneMap = {
  Diproses: "bg-[#fde28a] text-[#85712e]",
  Selesai: "bg-[#6cc765] text-white",
};

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;

  const statusTone =
    statusToneMap[order.status] || "bg-[#fdeff2] text-[#de6a84]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4"
      style={{
        background: "rgba(184,68,94,0.35)",
        backdropFilter: "blur(6px)",
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl max-h-[calc(100vh-1.5rem)] sm:max-h-[calc(100vh-2rem)] overflow-y-auto rounded-4xl bg-[#fff9fa] shadow-2xl border border-white/70">
        <div className="relative overflow-hidden bg-linear-to-r from-[#b8445e] to-[#e47990] px-5 sm:px-6 py-5 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            aria-label="Tutup detail pesanan"
          >
            ✕
          </button>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-white/85">
            Detail Pesanan Aktif
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold leading-tight">
                {order.nama}
              </h2>
              <p className="mt-1 text-sm text-white/85">Order ID: {order.id}</p>
              <p className="mt-1 text-sm text-white/85">{order.tanggal}</p>
            </div>
            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-sm font-extrabold ${statusTone}`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-4 sm:space-y-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-3xl border border-[#f6dbe0] bg-white p-4 sm:p-5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b8445e] mb-4">
                Informasi Pemesan
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#9c6b76]">Nama</span>
                  <span className="font-bold text-[#4a2b33] text-right">
                    {order.namaPemesan || order.nama || "-"}
                  </span>
                </div>
                <div className="h-px bg-[#f5e2e6]" />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#9c6b76]">No. Telepon</span>
                  <span className="font-bold text-[#4a2b33] text-right">
                    {formatPhone(order.noTelepon)}
                  </span>
                </div>
                <div className="h-px bg-[#f5e2e6]" />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#9c6b76]">Alamat</span>
                  <span className="max-w-[60%] text-right font-bold text-[#4a2b33] whitespace-pre-line">
                    {order.alamat || "-"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-[#f6dbe0] bg-white p-4 sm:p-5 shadow-sm">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b8445e] mb-4">
                Rincian Pesanan
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#9c6b76]">Metode Pembayaran</span>
                  <span className="font-bold text-[#4a2b33] text-right">
                    {order.pembayaran}
                  </span>
                </div>
                <div className="h-px bg-[#f5e2e6]" />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#9c6b76]">Jumlah Item</span>
                  <span className="font-bold text-[#4a2b33] text-right">
                    {order.jumlah} item
                  </span>
                </div>
                <div className="h-px bg-[#f5e2e6]" />
                <div className="flex items-start justify-between gap-4">
                  <span className="text-[#9c6b76]">Total</span>
                  <span className="font-extrabold text-[#b8445e] text-right text-base">
                    {formatRp(order.total)}
                  </span>
                </div>
                <div className="h-px bg-[#f5e2e6]" />
                <div>
                  <p className="text-[#9c6b76] mb-2">Catatan</p>
                  <div className="rounded-2xl bg-[#fff7f8] border border-[#f5e2e6] p-3 text-[#4a2b33] whitespace-pre-line leading-relaxed">
                    {order.catatan || "Tidak ada catatan."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-[#f6dbe0] bg-white p-4 sm:p-5 shadow-sm">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#b8445e] mb-4">
              Item Pesanan
            </p>
            {order.items?.length ? (
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-2xl border border-[#f5e2e6] bg-[#fff7f8] p-3"
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
                      {item.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-[#4a2b33] leading-tight">
                        {item.name}
                      </p>
                      <p className="text-xs text-[#9c6b76] mt-1">
                        {item.qty} x {formatRp(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-[#9c6b76]">Subtotal</p>
                      <p className="font-extrabold text-[#b8445e]">
                        {formatRp(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-[#fff7f8] border border-[#f5e2e6] p-4 text-sm text-[#9c6b76]">
                Detail item belum tersedia.
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-1 pb-1">
            <button
              onClick={onClose}
              className="rounded-full border border-[#f0ccd3] bg-white px-5 py-3 text-sm font-bold text-[#b8445e] hover:bg-[#fff2f5] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RiwayatPesanan({ orders, onDetail }) {
  const navigate = useNavigate();
  const filtered = orders;

  return (
    <div className="px-4 lg:px-8 py-5">
      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6">
          <div className="text-6xl mb-3 opacity-60">📭</div>
          <p className="text-text-mid text-sm text-center leading-relaxed">
            Belum ada riwayat pesanan.
            <br />
            Yuk mulai pesan menu favoritmu!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((p, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-card">
              {/* Atas */}
              <div className="flex gap-3 mb-3">
                <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-pink-5 flex items-center justify-center text-3xl shrink-0">
                  {p.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-extrabold text-text-dark text-sm lg:text-base">
                      {p.nama}
                    </p>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-green-500 text-white shrink-0">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-mid mt-0.5">{p.tanggal}</p>
                  <p className="text-xs text-text-mid">Order ID: {p.id}</p>
                </div>
              </div>

              <div className="border-t border-pink-1 my-3" />

              {/* Bawah */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs text-text-mid">{p.jumlah} Item:</p>
                  <p className="text-[11px] font-extrabold text-text-dark tracking-wide mt-0.5">
                    💳 {p.pembayaran}
                  </p>
                </div>
                <div className="lg:text-right">
                  <p className="text-xs text-text-mid">
                    Total{" "}
                    <span className="font-extrabold text-text-dark">
                      {formatRp(p.total)}
                    </span>
                  </p>
                  <p className="text-[10px] text-text-mid">{p.alamat}</p>
                </div>
                {/* Tombol aksi */}
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => onDetail?.(p)}
                    className="text-[11px] font-bold border border-pink-2 text-text-dark px-3 py-1.5 rounded-full hover:bg-pink-5 active:scale-95 transition-all"
                  >
                    Lihat Detail
                  </button>
                  <button
                    onClick={() => navigate(`/produk/${p.productId}`)}
                    className="text-[11px] font-bold border border-pink-2 text-text-dark px-3 py-1.5 rounded-full hover:bg-pink-5 active:scale-95 transition-all"
                  >
                    Pesan Lagi
                  </button>
                  <button
                    onClick={() => navigate(`/produk/${p.productId}`)}
                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full active:scale-95 transition-all flex items-center gap-1 ${
                      p.rated
                        ? "border border-yellow-400 text-yellow-600 bg-yellow-50"
                        : "border border-pink-2 text-text-dark hover:bg-pink-5"
                    }`}
                  >
                    {p.rated && <span>⭐</span>} Beri Rating
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PesananSaya({ onNavigate }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("aktif");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileUser, setProfileUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const syncProfile = () => {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) {
        setProfileUser(null);
        return;
      }

      try {
        setProfileUser(JSON.parse(rawUser));
      } catch {
        setProfileUser(null);
      }
    };

    syncProfile();
    window.addEventListener("auth-changed", syncProfile);
    window.addEventListener("storage", syncProfile);
    window.addEventListener("focus", syncProfile);

    return () => {
      window.removeEventListener("auth-changed", syncProfile);
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("focus", syncProfile);
    };
  }, []);

  const fetchOrders = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError("");
    try {
      const response = await getUserOrders();
      setOrders(response?.data || []);
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "Gagal memuat pesanan.";
      setError(message);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchOrders(true);

    const intervalId = setInterval(() => {
      fetchOrders(false);
    }, 30000);

    const handleFocus = () => fetchOrders(false);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchOrders(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchOrders]);

  const mappedOrders = useMemo(
    () =>
      orders.map((order) => {
        const firstItem = order.items?.[0];
        const product = firstItem?.produk || {};
        const detailItems = (order.items || []).map((item, index) => {
          const itemProduct = item?.produk || {};
          const qtyItem = item?.kuantitas || 0;
          const price = itemProduct?.harga || 0;
          return {
            id: item?._id || itemProduct?._id || `${order._id}-${index}`,
            name: itemProduct?.nama_produk || "Produk",
            emoji: itemProduct?.emoji || "🍱",
            qty: qtyItem,
            price,
            subtotal: price * qtyItem,
          };
        });
        const qty =
          order.jumlah_produk ||
          detailItems.reduce((sum, item) => sum + item.qty, 0) ||
          0;
        const normalizedStatus = normalizeStatus(order.status);
        return {
          id: order._id,
          nama: product.nama_produk || "Pesanan",
          namaPemesan:
            order.user?.nama_user ||
            order.user?.nama ||
            profileUser?.nama_user ||
            profileUser?.nama ||
            "-",
          noTelepon:
            order.user?.no_telepon || profileUser?.no_telepon || "",
          alamat: order.user?.alamat || profileUser?.alamat || "-",
          emoji: product.emoji || "🍱",
          status: normalizedStatus,
          tanggal: formatTanggal(order.tanggal_pengiriman || order.createdAt),
          pembayaran: order.metode_pembayaran || "-",
          total: Number(order.total_harga || 0),
          catatan: order.pesan || order.catatan || "Tidak ada catatan.",
          jumlah: qty,
          productId: product._id,
          items: detailItems,
          rated: false,
        };
      }),
    [orders, profileUser],
  );

  const activeOrders = useMemo(
    () => mappedOrders.filter((order) => order.status !== "Selesai"),
    [mappedOrders],
  );

  const historyOrders = useMemo(
    () => mappedOrders.filter((order) => order.status === "Selesai"),
    [mappedOrders],
  );

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

  return (
    <ProfilLayout
      activeMenu="pesanan-saya"
      onNavigate={handleNavigate}
      title="Pesanan Saya"
      onBack={() => handleNavigate("beranda")}
    >
      {/* Tab */}
      <div className="flex shadow-md shadow-pink-800/20 bg-white/20">
        {[
          { key: "aktif", label: "Pesanan Aktif" },
          { key: "riwayat", label: "Riwayat Pesanan" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-3.5 text-sm font-bold transition-colors relative ${
              activeTab === key
                ? "text-pink-6"
                : "text-text-mid hover:text-text-dark"
            }`}
          >
            {label}
            {activeTab === key && (
              <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-pink-6 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-sm text-text-mid">
          Memuat pesanan...
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-16 text-sm text-red-500 font-semibold">
          {error}
        </div>
      ) : activeTab === "aktif" ? (
        activeOrders.length === 0 ? (
          <PesananAktif orders={activeOrders} />
        ) : (
          <RiwayatPesanan orders={activeOrders} onDetail={setSelectedOrder} />
        )
      ) : historyOrders.length === 0 ? (
        <RiwayatPesanan orders={historyOrders} />
      ) : (
        <RiwayatPesanan orders={historyOrders} onDetail={setSelectedOrder} />
      )}

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </ProfilLayout>
  );
}