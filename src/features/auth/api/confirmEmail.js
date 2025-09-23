import apiClient from "../../../api/client";

export const confirmEmail = async (payload) => {
  const { data } = await apiClient.post("/auth/confirmEmail", payload);
  return data;
};

export default confirmEmail;
