import apiClient from "../../../api/client";

export const newLocation = async (payload) => {
  try {
    const { data } = await apiClient.post("/auth/location", payload);
    return data;
  } catch (error) {
    console.error("newLocation error:", error);
    throw error;
  }
};

export default newLocation;
