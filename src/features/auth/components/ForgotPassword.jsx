import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { sendForgetCode, checkForgetCode } from "../api/forgetCode";
import { resetPassword } from "../api/resetPassword";

const ForgotPassword = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: email, 2: code, 3: new password
  const [email, setEmail] = useState("");

  const [codeDigits, setCodeDigits] = useState(["", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef({});

  const dir = i18n.language === "ar" ? "rtl" : "ltr";

  const handleSendCode = async (e) => {
    e.preventDefault();
    const trimmed = String(email || "").trim();
    if (!trimmed) {
      toast.error(
        dir === "rtl"
          ? "من فضلك أدخل البريد الإلكتروني"
          : "Please enter your email"
      );
      return;
    }
    setLoading(true);
    try {
      await sendForgetCode({ email: trimmed });
      toast.success(
        dir === "rtl"
          ? "تم إرسال الكود إلى بريدك. الكود صالح لمدة 10 دقائق"
          : "Code sent to your email. Code is valid for 10 minutes"
      );
      setStep(2);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (dir === "rtl" ? "فشل الإرسال" : "Failed to send");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckCode = async (e) => {
    e.preventDefault();
    const codeString = codeDigits.join("");
    if (codeString.length !== 5) {
      toast.error(
        dir === "rtl"
          ? "أدخل الرمز كاملاً (5 أرقام)"
          : "Enter the complete code (5 digits)"
      );
      return;
    }

    setLoading(true);
    try {
      console.log("Checking code:", { email, code: parseInt(codeString, 10) });
      await checkForgetCode({ email, code: parseInt(codeString, 10) });
      toast.success(dir === "rtl" ? "تم التحقق من الرمز" : "Code verified");
      setStep(3);
    } catch (err) {
      console.error("Check code error:", err);
      let msg = "";
      if (err?.response?.status === 400) {
        const serverMessage = err?.response?.data?.message;
        if (serverMessage) {
          msg = serverMessage;
        } else {
          msg =
            dir === "rtl"
              ? "الرمز غير صحيح أو منتهي الصلاحية. جرب إعادة إرسال الكود"
              : "Invalid or expired code. Try resending the code";
        }
      } else if (err?.response?.status === 404) {
        msg = dir === "rtl" ? "البريد الإلكتروني غير موجود" : "Email not found";
      } else if (err?.response?.status === 500) {
        msg =
          dir === "rtl"
            ? "خطأ في الخادم. حاول مرة أخرى"
            : "Server error. Please try again";
      } else {
        msg =
          err?.response?.data?.message ||
          err?.message ||
          (dir === "rtl" ? "فشل التحقق" : "Verification failed");
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const p = String(password || "").trim();
    const cp = String(cPassword || "").trim();
    if (!p || !cp) {
      toast.error(
        dir === "rtl"
          ? "أدخل كلمة المرور والتأكيد"
          : "Enter password and confirmation"
      );
      return;
    }
    if (p !== cp) {
      toast.error(
        dir === "rtl" ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"
      );
      return;
    }
    setLoading(true);
    try {
      await resetPassword({
        email,
        code: parseInt(codeDigits.join(""), 10),
        password: p,
        cPassword: cp,
      });
      toast.success(
        dir === "rtl"
          ? "تم إعادة تعيين كلمة المرور"
          : "Password reset successfully"
      );
      navigate("/login", { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        (dir === "rtl" ? "فشل إعادة التعيين" : "Reset failed");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F5F6FA] p-4"
      dir={dir}
    >
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
          {dir === "rtl" ? "استرجاع كلمة المرور" : "Forgot your password"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {dir === "rtl" ? "البريد الإلكتروني" : "Email"}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700 text-base"
                placeholder={
                  dir === "rtl" ? "أدخل بريدك الإلكتروني" : "Enter your email"
                }
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 disabled:bg-orange-300 transition-colors duration-200 text-base"
            >
              {loading
                ? dir === "rtl"
                  ? "جارٍ الإرسال..."
                  : "Sending..."
                : dir === "rtl"
                ? "إرسال الكود"
                : "Send code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCheckCode} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {dir === "rtl" ? "أدخل الرمز المرسل" : "Enter the sent code"}
              </label>
              <div className="flex gap-2 sm:gap-3 justify-center">
                {[0, 1, 2, 3, 4].map((index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) {
                        // Store reference to each input
                        if (!inputRefs.current) inputRefs.current = {};
                        inputRefs.current[index] = el;
                      }
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={codeDigits[index] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Only allow numbers
                      if (!/^\d*$/.test(value)) return;

                      const newDigits = [...codeDigits];
                      newDigits[index] = value;
                      setCodeDigits(newDigits);

                      // Auto-focus next input if value entered
                      if (value && index < 4) {
                        setTimeout(() => {
                          if (inputRefs.current[index + 1]) {
                            inputRefs.current[index + 1].focus();
                          }
                        }, 10);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace to go to previous input
                      if (
                        e.key === "Backspace" &&
                        !e.target.value &&
                        index > 0
                      ) {
                        e.preventDefault();
                        if (inputRefs.current[index - 1]) {
                          inputRefs.current[index - 1].focus();
                        }
                      }
                      // Handle arrow keys
                      if (e.key === "ArrowLeft" && index > 0) {
                        e.preventDefault();
                        if (inputRefs.current[index - 1]) {
                          inputRefs.current[index - 1].focus();
                        }
                      }
                      if (e.key === "ArrowRight" && index < 4) {
                        e.preventDefault();
                        if (inputRefs.current[index + 1]) {
                          inputRefs.current[index + 1].focus();
                        }
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const pastedData = e.clipboardData.getData("text");
                      const numbers = pastedData.match(/\d/g);
                      if (numbers && numbers.length >= 5) {
                        const newDigits = [...codeDigits];
                        for (let i = 0; i < 5; i++) {
                          newDigits[i] = numbers[i] || "";
                        }
                        setCodeDigits(newDigits);
                        // Focus last filled input
                        setTimeout(() => {
                          const lastFilledIndex = newDigits.findIndex(
                            (d) => d === ""
                          );
                          const focusIndex =
                            lastFilledIndex === -1 ? 4 : lastFilledIndex;
                          if (inputRefs.current[focusIndex]) {
                            inputRefs.current[focusIndex].focus();
                          }
                        }, 10);
                      }
                    }}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-[#F9F9FB] text-gray-700"
                    required
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 disabled:bg-orange-300 transition-colors duration-200 text-base"
              >
                {loading
                  ? dir === "rtl"
                    ? "جارٍ التحقق..."
                    : "Verifying..."
                  : dir === "rtl"
                  ? "تحقق"
                  : "Verify"}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleSendCode}
                className="w-full sm:w-auto px-5 py-3 bg-gray-100 text-gray-800 rounded-lg font-bold hover:bg-gray-200 disabled:opacity-70 transition-colors duration-200 text-base"
              >
                {dir === "rtl" ? "إعادة إرسال الكود" : "Resend code"}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {dir === "rtl" ? "كلمة المرور الجديدة" : "New password"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700 pr-12 text-base"
                  placeholder={
                    dir === "rtl"
                      ? "أدخل كلمة المرور الجديدة"
                      : "Enter new password"
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-orange-400 hover:text-orange-600 transition-colors p-1"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <i
                    className={
                      showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                {dir === "rtl" ? "تأكيد كلمة المرور" : "Confirm password"}
              </label>
              <div className="relative">
                <input
                  type={showCPassword ? "text" : "password"}
                  value={cPassword}
                  onChange={(e) => setCPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700 pr-12 text-base"
                  placeholder={
                    dir === "rtl" ? "أكد كلمة المرور" : "Confirm password"
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-orange-400 hover:text-orange-600 transition-colors p-1"
                  onClick={() => setShowCPassword((v) => !v)}
                >
                  <i
                    className={
                      showCPassword
                        ? "fa-solid fa-eye-slash"
                        : "fa-solid fa-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-5 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 disabled:bg-orange-300 transition-colors duration-200 text-base"
            >
              {loading
                ? dir === "rtl"
                  ? "جارٍ الحفظ..."
                  : "Saving..."
                : dir === "rtl"
                ? "تعيين كلمة المرور"
                : "Set password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
