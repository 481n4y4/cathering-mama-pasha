import { useState } from "react";
import logoMamaPasha from "../assets/images/logo-kecil.png";
 
export default function NavbarAfter({ cartCount = 0, onCartClick, onProfilClick }) {
  const [hoverProfile, setHoverProfile] = useState(false);
  const [hoverCart, setHoverCart]       = useState(false);

  return (
    <div className="sticky top-0 z-50 px-3 pt-3 lg:px-8 lg:pt-4 pointer-events-none">
      <nav className="pointer-events-auto grid grid-cols-3 items-center h-13 lg:h-16 px-3 bg-white rounded-full border border-pink-2 shadow-nav">

        {/* ── Kolom 1: Profil (rata kiri) ── */}
        <div className="flex justify-start">
          <button
            onClick={onProfilClick}
            onMouseEnter={() => setHoverProfile(true)}
            onMouseLeave={() => setHoverProfile(false)}
            className={`flex items-center gap-1.5 border border-pink-2 rounded-full pl-1 pr-2.5 py-1 transition-colors duration-200 ${
              hoverProfile ? "bg-pink-1" : "bg-pink-5"
            }`}
          >
            <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-pink-2 to-pink-6 flex items-center justify-center text-white text-[10px] lg:text-xs font-extrabold shrink-0">
              MP
            </div>
            <span className="text-[11px] lg:text-sm font-bold text-text-dark whitespace-nowrap">
              Profil Anda
            </span>
          </button>
        </div>

        {/* ── Kolom 2: Logo (tepat tengah) ── */}
        <div className="flex justify-center">
          <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-pink-2 shrink-0">
            <img
              src={logoMamaPasha}
              alt="Logo Mama Pasha's Treats"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* ── Kolom 3: Keranjang (rata kanan) ── */}
        <div className="flex justify-end">
          <button
            onClick={onCartClick}
            onMouseEnter={() => setHoverCart(true)}
            onMouseLeave={() => setHoverCart(false)}
            className={`flex items-center gap-1.5 border border-pink-2 rounded-full px-2.5 py-1 transition-colors duration-200 ${
              hoverCart ? "bg-pink-1" : "bg-pink-5"
            }`}
          >
            <div className="relative">
              <span className="text-sm lg:text-lg">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full bg-pink-6 text-white text-[8px] font-extrabold flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[11px] lg:text-sm font-bold text-text-dark whitespace-nowrap">
              Keranjang
            </span>
          </button>
        </div>

      </nav>
    </div>
  );
}