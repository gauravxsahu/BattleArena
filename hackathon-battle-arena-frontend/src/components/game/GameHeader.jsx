import Badge from "../ui/Badge.jsx";
import TimerDisplay from "./TimerDisplay.jsx";
import ConnectionStatus from "../common/ConnectionStatus.jsx";
import { GAME_STATUS_LABELS } from "../../utils/constants";

const STATUS_COLORS = {
  WAITING: "neutral",
  TEAM_FORMING: "neutral",
  READY: "primary",
  RUNNING: "accent",
  SUBMISSION: "warning",
  EVALUATING: "warning",
  COMPLETED: "primary",
  CANCELLED: "danger",
};

export default function GameHeader({ challenge, status, endTime, liveRemainingMs }) {
  return (
    <div className="glass-panel flex flex-wrap items-center justify-between gap-4 p-4">
      <div className="min-w-0">
        <p className="truncate text-lg font-bold text-arena-text">{challenge?.title || "Loading challenge..."}</p>
        <div className="mt-1 flex items-center gap-2">
          <Badge color={STATUS_COLORS[status] || "neutral"}>{GAME_STATUS_LABELS[status] || status}</Badge>
          <ConnectionStatus />
        </div>
      </div>
      <TimerDisplay endTime={endTime} liveRemainingMs={liveRemainingMs} />
    </div>
  );
}
