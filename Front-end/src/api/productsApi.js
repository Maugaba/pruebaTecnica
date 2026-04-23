import axiosClient from "./axiosClient";

export const productsApi = {
  list: () => axiosClient.get("/products").then((r) => r.data),
  getById: (id) => axiosClient.get(`/products/${id}`).then((r) => r.data),
  create: (payload) => axiosClient.post("/products", payload).then((r) => r.data),
  update: (id, payload) => axiosClient.put(`/products/${id}`, payload).then((r) => r.data),
  remove: (id) => axiosClient.delete(`/products/${id}`).then((r) => r.data),
};
