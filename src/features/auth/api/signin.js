import apiClient, { tokenStorage } from "../../../api/client";

export const signin = async (payload) => {
  console.log("=== SIGNIN DEBUG ===");
  console.log("Sending payload:", payload);
  console.log("VITE_BACKEND_URL from env:", import.meta.env.VITE_BACKEND_URL);
  console.log("apiClient baseURL:", apiClient.defaults.baseURL);
  console.log("Full URL will be:", `${apiClient.defaults.baseURL}/auth/signin`);

  try {
    const { data } = await apiClient.post("/auth/signin", payload, {
      headers: {
        "x-skip-auth": true,
      },
    });
    console.log("✅ Login API Response:", data);

    if (data?.token) tokenStorage.set(data.token);
    if (data?.refresh_token) tokenStorage.setRefresh(data.refresh_token);
    if (data?.user) tokenStorage.setUser(data.user);
    return data;
  } catch (error) {
    console.error("Login API Error:", error);
    console.error("Error Response:", error.response?.data);
    console.error("Error Status:", error.response?.status);
    throw error;
  }
};

export default signin;
