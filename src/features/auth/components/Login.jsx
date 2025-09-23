import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { assets } from "../../../assets/assets";
import { signin } from "../api";
import { tokenStorage } from "../../../api/client";

/**
 * @param {{ setToken: (token: string) => void }} props
 */
const Login = (props) => {
  const { setToken } = props;
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState(() => {
    const savedEmail = localStorage.getItem("golynk_saved_email");
    return savedEmail || "";
  });
  const [password, setPassword] = useState(() => {
    const savedPassword = localStorage.getItem("golynk_saved_password");
    return savedPassword || "";
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    const savedRememberMe = localStorage.getItem("golynk_remember_me");
    return savedRememberMe === "true";
  });

  // إظهار رسالة عند تحميل البيانات المحفوظة
  useEffect(() => {
    const savedEmail = localStorage.getItem("golynk_saved_email");
    const savedPassword = localStorage.getItem("golynk_saved_password");
    const savedRememberMe = localStorage.getItem("golynk_remember_me");

    if (savedEmail && savedPassword && savedRememberMe === "true") {
      toast.info(
        i18n.language === "ar"
          ? "تم تحميل بياناتك المحفوظة"
          : "Your saved data has been loaded"
      );
    }
  }, [i18n.language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signin({ email, password });
      console.log("🔓 Login successful:", res);

      const issuedToken = res?.token || "";

      // حفظ إعدادات "تذكر بياناتي"
      localStorage.setItem("golynk_remember_me", rememberMe ? "true" : "false");

      // حفظ البيانات إذا تم تفعيل "تذكر بياناتي"
      if (rememberMe) {
        localStorage.setItem("golynk_saved_email", email);
        localStorage.setItem("golynk_saved_password", password);
      } else {
        // حذف البيانات المحفوظة إذا لم يتم تفعيل "تذكر بياناتي"
        localStorage.removeItem("golynk_saved_email");
        localStorage.removeItem("golynk_saved_password");
      }

      // التحقق من صحة دور المستخدم قبل السماح بالدخول
      const user = res?.user;
      if (user) {
        console.log("👤 Logged in user:", user);
        console.log("🔑 User role:", user.role);

        // منع المستخدمين العاديين من الوصول للداش بورد
        if (user.role === "User") {
          console.log("❌ Regular user attempted admin login");
          tokenStorage.clearAll();
          toast.error(
            i18n.language === "ar"
              ? "هذا الحساب غير مسموح له بالوصول للداش بورد الإداري"
              : "This account is not authorized to access the admin dashboard"
          );
          return;
        }

        // رسائل ترحيب حسب نوع المستخدم
        if (user.role === "SuperAdmin") {
          console.log("🔥 Super Admin access granted!");
          toast.success(
            i18n.language === "ar"
              ? "مرحباً بك، سوبر أدمن! 👑"
              : "Welcome, Super Admin! 👑"
          );
        } else if (user.role === "Admin") {
          console.log("✅ Admin access granted!");
          toast.success(
            i18n.language === "ar" ? "مرحباً بك، أدمن!" : "Welcome, Admin!"
          );
        }
      }

      // استخدام tokenStorage المحدث (تم التعامل معه في signin.js)
      setToken(issuedToken);
    } catch (err) {
      console.error("❌ Login failed:", err);
      const msg =
        err?.response?.data?.message || err?.message || t("login.failed");
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  };

  const handleClearSavedData = () => {
    localStorage.removeItem("golynk_saved_email");
    localStorage.removeItem("golynk_saved_password");
    localStorage.removeItem("golynk_remember_me");
    setEmail("");
    setPassword("");
    setRememberMe(false);
    toast.success(
      i18n.language === "ar" ? "تم حذف البيانات المحفوظة" : "Saved data cleared"
    );
  };

  const handleRememberMeChange = (checked) => {
    setRememberMe(checked);
    if (!checked) {
      localStorage.removeItem("golynk_saved_email");
      localStorage.removeItem("golynk_saved_password");
    }
  };

  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F5F6FA] p-4"
      dir={dir}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Left: Login Form */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            {/* Language Switcher */}
            <div className="flex justify-end mb-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleLanguageChange("ar")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    i18n.language === "ar"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  العربية
                </button>
                <button
                  onClick={() => handleLanguageChange("en")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    i18n.language === "en"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Logo and Title */}
            <div className="text-center lg:text-right mb-8">
              <div className="flex justify-center lg:justify-start items-center gap-3 mb-4">
                <img
                  src={assets.logo || "/src/assets/logo.png"}
                  alt="GoLynk Logo"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  GoLynk
                </h1>
              </div>
              <h2
                className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-2"
                style={{
                  borderRight:
                    i18n.language === "ar" ? "4px solid #FF6B00" : "none",
                  borderLeft:
                    i18n.language === "en" ? "4px solid #FF6B00" : "none",
                  paddingRight: i18n.language === "ar" ? "1rem" : 0,
                  paddingLeft: i18n.language === "en" ? "1rem" : 0,
                }}
              >
                {i18n.language === "ar" ? "تسجيل الدخول" : "Login"}
              </h2>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                {i18n.language === "ar"
                  ? "دخول خاص بالمديرين والمشرفين لإدارة الطلبات والرحلات، المستخدمين، والشكاوى"
                  : "Private access for admins and supervisors to manage orders, trips, users, and complaints."}
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-yellow-800 text-xs sm:text-sm font-medium">
                  {i18n.language === "ar"
                    ? "⚠️ تنبيه: هذا النظام مخصص للمديرين والمشرفين فقط. المستخدمون العاديون لا يمكنهم الوصول."
                    : "⚠️ Warning: This system is for admins and supervisors only. Regular users cannot access."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700 placeholder-gray-400 pr-12 text-base"
                  placeholder={t("login.email_placeholder")}
                  required
                />
                <span className="absolute top-1/2 -translate-y-1/2 right-4 text-orange-400">
                  <i className="fa-regular fa-envelope"></i>
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700 placeholder-gray-400 pr-12 text-base"
                  placeholder={t("login.password_placeholder")}
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-orange-400 hover:text-orange-600 transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={
                      showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                    }
                  ></i>
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 mt-2 bg-orange-500 text-white rounded-lg font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-orange-600 transition-all duration-200 disabled:bg-orange-300"
              >
                <span>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                </span>
                {isLoading ? t("login.logging_in") : t("login.login_button")}
              </button>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="mr-2 w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                    checked={rememberMe}
                    onChange={(e) => handleRememberMeChange(e.target.checked)}
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-gray-500 text-sm cursor-pointer"
                  >
                    {i18n.language === "ar"
                      ? "تذكر بياناتي للدخول"
                      : "Remember me"}
                  </label>
                </div>
                {rememberMe && (email || password) && (
                  <button
                    type="button"
                    onClick={handleClearSavedData}
                    className="text-xs text-red-500 hover:text-red-700 underline transition-colors duration-200"
                  >
                    {i18n.language === "ar"
                      ? "حذف البيانات المحفوظة"
                      : "Clear saved data"}
                  </button>
                )}
              </div>
            </form>
            <div className="mt-4 text-sm text-center lg:text-right">
              <a
                href="/forgot-password"
                className="text-orange-500 hover:text-orange-600 font-bold transition-colors duration-200"
              >
                {i18n.language === "ar"
                  ? "نسيت كلمة المرور؟"
                  : "Forgot password?"}
              </a>
            </div>
            <div className="mt-3 text-sm text-center lg:text-right">
              <span className="text-gray-600">
                {i18n.language === "ar"
                  ? "ليس لديك حساب؟ "
                  : "Don't have an account? "}
              </span>
              <Link
                to="/signup"
                className="text-orange-500 hover:text-orange-600 font-bold transition-colors duration-200"
              >
                {i18n.language === "ar" ? "إنشاء حساب جديد" : "Create one"}
              </Link>
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-orange-50 to-blue-50 flex items-center justify-center relative p-4 sm:p-8">
            <img
              src={
                assets.login_illustration || "/src/pages/img/sketch-fresh.png"
              }
              alt="login-illustration"
              className="w-full max-w-sm sm:max-w-md lg:max-w-lg object-contain drop-shadow-xl"
            />
            {/* دوائر خلفية */}
            <div
              className="absolute top-0 left-0 w-20 h-20 sm:w-32 sm:h-32 bg-orange-100 rounded-full opacity-60 -z-10"
              style={{ top: "-1rem", left: "-1rem" }}
            ></div>
            <div
              className="absolute bottom-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-blue-100 rounded-full opacity-60 -z-10"
              style={{ bottom: "-1rem", right: "-1rem" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
