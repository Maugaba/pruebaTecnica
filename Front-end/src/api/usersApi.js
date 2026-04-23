import axiosClient from "./axiosClient";

export const usersApi = {
  list: () => axiosClient.get("/users").then((r) => r.data),
  getById: (id) => axiosClient.get(`/users/${id}`).then((r) => r.data),
  create: (payload) => axiosClient.post("/users", payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/users/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/users/${id}`).then((r) => r.data),
};
