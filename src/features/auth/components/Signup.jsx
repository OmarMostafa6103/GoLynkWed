import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { signup as signupApi } from "../api";

const initialForm = {
  userName: "",
  email: "",
  password: "",
  cPassword: "",
  phone: "",
};

const Signup = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const userName = String(form.userName || "").trim();
    const email = String(form.email || "").trim();
    const password = String(form.password || "").trim();
    const cPassword = String(form.cPassword || "").trim();
    if (!userName || !email || !password) return false;
    if (password !== cPassword) return false;
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$/;
    if (!pwdRegex.test(password)) {
      toast.error(
        i18n.language === "ar"
          ? "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل وتشمل حرف كبير وصغير ورقم ورمز خاص (@#$%^&*!)"
          : "Password must be at least 8 chars and include uppercase, lowercase, digit and special (@#$%^&*!)"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error(
        i18n.language === "ar"
          ? "يرجى التأكد من إدخال الحقول المطلوبة ومطابقة كلمة المرور"
          : "Please fill required fields and ensure passwords match"
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        userName: String(form.userName).trim(),
        email: String(form.email).trim(),
        password: String(form.password).trim(),
        cPassword: String(form.cPassword).trim(),
      };
      if (form.phone && String(form.phone).trim().length > 0) {
        payload.phone = String(form.phone).trim();
      }
      await signupApi(payload);
      toast.success(
        i18n.language === "ar"
          ? "تم إنشاء الحساب بنجاح، قم بتسجيل الدخول"
          : "Account created successfully, please sign in"
      );
      navigate("/login", { replace: true });
    } catch (err) {
      const resp = err?.response?.data;
      const errors = Array.isArray(resp?.errors)
        ? resp.errors.map((e) => e?.msg || e).join(" | ")
        : null;
      const msg =
        errors ||
        resp?.message ||
        err?.message ||
        (i18n.language === "ar" ? "فشل إنشاء الحساب" : "Signup failed");
      toast.error(msg);
      // eslint-disable-next-line no-console
      console.error("signup_error_response", resp || err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6FA]">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
        <h2
          className="text-3xl font-bold text-gray-800 mb-6"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          {i18n.language === "ar" ? "إنشاء حساب جديد" : "Create a new account"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          dir="rtl"
        >
          <div className="col-span-1">
            <label className="block text-sm text-gray-600 mb-1">
              {i18n.language === "ar" ? "اسم المستخدم" : "Username"}
            </label>
            <input
              name="userName"
              value={form.userName}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-gray-600 mb-1">
              {i18n.language === "ar" ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700"
              required
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-gray-600 mb-1">
              {i18n.language === "ar" ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700 pr-12"
                required
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 right-4 text-orange-400 cursor-pointer"
                onClick={() => setShowPassword((v) => !v)}
                title={
                  showPassword
                    ? i18n.language === "ar"
                      ? "إخفاء"
                      : "Hide"
                    : i18n.language === "ar"
                    ? "إظهار"
                    : "Show"
                }
              >
                <i
                  className={
                    showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                  }
                ></i>
              </span>
            </div>
          </div>
          <div className="col-span-1">
            <label className="block text-sm text-gray-600 mb-1">
              {i18n.language === "ar"
                ? "تأكيد كلمة المرور"
                : "Confirm Password"}
            </label>
            <div className="relative">
              <input
                type={showCPassword ? "text" : "password"}
                name="cPassword"
                value={form.cPassword}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700 pr-12"
                required
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 right-4 text-orange-400 cursor-pointer"
                onClick={() => setShowCPassword((v) => !v)}
                title={
                  showCPassword
                    ? i18n.language === "ar"
                      ? "إخفاء"
                      : "Hide"
                    : i18n.language === "ar"
                    ? "إظهار"
                    : "Show"
                }
              >
                <i
                  className={
                    showCPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                  }
                ></i>
              </span>
            </div>
          </div>
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              {i18n.language === "ar" ? "الهاتف (اختياري)" : "Phone (optional)"}
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700"
              placeholder="+2010*******"
            />
          </div>
          <div
            className="col-span-1 md:col-span-2 flex items-center justify-between mt-2"
            dir={i18n.language === "ar" ? "rtl" : "ltr"}
          >
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 disabled:bg-orange-300"
            >
              {isSubmitting
                ? i18n.language === "ar"
                  ? "جارٍ الإنشاء..."
                  : "Creating..."
                : i18n.language === "ar"
                ? "إنشاء حساب"
                : "Create Account"}
            </button>
            <Link
              to="/login"
              className="text-sm text-orange-600 hover:underline"
            >
              {i18n.language === "ar"
                ? "لديك حساب بالفعل؟ تسجيل الدخول"
                : "Already have an account? Sign in"}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
