import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar.jsx";
import { MobileTopBar, MobileBottomNav } from "../components/layout/MobileNav.jsx";
import ToastContainer from "../components/common/ToastContainer.jsx";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-arena-bg">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 pb-20 lg:pb-0">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        <MobileBottomNav />
      </div>
      <ToastContainer />
    </div>
  );
}
