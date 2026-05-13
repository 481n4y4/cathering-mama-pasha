import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isTokenValid = useMemo(() => token.trim().length > 0, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!isTokenValid) {
      setError("Link reset tidak valid. Minta admin kirim link baru.");
      return;
    }

    if (password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const response = await resetPassword({ token, password });
      setSuccess(response?.message || "Password berhasil direset.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err?.message || err?.error || "Reset gagal. Coba lagi atau minta admin.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-pink-5 relative overflow-hidden">
      <div className="absolute -top-20 -right-16 h-52 w-52 rounded-full bg-pink-2/60 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-pink-1/70 blur-3xl" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl border border-pink-2 bg-white/90 p-8 shadow-nav backdrop-blur">
          <p className="text-pink-3 text-xs font-bold tracking-[0.3em]">
            RESET AKUN
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-text-dark">
            Buat password baru
          </h1>
          <p className="mt-3 text-sm text-text-mid">
            {email
              ? `Reset password untuk ${email}. Masukkan password baru di bawah.`
              : "Masukkan password baru untuk akun kamu."}
          </p>

          {!isTokenValid && (
            <div className="mt-6 rounded-2xl border border-pink-3/40 bg-pink-1/70 px-4 py-3 text-sm text-text-dark">
              Link reset tidak valid. Minta admin kirim link baru lewat WA.
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-4 animate-fade-up"
          >
            <div>
              <label className="text-xs font-semibold text-text-mid">
                Password baru
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={!isTokenValid || loading}
                className="mt-2 w-full rounded-xl border border-pink-2 bg-white px-4 py-3 text-sm text-text-dark shadow-soft focus:border-pink-3"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-text-mid">
                Konfirmasi password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={!isTokenValid || loading}
                className="mt-2 w-full rounded-xl border border-pink-2 bg-white px-4 py-3 text-sm text-text-dark shadow-soft focus:border-pink-3"
                placeholder="Ulangi password"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={!isTokenValid || loading}
              className="w-full rounded-full bg-pink-3 px-5 py-3 text-sm font-bold text-white shadow-button transition hover:bg-pink-2 disabled:cursor-not-allowed disabled:bg-pink-2/60"
            >
              {loading ? "Menyimpan..." : "Simpan Password"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-text-mid">
            <span>Sudah ingat password?</span>
            <Link
              to="/auth"
              className="font-semibold text-pink-3 hover:text-pink-2"
            >
              Kembali ke login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
