import { Link } from "react-router-dom";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import { formatDate } from "../../utils/formatters";
import { useAuth } from "../../hooks/useAuth";
import { GAME_STATUS } from "../../utils/constants";

const RESULT_COLORS = { WIN: "accent", LOSS: "danger", IN_PROGRESS: "primary" };

export default function GameHistoryCard({ game }) {
  const { user } = useAuth();
  const teamA = game.teams?.find((t) => t.side === "TEAM_A");
  const teamB = game.teams?.find((t) => t.side === "TEAM_B");
  const myTeam = game.teams?.find((t) => t.members?.some((m) => m.userId === user?.id));

  const scoreFor = (team) => team?.submissions?.[0]?.evaluation?.finalScore;
  const scoreA = scoreFor(teamA);
  const scoreB = scoreFor(teamB);

  let result = "IN_PROGRESS";
  if (game.status === GAME_STATUS.COMPLETED && myTeam) {
    result = game.winnerTeamId === myTeam.id ? "WIN" : "LOSS";
  }

  const linkTo = game.status === GAME_STATUS.COMPLETED ? `/games/${game.id}/result` : `/games/${game.id}`;

  return (
    <Link to={linkTo}>
      <Card className="flex items-center justify-between gap-4 transition-colors hover:border-arena-primary/40">
        <div>
          <p className="font-semibold text-arena-text">Game #{game.id.slice(0, 8)}</p>
          <p className="mt-0.5 text-xs text-arena-muted">{formatDate(game.createdAt)}</p>
        </div>

        {game.status === GAME_STATUS.COMPLETED ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="font-bold">{scoreA ?? "—"}</span>
            <span className="text-arena-muted">vs</span>
            <span className="font-bold">{scoreB ?? "—"}</span>
          </div>
        ) : (
          <span className="text-sm text-arena-muted">{game.status.replace("_", " ")}</span>
        )}

        <Badge color={RESULT_COLORS[result]}>{result.replace("_", " ")}</Badge>
      </Card>
    </Link>
  );
}
