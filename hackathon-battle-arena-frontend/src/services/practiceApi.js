import api, { unwrap } from "./api";

export const practiceApi = {
  start: () => api.post("/practice/start").then(unwrap),
};
