import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-pink-5 flex items-center justify-center px-4">
      <section className="max-w-md w-full bg-white border border-pink-2 rounded-2xl shadow-nav p-8 text-center">
        <p className="text-pink-3 text-sm font-bold mb-2">ERROR 404</p>
        <h1 className="text-3xl font-extrabold text-text-dark mb-3">
          Halaman tidak ditemukan
        </h1>
        <p className="text-text-soft text-sm mb-6">
          URL yang kamu masukkan tidak valid atau halaman sudah dipindahkan.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-pink-3 px-5 py-2 text-white font-bold hover:bg-pink-2 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </section>
    </main>
  );
}
