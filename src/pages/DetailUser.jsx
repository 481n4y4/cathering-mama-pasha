import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import NavbarProfile from "../components/NavbarProfile";
import { getUserById } from "../services/api";

const DetailUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserById(id);
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          setError("Gagal memuat detail pengguna.");
        }
      } catch (err) {
        console.error(err);
        setError("Terjadi kesalahan saat mengambil detail pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const formatPhone = (phone) => {
    if (!phone) return "-";
    const phoneStr = phone.toString();
    return phoneStr.startsWith("0") ? phoneStr : `0${phoneStr}`;
  };

  return (
    <div className="flex bg-[#f7c7cd] min-h-screen font-sans">
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <NavbarProfile page="admin/kelola-user" />

        <div className="p-10 flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-8">
            <div className="flex items-center gap-4 border-b pb-6 mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Detail Pengguna
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e96481]"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                {error}
              </div>
            ) : user ? (
              <div className="flex flex-col md:flex-row gap-10">
                {/* Profile Avatar / Left Column */}
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-40 h-40 bg-[#f0d8df] rounded-full flex items-center justify-center text-[#e96481] border-4 border-pink-200 mb-4 shadow-sm">
                    <User className="w-20 h-20" />
                  </div>
                  <span className="bg-[#e4839e] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                    Pelanggan
                  </span>
                </div>

                {/* Info Container / Right Column */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
                  <div className="flex bg-gray-50 p-4 rounded-2xl items-center gap-4">
                    <div className="bg-white p-3 rounded-full text-[#e96481] shadow-sm">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Nama Lengkap
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {user.nama_user}
                      </p>
                    </div>
                  </div>

                  <div className="flex bg-gray-50 p-4 rounded-2xl items-center gap-4">
                    <div className="bg-white p-3 rounded-full text-[#e96481] shadow-sm">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Email
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex bg-gray-50 p-4 rounded-2xl items-center gap-4">
                    <div className="bg-white p-3 rounded-full text-[#e96481] shadow-sm">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        No. Handphone
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {formatPhone(user.no_telepon)}
                      </p>
                    </div>
                  </div>

                  <div className="flex bg-gray-50 p-4 rounded-2xl items-center gap-4">
                    <div className="bg-white p-3 rounded-full text-[#e96481] shadow-sm">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Alamat
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {user.alamat || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex bg-gray-50 p-4 rounded-2xl items-center gap-4">
                    <div className="bg-white p-3 rounded-full text-[#e96481] shadow-sm">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Bergabung Sejak
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex bg-gray-50 p-4 rounded-2xl items-center gap-4">
                    <div className="bg-white p-3 rounded-full text-[#e96481] shadow-sm">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">
                        Pembaruan Terakhir
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatDate(user.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DetailUser;
