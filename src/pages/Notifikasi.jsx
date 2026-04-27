import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfilLayout from "../components/ProfilLayout";
import { getUserNotifications } from "../services/api";

export default function Notifikasi({ onNavigate }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Semua");
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const tabs = ["Semua", "Promo", "Pesan"];
  const filtered =
    activeTab === "Semua"
      ? notifications
      : notifications.filter((n) => n.tipe === activeTab);

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

  return (
    <ProfilLayout
      activeMenu="notifikasi"
      onNavigate={handleNavigate}
      title="Notifikasi"
      onBack={() => handleNavigate("beranda")}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-auto">
          {/* ══ Top bar DESKTOP ══ */}
          <div className="hidden lg:block sticky top-0 z-40 px-3 pt-3 lg:px-8 lg:pt-4 pointer-events-none">
            <div className="pointer-events-auto grid grid-cols-3 items-center h-13 lg:h-16 px-4 bg-white rounded-full border border-pink-2 shadow-nav">
              <div className="flex justify-start">
                <button
                  onClick={() => handleNavigate("beranda")}
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
                  Notifikasi
                </span>
              </div>
              <div className="flex justify-end" />
            </div>
          </div>

          <p className="px-4 lg:px-8 pt-4 pb-2 text-sm text-text-mid shadow-md shadow-pink-800/20">
            Cek pemberitahuan terbaru pesananmu disini
          </p>

          {/* Tab filter */}
          <div className="flex gap-6 px-4 lg:px-8 py-3 border-b border-pink-2/30">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`text-sm font-bold pb-1 relative transition-colors ${
                  activeTab === t
                    ? "text-pink-6"
                    : "text-text-mid hover:text-text-dark"
                }`}
              >
                {t}
                {activeTab === t && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-pink-6 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* List notifikasi */}
          <div className="flex flex-col gap-3 px-4 lg:px-8 py-4 pb-24 lg:pb-6">
            {isLoading && (
              <div className="text-xs text-text-mid">Memuat notifikasi...</div>
            )}
            {!isLoading && filtered.length === 0 && (
              <div className="text-xs text-text-mid">Belum ada notifikasi.</div>
            )}
            {filtered.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-2xl p-4 shadow-card flex gap-3 items-start"
              >
                <div
                  className={`w-10 h-10 rounded-full ${n.warna} shrink-0 mt-0.5`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-extrabold text-text-dark leading-snug">
                      {n.judul}
                    </p>
                    <span className="text-[10px] text-text-mid whitespace-nowrap shrink-0">
                      {n.waktu}
                    </span>
                  </div>
                  <p className="text-xs text-text-mid leading-relaxed">
                    {n.deskripsi}
                  </p>
                  {n.aksi && (
                    <button className="mt-2 text-[10px] font-bold border border-pink-2 text-text-dark px-3 py-1 rounded-full hover:bg-pink-5 active:scale-95 transition-all">
                      {n.aksi}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProfilLayout>
  );
}
