import apiClient from "../../../api/client";

export const resetPassword = async (payload) => {
  try {
    // Backend expects PATCH for this route (Postman 200 OK with PATCH)
    const { data } = await apiClient.patch("/auth/forgetPassword", payload);
    return data;
  } catch (error) {
    console.error("resetPassword error:", error);
    throw error;
  }
};

export default resetPassword;
