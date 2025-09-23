import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { assets } from "../assets/assets";
import { tokenStorage } from "../api/client";
import { can } from "../features/auth/permissions";
import Perms from "../features/auth/permissions";

const Sidebar = ({ onClose }) => {
  const { t } = useTranslation();

  const user = tokenStorage.getUser();

  return (
    <aside className="w-60 min-h-screen bg-[#FFE6DE] flex flex-col items-center py-6 px-2 relative">
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Close menu"
      >
        <i className="fas fa-times text-lg"></i>
      </button>

      {/* Logo */}
      <div className="mb-8 w-full flex justify-center">
        <img
          src={assets.logo || "/src/assets/logo.png"}
          alt="GoLynk Logo"
          className="w-20 h-16 sm:w-28 sm:h-20 object-contain"
        />
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-3 sm:gap-4 w-full">
        {can(user, Perms.VIEW_DASHBOARD) && (
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 ${
                isActive ? "bg-[#FF6B00] text-white" : "bg-white text-[#FF6B00]"
              } `
            }
          >
            <span className="text-base sm:text-lg">
              <i className="fa-solid fa-gauge"></i>
            </span>
            <span className="flex-1 text-right">{t("sidebar.dashboard")}</span>
          </NavLink>
        )}
        {can(user, Perms.VIEW_USERS) && (
          <NavLink
            to="/users"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 ${
                isActive ? "bg-[#FF6B00] text-white" : "bg-white text-[#FF6B00]"
              } `
            }
          >
            <span className="text-base sm:text-lg">
              <i className="fa-solid fa-users"></i>
            </span>
            <span className="flex-1 text-right">{t("sidebar.users")}</span>
          </NavLink>
        )}
        {can(user, Perms.VIEW_ORDERS) && (
          <NavLink
            to="/orders"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 ${
                isActive ? "bg-[#FF6B00] text-white" : "bg-white text-[#FF6B00]"
              } `
            }
          >
            <span className="text-base sm:text-lg">
              <i className="fa-solid fa-clipboard-list"></i>
            </span>
            <span className="flex-1 text-right">{t("sidebar.orders")}</span>
          </NavLink>
        )}
        {can(user, Perms.VIEW_COMPLAINTS) && (
          <NavLink
            to="/complaints"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 ${
                isActive ? "bg-[#FF6B00] text-white" : "bg-white text-[#FF6B00]"
              } `
            }
          >
            <span className="text-base sm:text-lg">
              <i className="fa-solid fa-headset"></i>
            </span>
            <span className="flex-1 text-right">{t("sidebar.complaints")}</span>
          </NavLink>
        )}
        {can(user, Perms.VIEW_REPORTS) && (
          <NavLink
            to="/reports"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 ${
                isActive ? "bg-[#FF6B00] text-white" : "bg-white text-[#FF6B00]"
              } `
            }
          >
            <span className="text-base sm:text-lg">
              <i className="fa-solid fa-chart-line"></i>
            </span>
            <span className="flex-1 text-right">{t("sidebar.reports")}</span>
          </NavLink>
        )}
        {can(user, Perms.VIEW_CHAT) && (
          <NavLink
            to="/chat"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 ${
                isActive ? "bg-[#FF6B00] text-white" : "bg-white text-[#FF6B00]"
              } `
            }
          >
            <span className="text-base sm:text-lg">
              <i className="fa-solid fa-comments"></i>
            </span>
            <span className="flex-1 text-right">{t("sidebar.chat")}</span>
          </NavLink>
        )}
        {can(user, Perms.MANAGE_ADMINS) && (
          <NavLink
            to="/admins"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-bold text-sm sm:text-base transition-all duration-200 ${
                isActive ? "bg-[#FF6B00] text-white" : "bg-white text-[#FF6B00]"
              } `
            }
          >
            <span className="text-base sm:text-lg">
              <i className="fa-solid fa-user-shield"></i>
            </span>
            <span className="flex-1 text-right">إدارة المسؤولين</span>
          </NavLink>
        )}
      </nav>
      <div className="flex-1"></div>
    </aside>
  );
};

Sidebar.propTypes = {
  onClose: PropTypes.func,
};

export default Sidebar;
