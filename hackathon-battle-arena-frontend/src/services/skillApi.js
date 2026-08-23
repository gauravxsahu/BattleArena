import api, { unwrap } from "./api";

export const skillApi = {
  listCatalog: () => api.get("/skills").then(unwrap),
  listMine: () => api.get("/profile/skills").then(unwrap),
  add: (payload) => api.post("/profile/skills", payload).then(unwrap),
  update: (skillId, payload) => api.put(`/profile/skills/${skillId}`, payload).then(unwrap),
  remove: (skillId) => api.delete(`/profile/skills/${skillId}`).then(unwrap),
};
