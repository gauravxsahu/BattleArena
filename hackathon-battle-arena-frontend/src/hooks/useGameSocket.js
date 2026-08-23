import { useEffect, useRef } from "react";
import { useSocket } from "./useSocket";
import { useGame } from "./useGame";
import { useNotifications } from "./useNotifications";

/**
 * Joins `game:<gameId>` and subscribes to every backend game event,
 * feeding them into GameContext. Listeners are added once per
 * socket/gameId pair and always cleaned up on unmount or when either
 * changes, so re-renders never produce duplicate handlers.
 */
export function useGameSocket(gameId) {
  const { socket, isConnected } = useSocket();
  const game = useGame();
  const { pushToast, pushNotification } = useNotifications();
  const hasJoinedRef = useRef(false);

  useEffect(() => {
    if (!socket || !gameId) return undefined;

    const handleStart = (payload) => {
      if (payload.gameId !== gameId) return;
      game.applyGameStart(payload);
      pushToast("The challenge has started — 30 minutes on the clock!", "success");
    };

    const handleTimer = (payload) => {
      if (payload.gameId !== gameId) return;
      game.tickTimer(payload.remainingMs);
    };

    const handlePlayerStatus = (payload) => {
      if (payload.gameId !== gameId) return;
      game.applyPlayerStatus(payload);
    };

    const handleSubmissionPhase = (payload) => {
      if (payload.gameId && payload.gameId !== gameId) return;
      if (payload.phase) {
        game.applySubmissionPhase(payload);
        if (payload.phase === "SUBMISSION") {
          pushToast("Time's up — submit your final solution now.", "warning");
        } else if (payload.phase === "EVALUATING") {
          pushToast("Evaluation has started.", "info");
        }
      }
    };

    const handleMessage = (payload) => {
      if (payload.gameId !== gameId) return;
      game.addMessage(payload);
    };

    const handleEnd = (payload) => {
      if (payload.gameId !== gameId) return;
      game.applyGameEnd(payload);
      pushNotification("GAME_ENDED", "The game has ended. Check the final result!", payload);
    };

    const handleResult = (payload) => {
      if (payload.gameId !== gameId) return;
      game.setResult(payload.result);
      pushToast("Final results are in!", "success");
    };

    const handleCancelled = (payload) => {
      if (payload.gameId !== gameId) return;
      game.applyGameCancelled(payload);
      pushToast("Match cancelled — not everyone readied up in time.", "warning");
    };

    socket.on("game:start", handleStart);
    socket.on("game:timer", handleTimer);
    socket.on("game:player-status", handlePlayerStatus);
    socket.on("game:submission", handleSubmissionPhase);
    socket.on("game:message", handleMessage);
    socket.on("game:end", handleEnd);
    socket.on("game:result", handleResult);
    socket.on("game:cancelled", handleCancelled);

    if (isConnected && !hasJoinedRef.current) {
      socket.emit("game:join", { gameId }, (ack) => {
        if (!ack?.success) {
          pushToast(ack?.message || "Could not join the live game room.", "error");
        }
      });
      hasJoinedRef.current = true;
    }

    return () => {
      socket.off("game:start", handleStart);
      socket.off("game:timer", handleTimer);
      socket.off("game:player-status", handlePlayerStatus);
      socket.off("game:submission", handleSubmissionPhase);
      socket.off("game:message", handleMessage);
      socket.off("game:end", handleEnd);
      socket.off("game:result", handleResult);
      socket.off("game:cancelled", handleCancelled);
      hasJoinedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, isConnected, gameId]);

  const sendReady = () => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject(new Error("Not connected"));
      socket.emit("game:ready", { gameId }, (ack) => {
        if (ack?.success) resolve(ack.data);
        else reject(new Error(ack?.message || "Failed to mark ready"));
      });
    });
  };

  const sendMessage = (content) => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject(new Error("Not connected"));
      socket.emit("game:message", { gameId, content }, (ack) => {
        if (ack?.success) resolve();
        else reject(new Error(ack?.message || "Failed to send message"));
      });
    });
  };

  return { sendReady, sendMessage, isConnected };
}