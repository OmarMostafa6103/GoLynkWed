import apiClient from "../../../api/client";

export const signup = async (payload) => {
  const safePayload = { ...payload };
  if (safePayload.phone) {
    let p = String(safePayload.phone).trim();
    if (/^0\d{10}$/.test(p)) {
      p = "+2" + p;
    }
    if (!/^\+?\d{10,15}$/.test(p)) {
      throw new Error(
        "Invalid phone format. Use international format like +2010xxxxxxx"
      );
    }
    safePayload.phone = p;
  }
  const { data } = await apiClient.post("/auth/signup", safePayload, {
    headers: { "x-skip-auth": true },
  });
  return data;
};

export default signup;
