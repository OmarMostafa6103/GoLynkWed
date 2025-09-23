import apiClient from "../../../api/client";

export const readMyLocation = async () => {
  try {
    const { data } = await apiClient.get("/auth/location/me");
    return data;
  } catch (error) {
    console.error("readMyLocation error:", error);
    throw error;
  }
};

export default readMyLocation;
