import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoMamaPasha from "../assets/images/logo-kecil.png";

export default function NavbarBefore({
  cartCount = 0,
  onCartClick,
  onAuthClick,
}) {
  const [hoverAuth, setHoverAuth] = useState(false);
  const [hoverCart, setHoverCart] = useState(false);
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (onAuthClick) {
      onAuthClick();
      return;
    }
    navigate("/auth");
  };

  const handleCartClick = () => {
    navigate("/auth");
  };

  return (
    <div className="sticky top-0 z-50 px-3 pt-3 lg:px-8 lg:pt-4 pointer-events-none">
      <nav className="pointer-events-auto grid grid-cols-3 items-center h-12 sm:h-13 lg:h-16 px-2 sm:px-3 bg-white rounded-full border border-pink-2 shadow-nav">
        <div className="flex justify-start min-w-0">
          <button
            onClick={handleAuthClick}
            onMouseEnter={() => setHoverAuth(true)}
            onMouseLeave={() => setHoverAuth(false)}
            className={`flex items-center gap-1.5 border border-pink-2 rounded-full pl-1 pr-2 py-1 sm:pr-2.5 transition-colors duration-200 max-w-full ${
              hoverAuth ? "bg-pink-1" : "bg-pink-5"
            }`}
          >
            <div className="w-7 h-7 lg:w-9 lg:h-9 rounded-full bg-linear-to-br from-pink-2 to-pink-6 grid place-items-center text-white text-[10px] lg:text-xs font-extrabold leading-none shrink-0">
              LR
            </div>
            <span className="hidden sm:inline text-[11px] lg:text-sm font-bold text-text-dark whitespace-nowrap truncate">
              Login / Register
            </span>
          </button>
        </div>

        <div className="flex justify-center min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full overflow-hidden border-2 border-pink-2 shrink-0">
            <img
              src={logoMamaPasha}
              alt="Logo Mama Pasha's Treats"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex justify-end min-w-0">
          <button
            onClick={handleCartClick}
            onMouseEnter={() => setHoverCart(true)}
            onMouseLeave={() => setHoverCart(false)}
            className={`flex items-center gap-1.5 border border-pink-2 rounded-full px-2 py-1 sm:px-2.5 transition-colors duration-200 max-w-full ${
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
            <span className="hidden sm:inline text-[11px] lg:text-sm font-bold text-text-dark whitespace-nowrap truncate">
              Keranjang
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
