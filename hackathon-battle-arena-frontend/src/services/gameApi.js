import api, { unwrap } from "./api";

export const gameApi = {
  listMine: () => api.get("/games").then(unwrap),
  get: (gameId) => api.get(`/games/${gameId}`).then(unwrap),
  ready: (gameId) => api.post(`/games/${gameId}/ready`).then(unwrap),
  players: (gameId) => api.get(`/games/${gameId}/players`).then(unwrap),
  messages: (gameId, params = {}) => api.get(`/games/${gameId}/messages`, { params }).then(unwrap),
  result: (gameId) => api.get(`/games/${gameId}/result`).then(unwrap),
  myReward: (gameId) => api.get(`/games/${gameId}/rewards/me`).then(unwrap),
};
