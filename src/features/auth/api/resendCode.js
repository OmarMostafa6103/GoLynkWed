import apiClient from "../../../api/client";

export const resendCode = async (payload) => {
  const { data } = await apiClient.post("/auth/resendCode", payload);
  return data;
};

export default resendCode;
