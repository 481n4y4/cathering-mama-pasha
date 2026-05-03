import React, { useEffect, useMemo, useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";
import { FileText, MessageCircle, X } from "lucide-react";
import { closeNotification, getAdminNotifications } from "../services/api";

const NotifAdmin = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const response = await getAdminNotifications();
        if (isMounted) {
          setNotifications(response?.data || []);
        }
      } catch (error) {
        console.error("Failed to load admin notifications:", error);
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

  const notifData = useMemo(() => {
    return notifications.map((notif) => {
      const isComment = notif.type === "comment";
      return {
        id: notif._id,
        title: notif.title,
        desc: notif.message,
        time: new Date(notif.createdAt).toLocaleString("id-ID"),
        iconBg: isComment ? "bg-[#f6c352]" : "bg-[#4da9f6]",
        Icon: isComment ? MessageCircle : FileText,
        isRead: notif.is_read,
      };
    });
  }, [notifications]);

  const filteredData = notifData;

  const handleClose = async (id) => {
    try {
      await closeNotification(id);
      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to close notification:", error);
    }
  };

  return (
    <SidebarAdmin title="Notifikasi">
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Navbar */}
        <NavbarProfile backTo="/" />

        <div className="px-4 sm:px-6 lg:px-10 mt-4 sm:mt-6" />

        {/* Notifications List */}
        <div className="px-4 sm:px-6 lg:px-10 pb-10 flex-1 overflow-auto flex flex-col gap-4 sm:gap-5">
          {isLoading && (
            <div className="text-gray-700 font-medium">
              Memuat notifikasi...
            </div>
          )}
          {!isLoading && filteredData.length === 0 && (
            <div className="text-gray-700 font-medium">
              Belum ada notifikasi.
            </div>
          )}
          {filteredData.map((notif) => (
            <div
              key={notif.id}
              className="bg-[#f4d8de] rounded-3xl p-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm border border-white/40 relative hover:bg-[#eed0d5] transition-colors"
            >
              {/* Icon Wrap */}
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full flex items-center justify-center mt-1 sm:mt-0 ${notif.iconBg} shadow-sm border border-white/20`}
              >
                <notif.Icon className="w-7 h-7 sm:w-8 sm:h-8 text-black" strokeWidth={2} />
              </div>

              {/* Content */}
              <div className="flex-1 mt-1 sm:mt-0">
                <h3 className="text-lg sm:text-xl font-bold text-black mb-1.5">
                  {notif.title}
                </h3>
                <p className="text-gray-800 font-medium text-sm sm:text-[15px]">
                  {notif.desc}
                </p>
              </div>

              {/* Time */}
              <div className="relative sm:absolute sm:top-6 sm:right-6 self-start">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium text-xs sm:text-sm">
                    {notif.time}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleClose(notif.id)}
                    className="p-1 rounded-full hover:bg-white/70 transition-colors"
                    aria-label="Tutup notifikasi"
                  >
                    <X className="w-4 h-4 text-gray-700" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </SidebarAdmin>
  );
};

export default NotifAdmin;
