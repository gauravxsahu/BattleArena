import api, { unwrap } from "./api";

export const userApi = {
  search: (query) => api.get("/users/search", { params: { q: query } }).then(unwrap),
  getPublicProfile: (userId) => api.get(`/users/${userId}`).then(unwrap),
};
