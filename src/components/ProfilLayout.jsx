import Sidebar from "./Sidebar";

export default function ProfilLayout({
  activeMenu,
  onNavigate,
  children,
  title,
  onBack,
  rightSlot,
  showMenus,
  showBottomBar,
}) {
  return (
    <Sidebar
      activeMenu={activeMenu}
      onNavigate={onNavigate}
      title={title}
      onBack={onBack}
      rightSlot={rightSlot}
      showMenus={showMenus}
      showBottomBar={showBottomBar}
    >
      {children}
    </Sidebar>
  );
}