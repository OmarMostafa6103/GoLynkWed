import apiClient, { tokenStorage } from "../../../api/client";

export const socialLogin = async (provider, payload) => {
  const { data } = await apiClient.post(`/auth/social/${provider}`, payload);
  if (data?.token) tokenStorage.set(data.token);
  return data;
};

export default socialLogin;
