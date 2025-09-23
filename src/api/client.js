import axios from "axios";

// Normalize base URL from .env (remove trailing slashes)
const RAW_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const NORMALIZED_BASE_URL = RAW_BASE_URL
  ? RAW_BASE_URL.replace(/\/+$/, "")
  : "";
const API_DEBUG = (import.meta.env.VITE_API_DEBUG ?? "false") === "true";

// Base Axios instance
export const apiClient = axios.create({
  baseURL: NORMALIZED_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // لا نستخدم الكوكيز؛ نعتمد على Authorization Bearer
  withCredentials: false,
});

if (API_DEBUG) {
  // eslint-disable-next-line no-console
  console.info("[API] Base URL:", NORMALIZED_BASE_URL || "<empty baseURL>");
}

// Token storage helpers
export const ACCESS_TOKEN_KEY = "golynk_access_token";
export const REFRESH_TOKEN_KEY = "golynk_refresh_token";
export const USER_KEY = "golynk_user";

export const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  set: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token || ""),
  clear: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefresh: (token) => localStorage.setItem(REFRESH_TOKEN_KEY, token || ""),
  clearRefresh: () => localStorage.removeItem(REFRESH_TOKEN_KEY),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  },
  setUser: (user) =>
    localStorage.setItem(USER_KEY, JSON.stringify(user || null)),
  clearUser: () => localStorage.removeItem(USER_KEY),
  clearAll: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// Request interceptor to attach token (skippable via x-skip-auth header)
apiClient.interceptors.request.use((config) => {
  // mark start time
  // eslint-disable-next-line no-param-reassign
  config.metadata = { start: Date.now() };

  const skipAuth =
    config?.headers &&
    (config.headers["x-skip-auth"] || config.headers["X-Skip-Auth"]);
  if (!skipAuth) {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    // Remove the helper header so it won't reach the server
    if (config.headers["x-skip-auth"] !== undefined)
      delete config.headers["x-skip-auth"];
    if (config.headers["X-Skip-Auth"] !== undefined)
      delete config.headers["X-Skip-Auth"];
  }

  if (API_DEBUG) {
    const fullUrl = `${config.baseURL || NORMALIZED_BASE_URL || ""}${
      config.url || ""
    }`;
    const headers = { ...config.headers };
    delete headers.Authorization;
    // eslint-disable-next-line no-console
    console.log(
      "[API REQUEST]",
      (config.method || "get").toUpperCase(),
      fullUrl,
      { params: config.params, data: config.data, headers }
    );
  }
  return config;
});

// Response interceptor for refresh/unauthorized handling
apiClient.interceptors.response.use(
  (response) => {
    if (API_DEBUG) {
      const cfg = response.config || {};
      const elapsed = cfg.metadata?.start
        ? `${Date.now() - cfg.metadata.start}ms`
        : "";
      const fullUrl = `${cfg.baseURL || NORMALIZED_BASE_URL || ""}${
        cfg.url || ""
      }`;
      // eslint-disable-next-line no-console
      console.log(
        "[API RESPONSE]",
        response.status,
        (cfg.method || "get").toUpperCase(),
        fullUrl,
        elapsed,
        { data: response.data }
      );
    }
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config || {};

    if (status === 401 && !originalRequest.__isRetryRequest) {
      try {
        const { token, refresh_token } = (
          await import("../features/auth/api/refreshToken")
        ).default
          ? await (await import("../features/auth/api/refreshToken")).default()
          : {};

        if (token) tokenStorage.set(token);
        if (refresh_token) tokenStorage.setRefresh(refresh_token);

        originalRequest.__isRetryRequest = true;
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${tokenStorage.get()}`;
        return apiClient(originalRequest);
      } catch (e) {
        tokenStorage.clearAll();
        return Promise.reject(e);
      }
    }

    if (API_DEBUG) {
      const cfg = error?.config || {};
      const fullUrl = `${cfg.baseURL || NORMALIZED_BASE_URL || ""}${
        cfg.url || ""
      }`;
      // eslint-disable-next-line no-console
      console.error(
        "[API ERROR]",
        status || "no-status",
        (cfg.method || "get").toUpperCase(),
        fullUrl,
        error?.message,
        { data: error?.response?.data }
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;
