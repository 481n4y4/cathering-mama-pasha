import { useNavigate } from "react-router-dom";

export default function NavbarProfile({page}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const navigation = (page) => {
    navigate(`/${page}`);
  }

  return (
    <div className="hidden lg:flex items-center justify-between px-8 py-5 border-b border-pink-2/40 shadow-md">
      <button
        onClick={() => navigation(page)}
        className="text-text-dark text-2xl hover:opacity-80 transition-opacity"
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-bold transition-colors shadow-sm"
      >
        <i className="fa-solid fa-right-from-bracket"></i>
        Logout
      </button>
    </div>
  );
}
