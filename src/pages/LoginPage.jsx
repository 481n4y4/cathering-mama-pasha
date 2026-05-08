import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginUser,
  registerUser,
  requestPasswordReset,
} from "../services/api";
import logoMamaPasha from "../assets/images/logo-kecil.png";
import loginIllustration from "../assets/images/image-login.png";

const ENABLE_FORGOT_PASSWORD = false;

const LoginForm = () => {
  const [activeTab, setActiveTab] = useState("masuk");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  const [formData, setFormData] = useState({
    // Login fields
    email: "",
    password: "",
    rememberPassword: false,

    // Register fields
    nama: "",
    emailRegister: "",
    passwordRegister: "",
    noTelepon: "",
    alamat: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const openResetModal = () => {
    setResetEmail(formData.email);
    setResetSuccess("");
    setError("");
    setShowResetModal(true);
  };

  const submitResetPassword = async (e) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      setError("Masukkan email terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setResetSuccess("");

    try {
      const data = await requestPasswordReset({ email: resetEmail });
      const successMessage =
        data?.message ||
        `Permintaan reset password untuk ${resetEmail} sudah dikirim. Silakan cek email Anda.`;

      setResetSuccess(successMessage);
      alert(successMessage);
      setShowResetModal(false);
    } catch (err) {
      setError(
        err?.message ||
          err?.error ||
          "Gagal mengirim email reset password. Pastikan backend mendukung endpoint forgot-password.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      console.log("Login request:", loginData);

      const data = await loginUser(loginData);

      console.log("Login response:", data);
      console.log("Password:", formData.password);

      if (data.success || data.data) {
        const token = data?.data?.token || data?.token;
        const user = data?.data?.user || data?.user;
        const userId = user?.id || user?._id;

        if (token) {
          localStorage.setItem("token", token);
        }
        if (user) {
          const storedUser = localStorage.getItem("user");
          let mergedUser = user;
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser);
              const sameUser =
                String(parsed?.id ?? parsed?._id ?? "") ===
                  String(user?.id ?? user?._id ?? "") &&
                String(parsed?.role ?? "") === String(user?.role ?? "");

              if (sameUser) {
                mergedUser = {
                  ...user,
                  foto_profile: parsed?.foto_profile ?? user?.foto_profile,
                  photo: parsed?.photo ?? user?.photo,
                  nama_user: parsed?.nama_user ?? user?.nama_user,
                  nama: parsed?.nama ?? user?.nama,
                  no_telepon: parsed?.no_telepon ?? user?.no_telepon,
                  alamat: parsed?.alamat ?? user?.alamat,
                };
              }
            } catch {
              mergedUser = user;
            }
          }
          localStorage.setItem("user", JSON.stringify(mergedUser));
        }
        if (userId) {
          localStorage.setItem("userId", userId);
        }

        // Memancarkan event agar navbar dashboard langsung update
        window.dispatchEvent(new Event("auth-changed"));

        alert("Login berhasil!");
        navigate("/");
      } else {
        setError(
          data.message ||
            data.error ||
            "Login gagal. Periksa email dan password Anda.",
        );
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err?.message ||
          err?.error ||
          "Terjadi kesalahan. Periksa koneksi internet Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate password confirmation
    const confirmPasswordInput = document.querySelector(
      'input[name="confirmPassword"]',
    );
    if (
      confirmPasswordInput &&
      confirmPasswordInput.value !== formData.passwordRegister
    ) {
      setError("Password tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      const registerData = {
        nama_user: formData.nama,
        email: formData.emailRegister,
        password: formData.passwordRegister,
        no_telepon: parseInt(formData.noTelepon),
        alamat: formData.alamat,
      };

      console.log("Register request:", registerData);

      const data = await registerUser(registerData);

      console.log("Register response:", data);

      if (data.success || data.data) {
        alert("Pendaftaran berhasil! Silakan login.");
        // Reset register form
        setFormData((prev) => ({
          ...prev,
          nama: "",
          emailRegister: "",
          passwordRegister: "",
          noTelepon: "",
          alamat: "",
        }));
        // Switch to login tab
        setActiveTab("masuk");
        // Clear any confirm password field
        if (confirmPasswordInput) {
          confirmPasswordInput.value = "";
        }
      } else {
        setError(
          data.message || data.error || "Pendaftaran gagal. Periksa data Anda.",
        );
      }
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err?.message ||
          err?.error ||
          "Terjadi kesalahan. Periksa koneksi internet Anda.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <h1 className="font-['Dancing_Script'] text-5xl md:text-6xl text-[#B8445E] mb-2">
        Selamat Datang
      </h1>
      <p className="text-[#DE8C9C] mb-8">
        {activeTab === "masuk"
          ? "Silakan masuk ke akun Anda"
          : "Buat akun baru untuk bergabung"}
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Tab Switch */}
      <div className="flex bg-white p-1 rounded-full mb-8 shadow-soft">
        <button
          className={`flex-1 py-3 px-6 rounded-full text-center transition-all duration-300 ${
            activeTab === "masuk"
              ? "bg-[#B8445E] text-white shadow-button"
              : "text-[#E47990] hover:text-[#B8445E]"
          }`}
          onClick={() => {
            setActiveTab("masuk");
            setError("");
          }}
        >
          Masuk
        </button>
        <button
          className={`flex-1 py-3 px-6 rounded-full text-center transition-all duration-300 ${
            activeTab === "daftar"
              ? "bg-[#B8445E] text-white shadow-button"
              : "text-[#E47990] hover:text-[#B8445E]"
          }`}
          onClick={() => {
            setActiveTab("daftar");
            setError("");
          }}
        >
          Daftar
        </button>
      </div>

      {/* Conditional Form - Login or Register */}
      {activeTab === "masuk" ? (
        /* Login Form */
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Kata Sandi"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              disabled={loading}
            />
          </div>

          {/* Remember Password Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberPassword"
              id="rememberPassword"
              checked={formData.rememberPassword}
              onChange={handleInputChange}
              className="w-5 h-5 text-[#B8445E] rounded border-[#DE8C9C] focus:ring-[#E47990]"
              disabled={loading}
            />
            <label htmlFor="rememberPassword" className="ml-2 text-[#E47990]">
              Simpan kata sandi
            </label>
          </div>

          {/* Forgot Password Link */}
          {ENABLE_FORGOT_PASSWORD && (
            <div className="text-right">
              <button
                type="button"
                onClick={openResetModal}
                className="text-sm text-[#B8445E] hover:text-[#E47990] transition-colors"
              >
                Lupa kata sandi?
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#B8445E] text-white font-semibold py-4 px-6 rounded-full shadow-button hover:bg-[#E47990] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      ) : (
        /* Register Form */
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Nama Lengkap */}
          <div>
            <input
              type="text"
              name="nama"
              placeholder="Nama Lengkap"
              value={formData.nama}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="emailRegister"
              placeholder="Email"
              value={formData.emailRegister}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              name="passwordRegister"
              placeholder="Kata Sandi"
              value={formData.passwordRegister}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              minLength="6"
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Konfirmasi Kata Sandi"
              onChange={(e) => {
                if (e.target.value !== formData.passwordRegister) {
                  e.target.setCustomValidity("Password tidak cocok!");
                } else {
                  e.target.setCustomValidity("");
                }
              }}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              disabled={loading}
            />
          </div>

          {/* No Telepon */}
          <div>
            <input
              type="tel"
              name="noTelepon"
              placeholder="No. Telepon"
              value={formData.noTelepon}
              onChange={handleInputChange}
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-full focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all placeholder-[#E47990] text-[#B8445E]"
              required
              pattern="[0-9]{10,13}"
              title="Masukkan nomor telepon yang valid (10-13 digit)"
              disabled={loading}
            />
          </div>

          {/* Alamat */}
          <div>
            <textarea
              name="alamat"
              placeholder="Alamat Lengkap"
              value={formData.alamat}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-6 py-4 bg-[#F8D8DE] rounded-3xl focus:outline-none focus:ring-2 focus:ring-[#DE8C9C] transition-all resize-none placeholder-[#E47990] text-[#B8445E]"
              required
              disabled={loading}
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              className="w-5 h-5 mt-1 text-[#B8445E] rounded border-[#DE8C9C] focus:ring-[#E47990]"
              required
              disabled={loading}
            />
            <label htmlFor="terms" className="ml-2 text-sm text-[#E47990]">
              Saya menyetujui{" "}
              <a
                href="#"
                className="text-[#B8445E] hover:text-[#E47990] transition-colors"
              >
                Syarat dan Ketentuan
              </a>{" "}
              serta{" "}
              <a
                href="#"
                className="text-[#B8445E] hover:text-[#E47990] transition-colors"
              >
                Kebijakan Privasi
              </a>
            </label>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-[#B8445E] text-white font-semibold py-4 px-6 rounded-full shadow-button hover:bg-[#E47990] transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none mt-6"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>
      )}

      {ENABLE_FORGOT_PASSWORD && showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-[#FCC7D1] p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-[#B8445E] mb-2">
              Reset Kata Sandi
            </h2>
            <p className="text-sm text-[#E47990] mb-5">
              Masukkan email akun Anda untuk menerima petunjuk reset password.
            </p>

            {resetSuccess && (
              <div className="mb-4 rounded-2xl border border-green-300 bg-green-100 p-3 text-sm text-green-800">
                {resetSuccess}
              </div>
            )}

            <form onSubmit={submitResetPassword} className="space-y-4">
              <input
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-full bg-[#F8D8DE] px-6 py-4 text-[#B8445E] placeholder-[#E47990] focus:outline-none focus:ring-2 focus:ring-[#DE8C9C]"
                required
                disabled={loading}
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 rounded-full border border-[#B8445E] px-6 py-3 text-[#B8445E] transition-colors hover:bg-[#F8D8DE]"
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[#B8445E] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#E47990]"
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Kirim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

function LoginPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#F8D8DE]">
      {/* Left Section - Form */}
      <div className="bg-[#FCC7D1] p-8 md:p-16 lg:p-20 flex items-center justify-center">
        <div className="w-full flex flex-col items-center">
          <img
            src={logoMamaPasha}
            alt="Logo Dapur Mama Pasha"
            className="w-24 md:w-28 mb-6 object-contain"
          />
          <LoginForm />
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div className="bg-[#F0B3C5] hidden md:flex items-center justify-center p-8">
        <div className="max-w-112.5 lg:max-w-137.5 w-full">
          <img
            src={loginIllustration}
            alt="Chef cooking illustration"
            className="w-full h-auto object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
