import api, { unwrap } from "./api";

export const challengeApi = {
  get: (challengeId) => api.get(`/challenges/${challengeId}`).then(unwrap),
};
