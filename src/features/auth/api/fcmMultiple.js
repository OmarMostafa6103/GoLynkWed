import apiClient from "../../../api/client";

export const updateFcmMultiple = async (payload) => {
  // payload: { tokens: [] }
  try {
    const { data } = await apiClient.post("/auth/fcm-multiple", payload);
    return data;
  } catch (error) {
    console.error("updateFcmMultiple error:", error);
    throw error;
  }
};

export default updateFcmMultiple;
