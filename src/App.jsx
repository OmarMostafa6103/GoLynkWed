import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./features/dashboard/Dashboard";
import Users from "./features/users/Users";
import Orders from "./features/orders/Orders";
import Complaints from "./features/complaints/Complaints";
import Reports from "./features/reports/Reports";
import ChatDashboard from "./features/chat/ChatDashboard";
import AdminAccess from "./pages/AdminAccess";
import RoleGuard from "./features/auth/components/RoleGuard";
import { tokenStorage } from "./api/client";
import { Permissions } from "./features/auth/permissions";
import { Roles } from "./features/auth/roles";
import Login from "./features/auth/components/Login";
import Signup from "./features/auth/components/Signup";
import ConfirmEmail from "./features/auth/components/ConfirmEmail";
import ForgotPassword from "./features/auth/components/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // استخدام tokenStorage بدلاً من localStorage/sessionStorage المباشر
  const [token, setToken] = useState(tokenStorage.get() || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [geolocationProps, setGeolocationProps] = useState({
    coords: null,
    isGeolocationAvailable: false,
    isGeolocationEnabled: false,
  });
  const location = useLocation();

  useEffect(() => {
    // تسجيل معلومات المستخدم الحالي للمراجعة
    const currentUser = tokenStorage.getUser();
    if (currentUser) {
      console.log("👤 Current user:", currentUser);
      console.log("🔑 User role:", currentUser.role);

      // التحقق من أن المستخدم مسموح له بالوصول للداش بورد
      if (currentUser.role === Roles.USER) {
        console.log(
          "❌ Regular user attempting admin access - redirecting to login"
        );
        tokenStorage.clearAll();
        setToken("");
      }
    }
  }, [token]);

  // دالة للتحقق من أن المستخدم مسموح له بالوصول للداش بورد
  const isAuthorizedForAdmin = () => {
    const user = tokenStorage.getUser();
    return (
      user && (user.role === Roles.SUPER_ADMIN || user.role === Roles.ADMIN)
    );
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      tokenStorage.set(tokenFromUrl);
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (navigator.geolocation) {
      setGeolocationProps((prev) => ({
        ...prev,
        isGeolocationAvailable: true,
      }));
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocationProps({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            isGeolocationAvailable: true,
            isGeolocationEnabled: true,
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          setGeolocationProps({
            coords: null,
            isGeolocationAvailable: true,
            isGeolocationEnabled: false,
          });
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setGeolocationProps({
        coords: null,
        isGeolocationAvailable: false,
        isGeolocationEnabled: false,
      });
    }
  }, []);

  const handleSetToken = (newToken) => {
    setToken(newToken);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="bg-brand-background min-h-screen text-brand-text">
      <ToastContainer />
      <Routes>
        <Route
          path="/login"
          element={
            token && isAuthorizedForAdmin() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setToken={handleSetToken} />
            )
          }
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard" replace /> : <Signup />}
        />
        <Route
          path="/confirm-email"
          element={token ? <ConfirmEmail /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/forgot-password"
          element={
            token ? <Navigate to="/dashboard" replace /> : <ForgotPassword />
          }
        />
        <Route
          path="*"
          element={
            !token || !isAuthorizedForAdmin() ? (
              <Navigate to="/login" replace />
            ) : (
              <>
                <Navbar setToken={handleSetToken} onMenuClick={toggleSidebar} />
                <div className="flex w-full relative">
                  {/* Mobile overlay */}
                  {isSidebarOpen && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                      onClick={toggleSidebar}
                    />
                  )}

                  {/* Sidebar */}
                  <div
                    className={`
                    fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
                    ${
                      isSidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
                  `}
                  >
                    <Sidebar onClose={toggleSidebar} />
                  </div>

                  {/* Main content */}
                  <div className="w-full lg:w-[calc(100%-240px)] bg-brand-background min-h-screen transition-all duration-300">
                    <Routes>
                      <Route
                        path="/admins"
                        element={
                          <RoleGuard
                            user={tokenStorage.getUser()}
                            permission={Permissions.MANAGE_ADMINS}
                          >
                            <AdminAccess currentUser={tokenStorage.getUser()} />
                          </RoleGuard>
                        }
                      />
                      <Route
                        path="/dashboard"
                        element={<Dashboard token={token} />}
                      />
                      <Route path="/users" element={<Users token={token} />} />
                      <Route
                        path="/orders"
                        element={<Orders token={token} />}
                      />
                      <Route
                        path="/complaints"
                        element={<Complaints token={token} />}
                      />
                      <Route
                        path="/reports"
                        element={
                          <Reports token={token} {...geolocationProps} />
                        }
                      />
                      <Route
                        path="/chat"
                        element={<ChatDashboard token={token} />}
                      />
                      <Route
                        path="*"
                        element={<Navigate to="/dashboard" replace />}
                      />
                    </Routes>
                  </div>
                </div>
              </>
            )
          }
        />
      </Routes>
    </div>
  );
};

export default App;
