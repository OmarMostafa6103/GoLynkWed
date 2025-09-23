import apiClient, { tokenStorage } from "../../../api/client";

export const refreshToken = async () => {
  try {
    const accessToken = tokenStorage.get();
    const { data } = await apiClient.post("/auth/refreshToken", {
      accessToken,
    });
    if (data?.token) tokenStorage.set(data.token);
    if (data?.refresh_token) tokenStorage.setRefresh(data.refresh_token);
    return data;
  } catch (error) {
    console.error("refreshToken error:", error);
    throw error;
  }
};

export default refreshToken;
