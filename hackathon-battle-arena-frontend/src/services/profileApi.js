import api, { unwrap } from "./api";

export const profileApi = {
  get: () => api.get("/profile").then(unwrap),
  update: (payload) => api.put("/profile", payload).then(unwrap),
};
