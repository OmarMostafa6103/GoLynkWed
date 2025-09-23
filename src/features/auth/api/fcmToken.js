import apiClient from "../../../api/client";

export const updateFcmToken = async (payload) => {
  // payload: { fcmToken }
  try {
    const { data } = await apiClient.post("/auth/fcm", payload);
    return data;
  } catch (error) {
    console.error("updateFcmToken error:", error);
    throw error;
  }
};

export default updateFcmToken;
