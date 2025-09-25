import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Navigate, Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useEffect, useState } from "react";
import api from "../libs/axios"; // axios instance withCredentials: true
import getCsrfToken from "../libs/getCsrfToken";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen xl:flex">
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Lấy CSRF cookie (bắt buộc với Laravel Sanctum)
        await getCsrfToken();

        // Gọi API /me để kiểm tra user đã login chưa
        await api.get("/me");
        setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  return authenticated ? (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default AppLayout;
