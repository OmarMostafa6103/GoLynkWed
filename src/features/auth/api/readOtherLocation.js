import apiClient from "../../../api/client";

export const readOtherLocation = async (userId) => {
  try {
    const { data } = await apiClient.get(`/auth/location/${userId}`);
    return data;
  } catch (error) {
    console.error("readOtherLocation error:", error);
    throw error;
  }
};

export default readOtherLocation;
