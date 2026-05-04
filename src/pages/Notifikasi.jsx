import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilLayout from "../components/ProfilLayout";
import { closeNotification, getUserNotifications } from "../services/api";

export default function Notifikasi({ onNavigate }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await getUserNotifications();
        if (!isMounted) {
          return;
        }

        const mapped = (response?.data || []).map((notif) => {
          const type = notif.type === "status" ? "Pesan" : "Promo";
          return {
            id: notif._id,
            judul: notif.title,
            deskripsi: notif.message,
            waktu: new Date(notif.createdAt).toLocaleString("id-ID"),
            warna: type === "Pesan" ? "bg-green-500" : "bg-orange-400",
            tipe: type,
            aksi: null,
          };
        });

        setNotifications(mapped);
      } catch (error) {
        console.error("Failed to load user notifications:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleDeleteNotification = async (id) => {
    const confirmed = window.confirm("Hapus notifikasi ini?");
    if (!confirmed) return;

    setDeletingId(id);
    try {
      await closeNotification(id);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
      alert("Gagal menghapus notifikasi. Silakan coba lagi.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <ProfilLayout
      activeMenu="notifikasi"
      onNavigate={handleNavigate}
      title="Notifikasi"
      onBack={() => handleNavigate("beranda")}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          <p className="px-4 lg:px-8 pt-4 pb-2 text-sm text-text-mid shadow-md shadow-pink-800/20">
            Cek pemberitahuan terbaru pesananmu disini
          </p>

          {/* List notifikasi */}
          <div className="flex flex-col gap-3 px-4 lg:px-8 py-4 pb-24 lg:pb-6">
            {isLoading && (
              <div className="text-xs text-text-mid">Memuat notifikasi...</div>
            )}
            {!isLoading && notifications.length === 0 && (
              <div className="text-xs text-text-mid">Belum ada notifikasi.</div>
            )}
            {notifications.map((n) => (
              <div
                key={n.id}
                className="relative bg-white rounded-2xl p-4 shadow-card flex gap-3 items-start"
              >
                <button
                  type="button"
                  onClick={() => handleDeleteNotification(n.id)}
                  disabled={deletingId === n.id}
                  className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-pink-2 bg-pink-5 text-pink-6 text-sm font-extrabold transition-all hover:bg-pink-1 disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Hapus notifikasi"
                >
                  {deletingId === n.id ? "..." : "×"}
                </button>
                <div
                  className={`w-10 h-10 rounded-full ${n.warna} shrink-0 mt-0.5`}
                />
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-text-dark leading-snug wrap-break-word">
                        {n.judul}
                      </p>
                      <span className="text-[10px] text-text-mid whitespace-nowrap shrink-0">
                        {n.waktu}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-text-mid leading-relaxed">
                    {n.deskripsi}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProfilLayout>
  );
}
