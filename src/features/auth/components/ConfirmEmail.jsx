import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  confirmEmail as confirmEmailApi,
  resendCode as resendCodeApi,
} from "../api";

const ConfirmEmail = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    const codeFromUrl = searchParams.get("code");
    if (emailFromUrl) setEmail(emailFromUrl);
    if (codeFromUrl) setCode(codeFromUrl);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = String(email || "").trim();
    const trimmedCode = String(code || "").trim();
    if (!trimmedEmail || !trimmedCode) {
      toast.error(
        i18n.language === "ar"
          ? "من فضلك أدخل البريد الإلكتروني والرمز"
          : "Please provide email and code"
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await confirmEmailApi({ email: trimmedEmail, code: Number(trimmedCode) });
      toast.success(
        i18n.language === "ar"
          ? "تم تأكيد البريد الإلكتروني بنجاح"
          : "Email confirmed successfully"
      );
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const resp = err?.response?.data;
      const msg =
        resp?.message ||
        err?.message ||
        (i18n.language === "ar" ? "فشل التأكيد" : "Confirmation failed");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    const trimmedEmail = String(email || "").trim();
    if (!trimmedEmail) {
      toast.error(
        i18n.language === "ar"
          ? "من فضلك أدخل البريد الإلكتروني"
          : "Please enter your email"
      );
      return;
    }
    setIsResending(true);
    try {
      await resendCodeApi({ email: trimmedEmail });
      toast.success(
        i18n.language === "ar" ? "تم إرسال الكود مجددًا" : "Code resent"
      );
    } catch (err) {
      const resp = err?.response?.data;
      const msg =
        resp?.message ||
        err?.message ||
        (i18n.language === "ar" ? "فشل الإرسال" : "Resend failed");
      toast.error(msg);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#F5F6FA]"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {i18n.language === "ar"
            ? "تأكيد البريد الإلكتروني"
            : "Confirm your email"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {i18n.language === "ar" ? "البريد الإلكتروني" : "Email"}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {i18n.language === "ar" ? "رمز التأكيد" : "Confirmation code"}
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\\d*"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-[#F9F9FB] text-gray-700"
              placeholder={
                i18n.language === "ar" ? "اكتب الرمز هنا" : "Enter code here"
              }
              required
            />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-3 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 disabled:bg-orange-300"
            >
              {isSubmitting
                ? i18n.language === "ar"
                  ? "جارٍ التأكيد..."
                  : "Confirming..."
                : i18n.language === "ar"
                ? "تأكيد"
                : "Confirm"}
            </button>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="px-5 py-3 bg-gray-100 text-gray-800 rounded-lg font-bold hover:bg-gray-200 disabled:opacity-70"
            >
              {isResending
                ? i18n.language === "ar"
                  ? "جارٍ الإرسال..."
                  : "Resending..."
                : i18n.language === "ar"
                ? "إرسال الرمز مجددًا"
                : "Resend code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmEmail;
