import api, { unwrap } from "./api";

export const matchmakingApi = {
  join: (mode = "BATTLE") => api.post("/matchmaking/join", { mode }).then(unwrap),
  leave: (mode = "BATTLE") => api.post("/matchmaking/leave", { mode }).then(unwrap),
  status: (mode = "BATTLE") => api.get("/matchmaking/status", { params: { mode } }).then(unwrap),
};
