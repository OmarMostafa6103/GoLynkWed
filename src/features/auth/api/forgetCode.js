import apiClient from "../../../api/client";

export const sendForgetCode = async (payload) => {
  try {
    // Backend expects PATCH for this route (Postman 200 OK with PATCH)
    const { data } = await apiClient.patch("/auth/sendForgetCode", payload);
    return data;
  } catch (error) {
    console.error("sendForgetCode error:", error);
    throw error;
  }
};

export const checkForgetCode = async (payload) => {
  try {
    // Backend expects PATCH for this route (Postman 200 OK with PATCH)
    console.log("Sending checkForgetCode request:", payload);
    const { data } = await apiClient.patch("/auth/checkForgetCode", payload);
    console.log("checkForgetCode response:", data);
    return data;
  } catch (error) {
    console.error("checkForgetCode error:", error);
    console.error("Error details:", {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error?.message,
    });
    throw error;
  }
};

export default { sendForgetCode, checkForgetCode };
