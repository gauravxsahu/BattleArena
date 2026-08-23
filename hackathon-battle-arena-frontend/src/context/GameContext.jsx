import { createContext, useMemo, useReducer } from "react";

export const GameContext = createContext(null);

const initialState = {
  game: null,
  players: [],
  messages: [],
  timer: { endTime: null, remainingMs: null },
  submissionPhase: null, // "SUBMISSION" | "EVALUATING" | null
  result: null,
  cancellation: null, // { reason, notReadyUserIds } | null — set when the backend cancels the match
  isLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "RESET":
      return { ...initialState };
    case "LOADING":
      return { ...state, isLoading: true, error: null };
    case "ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_GAME":
      return {
        ...state,
        isLoading: false,
        game: action.payload,
        timer: {
          endTime: action.payload?.endTime ?? state.timer.endTime,
          remainingMs: state.timer.remainingMs,
        },
      };
    case "SET_PLAYERS":
      return { ...state, players: action.payload };
    case "PLAYER_STATUS": {
      const { userId, isReady } = action.payload;
      return {
        ...state,
        players: state.players.map((p) => (p.userId === userId || p.user?.id === userId ? { ...p, isReady } : p)),
      };
    }
    case "GAME_START":
      return {
        ...state,
        game: state.game ? { ...state.game, status: "RUNNING", startTime: action.payload.startTime, endTime: action.payload.endTime } : state.game,
        timer: { endTime: action.payload.endTime, remainingMs: null },
      };
    case "TIMER_TICK":
      return { ...state, timer: { ...state.timer, remainingMs: action.payload.remainingMs } };
    case "SUBMISSION_PHASE":
      return {
        ...state,
        submissionPhase: action.payload.phase,
        game: state.game ? { ...state.game, status: action.payload.phase === "EVALUATING" ? "EVALUATING" : "SUBMISSION" } : state.game,
      };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "NEW_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "GAME_END":
      return { ...state, game: state.game ? { ...state.game, status: "COMPLETED", winnerTeamId: action.payload.winnerTeamId } : state.game };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "GAME_CANCELLED":
      return { ...state, cancellation: action.payload, game: state.game ? { ...state.game, status: "CANCELLED" } : state.game };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions = useMemo(
    () => ({
      reset: () => dispatch({ type: "RESET" }),
      setLoading: () => dispatch({ type: "LOADING" }),
      setError: (error) => dispatch({ type: "ERROR", payload: error }),
      setGame: (game) => dispatch({ type: "SET_GAME", payload: game }),
      setPlayers: (players) => dispatch({ type: "SET_PLAYERS", payload: players }),
      applyPlayerStatus: (payload) => dispatch({ type: "PLAYER_STATUS", payload }),
      applyGameStart: (payload) => dispatch({ type: "GAME_START", payload }),
      tickTimer: (remainingMs) => dispatch({ type: "TIMER_TICK", payload: { remainingMs } }),
      applySubmissionPhase: (payload) => dispatch({ type: "SUBMISSION_PHASE", payload }),
      setMessages: (messages) => dispatch({ type: "SET_MESSAGES", payload: messages }),
      addMessage: (message) => dispatch({ type: "NEW_MESSAGE", payload: message }),
      applyGameEnd: (payload) => dispatch({ type: "GAME_END", payload }),
      setResult: (result) => dispatch({ type: "SET_RESULT", payload: result }),
      applyGameCancelled: (payload) => dispatch({ type: "GAME_CANCELLED", payload }),
    }),
    []
  );

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}