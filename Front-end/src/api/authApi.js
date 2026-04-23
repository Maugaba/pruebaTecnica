import axiosClient from "./axiosClient";

export const authApi = {
  register: (payload) => axiosClient.post("/auth/register", payload).then((r) => r.data),
  login: (payload) => axiosClient.post("/auth/login", payload).then((r) => r.data),
  me: () => axiosClient.get("/users/me").then((r) => r.data),
  updateProfile: (payload) => axiosClient.put("/users/me", payload).then((r) => r.data),
};
