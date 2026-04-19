import Sidebar from "./Sidebar";

export default function ProfilLayout({ activeMenu, onNavigate, children, title, onBack }) {
  return (
    <Sidebar
      activeMenu={activeMenu}
      onNavigate={onNavigate}
      title={title}
      onBack={onBack}
    >
      {children}
    </Sidebar>
  );
}
