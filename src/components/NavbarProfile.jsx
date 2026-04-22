import { useNavigate } from "react-router-dom";

export default function NavbarProfile({ page }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navigation = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="hidden lg:block sticky top-0 z-50 px-3 pt-3 lg:px-8 lg:pt-4 pointer-events-none">
      <nav className="pointer-events-auto grid grid-cols-3 items-center h-13 lg:h-16 px-4 bg-white rounded-full border border-pink-2 shadow-nav">
        <div className="flex justify-start">
          <button
            onClick={() => navigation(page)}
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
            Admin
          </span>
        </div>

        
      </nav>
    </div>
  );
}
