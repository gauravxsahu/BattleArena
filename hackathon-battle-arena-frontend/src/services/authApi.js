import api, { unwrap } from "./api";

export const authApi = {
  register: (payload) => api.post("/auth/register", payload).then(unwrap),
  login: (payload) => api.post("/auth/login", payload).then(unwrap),
  logout: () => api.post("/auth/logout").then(unwrap),
  refresh: () => api.post("/auth/refresh").then(unwrap),
  me: () => api.get("/auth/me").then(unwrap),
};
