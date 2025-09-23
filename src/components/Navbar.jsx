import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { logout as apiLogout } from "../features/auth/api";

const Navbar = ({ setToken, onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // حالة القائمة المنسدلة
  const dropdownRef = useRef(null); // مرجع للقائمة المنسدلة

  // قائمة اللغات المدعومة مع أيقونات
  const languages = [
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  // تغيير اللغة وتحديث اتجاه النص
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.setAttribute("dir", lng === "ar" ? "rtl" : "ltr");
    localStorage.setItem("language", lng); // حفظ اللغة في localStorage
    setIsOpen(false); // إغلاق القائمة المنسدلة
  };

  // تحميل اللغة المحفوظة عند تحميل المكون
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLanguage);
    document.documentElement.setAttribute(
      "dir",
      savedLanguage === "ar" ? "rtl" : "ltr"
    );
  }, [i18n]);

  // إغلاق القائمة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // التعامل مع تسجيل الخروج
  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore api errors, proceed to local logout
    } finally {
      setToken("");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      localStorage.removeItem("golynk_remember_me");
      navigate("/login", { replace: true });
    }
  };

  return (
    <nav className="flex justify-between items-center py-4 px-4 sm:px-6 bg-brand-primary text-brand-background shadow-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-brand-primary/80 transition-colors"
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars text-xl"></i>
        </button>

        <h1 className="text-lg sm:text-xl font-semibold">
          {t("navbar.title")}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        {/* القائمة المنسدلة للغات */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brand-text text-brand-background rounded-lg hover:bg-opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-background text-sm sm:text-base"
            aria-expanded={isOpen}
            aria-haspopup="true"
            aria-label={t("navbar.select_language")}
          >
            <span className="font-medium hidden sm:block">
              {languages
                .find((lang) => lang.code === i18n.language)
                ?.code.toUpperCase() || "EN"}
            </span>
            <span className="font-medium sm:hidden">
              {languages.find((lang) => lang.code === i18n.language)?.flag ||
                "🇬🇧"}
            </span>
            <i
              className={`fas fa-chevron-down transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          {isOpen && (
            <ul
              className="absolute top-full right-0 mt-2 w-48 bg-brand-background rounded-lg shadow-lg border border-brand-text/20 z-10 animate-fadeIn"
              role="menu"
            >
              {languages.map((lang) => (
                <li key={lang.code} role="menuitem">
                  <button
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-3 w-full px-4 py-2 text-brand-text hover:bg-brand-primary hover:text-brand-background transition-all duration-200 ${
                      i18n.language === lang.code ? "bg-brand-primary/20" : ""
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* زر تسجيل الخروج */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-action-reject text-brand-background rounded-lg hover:bg-opacity-80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-background text-sm sm:text-base"
          aria-label={t("navbar.logout")}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span className="hidden sm:inline">{t("navbar.logout")}</span>
        </button>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  setToken: PropTypes.func.isRequired,
  onMenuClick: PropTypes.func.isRequired,
};

export default Navbar;
