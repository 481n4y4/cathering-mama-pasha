import Sidebar from "../components/Sidebar";

const infoRows = [
  { label: "Username",      value: "Jeno"                   },
  { label: "Nama",          value: "Lee Jeno"               },
  { label: "Email",         value: "jenowongjowo@gmail.com" },
  { label: "Nomor Telepon", value: "+62 895-1032-4774"      },
  { label: "Jenis Kelamin", value: "Laki-laki"              },
  { label: "Tanggal lahir", value: "** / ** /2000"          },
];

export default function ProfilSaya({ onNavigate }) {
  return (
    <Sidebar
      activeMenu="profil-saya"
      onNavigate={onNavigate}
      title="Profil Saya"
      onBack={() => onNavigate("beranda")}
    >

      {/* ── Top bar DESKTOP ── */}
      <div className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-pink-2/40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("beranda")}
            className="text-text-dark font-bold text-lg"
          >
            ←
          </button>
          <h1 className="text-xl font-extrabold text-text-dark">Profil Saya</h1>
        </div>
        <button className="text-text-dark text-xl">🔍</button>
      </div>

      {/* ── Konten ── */}
      <div className="px-4 lg:px-8 py-6">
        {/* Kartu profil — warna pink muda sesuai Figma */}
        <div
          className="rounded-2xl p-6 lg:p-8 max-w-lg w-full"
          style={{ background: "#FCC7D1" }}
        >
          <h2 className="text-xl lg:text-2xl font-extrabold text-text-dark mb-1">
            Profil Saya
          </h2>
          <p className="text-xs text-text-mid mb-6 leading-relaxed">
            Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun
          </p>

          {/* Baris info */}
          <div className="flex flex-col gap-4">
            {infoRows.map(({ label, value }) => (
              <div key={label} className="flex items-start gap-4">
                {/* Label — rata kanan, lebar tetap */}
                <span
                  className="text-sm text-text-mid shrink-0 text-right"
                  style={{ width: 110 }}
                >
                  {label}
                </span>
                {/* Nilai */}
                <span className="text-sm font-semibold text-text-dark">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </Sidebar>
  );
}