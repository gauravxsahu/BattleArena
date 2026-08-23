import { gameApi } from "./gameApi";

/**
 * The backend does not currently expose a standalone /evaluation endpoint —
 * evaluation results are attached to the game (see GET /games/:gameId/result,
 * which includes each team's automated + AI scoring). This thin wrapper
 * keeps evaluation-specific call sites isolated from that detail so a
 * dedicated endpoint can be swapped in later without touching UI code.
 */
export const evaluationApi = {
  getForGame: (gameId) => gameApi.result(gameId),
};
