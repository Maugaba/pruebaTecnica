import axiosClient from "./axiosClient";

export const ordersApi = {
  create: (payload) => axiosClient.post("/orders", payload).then((r) => r.data),
  list: () => axiosClient.get("/orders").then((r) => r.data),
  listAll: () => axiosClient.get("/orders/all").then((r) => r.data),
  getById: (id) => axiosClient.get(`/orders/${id}`).then((r) => r.data),
};
