import api, { unwrap } from "./api";

export const friendChallengeApi = {
  create: () => api.post("/friend-challenge/create").then(unwrap),
  join: (code) => api.post("/friend-challenge/join", { code }).then(unwrap),
};
