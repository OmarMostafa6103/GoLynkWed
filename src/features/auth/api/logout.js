import apiClient, { tokenStorage } from "../../../api/client";

export const logout = async () => {
  try {
    const refreshToken = tokenStorage.getRefresh();
    await apiClient.post("/auth/logout", { refreshToken });
  } finally {
    tokenStorage.clearAll();
    // حذف البيانات المحفوظة عند تسجيل الخروج
    localStorage.removeItem("golynk_saved_email");
    localStorage.removeItem("golynk_saved_password");
    localStorage.removeItem("golynk_remember_me");
  }
};

export default logout;
