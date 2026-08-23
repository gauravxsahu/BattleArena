import api, { unwrap } from "./api";

export const submissionApi = {
  submit: (gameId, payload) => api.post(`/games/${gameId}/submissions`, payload).then(unwrap),
  list: (gameId) => api.get(`/games/${gameId}/submissions`).then(unwrap),
};
