import api, { unwrap } from "./api";

export const leaderboardApi = {
  top: (limit = 50) => api.get("/leaderboard", { params: { limit } }).then(unwrap),
  me: () => api.get("/leaderboard/me").then(unwrap),
};
