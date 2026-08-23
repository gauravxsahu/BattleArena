import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Trophy, Coins, Zap, TrendingUp, TrendingDown, RotateCcw, ListOrdered, LayoutDashboard } from "lucide-react";
import { gameApi } from "../../services/gameApi";
import { useAuth } from "../../hooks/useAuth";
import { useGame } from "../../hooks/useGame";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import { formatSignedNumber } from "../../utils/formatters";

export default function ResultPage() {
  const { gameId } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const game = useGame();

  const [isLoading, setIsLoading] = useState(true);
  const [reward, setReward] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([gameApi.result(gameId), gameApi.myReward(gameId).catch(() => null)])
      .then(([gameData, rewardData]) => {
        if (!mounted) return;
        game.setGame(gameData);
        setReward(rewardData);
        refreshUser().catch(() => {});
      })
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (error || !game.game) {
    return (
      <div className="mx-auto max-w-md text-center">
        <p className="text-sm text-arena-danger">{error || "This game hasn't finished yet."}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-sm text-arena-primary hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const teams = game.game.teams || [];
  const isSolo = game.game.mode === "PRACTICE" || teams.length < 2;
  const teamA = teams.find((t) => t.side === "TEAM_A");
  const teamB = teams.find((t) => t.side === "TEAM_B");
  const winnerTeamId = game.game.winnerTeamId;

  const scoreFor = (team) => team?.submissions?.[0]?.evaluation?.finalScore;
  const myTeam = teams.find((t) => t.members?.some((m) => m.userId === user?.id));
  const isWinner = myTeam?.id === winnerTeamId;

  if (isSolo) {
    const myScore = scoreFor(myTeam);
    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black tracking-tight">
            PRACTICE COMPLETE <span className="text-arena-accent">⚡</span>
          </h1>
        </div>

        <Card className="text-center" glass>
          <p className="text-xs uppercase tracking-widest text-arena-muted">Your Score</p>
          <p className="mt-2 text-6xl font-black">{myScore !== undefined && myScore !== null ? Math.round(myScore) : "—"}</p>
          <p className="text-sm text-arena-muted">out of 100</p>
        </Card>

        {reward && (
          <Card className="mt-6">
            <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-arena-muted">Practice Reward</h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <RewardStat icon={Coins} label="Coins" value={formatSignedNumber(reward.coinDelta)} color="warning" />
              <RewardStat icon={Zap} label="XP" value={formatSignedNumber(reward.xpDelta)} color="accent" />
            </div>
            <p className="mt-4 text-center text-sm text-arena-muted">
              No rating change — practice mode never affects your competitive standing.
            </p>
          </Card>
        )}

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <Button icon={RotateCcw} onClick={() => navigate("/play")} className="w-full">
            Play Again
          </Button>
          <Button icon={ListOrdered} variant="secondary" onClick={() => navigate("/leaderboard")} className="w-full">
            View Leaderboard
          </Button>
          <Button icon={LayoutDashboard} variant="secondary" onClick={() => navigate("/dashboard")} className="w-full">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl animate-fade-in">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight">
          GAME COMPLETE <span className="text-arena-warning">🏆</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <TeamResultCard team={teamA} label="Team A" score={scoreFor(teamA)} isWinner={winnerTeamId === teamA?.id} accent="primary" />
        <TeamResultCard team={teamB} label="Team B" score={scoreFor(teamB)} isWinner={winnerTeamId === teamB?.id} accent="accent" />
      </div>

      <Card className="mt-6 text-center" glass>
        <p className="text-xs uppercase tracking-widest text-arena-muted">Winner</p>
        <p className="mt-1 text-2xl font-black text-arena-warning">
          {winnerTeamId === teamA?.id ? "Team A" : winnerTeamId === teamB?.id ? "Team B" : "—"}
        </p>
      </Card>

      {reward && (
        <Card className="mt-6">
          <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-arena-muted">Your Rewards</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <RewardStat icon={Coins} label="Coins" value={formatSignedNumber(reward.coinDelta)} color="warning" />
            <RewardStat icon={Zap} label="XP" value={formatSignedNumber(reward.xpDelta)} color="accent" />
            <RewardStat
              icon={reward.ratingDelta >= 0 ? TrendingUp : TrendingDown}
              label="Rating"
              value={formatSignedNumber(reward.ratingDelta)}
              color={reward.ratingDelta >= 0 ? "accent" : "danger"}
            />
          </div>
          <p className="mt-4 text-center text-sm text-arena-muted">
            {isWinner ? "+1 Win recorded — well played!" : "+1 Loss recorded — nice hustle, get 'em next time."}
          </p>
        </Card>
      )}

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Button icon={RotateCcw} onClick={() => navigate("/play")} className="w-full">
          Play Again
        </Button>
        <Button icon={ListOrdered} variant="secondary" onClick={() => navigate("/leaderboard")} className="w-full">
          View Leaderboard
        </Button>
        <Button icon={LayoutDashboard} variant="secondary" onClick={() => navigate("/dashboard")} className="w-full">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

function TeamResultCard({ team, label, score, isWinner, accent }) {
  const colorClass = accent === "primary" ? "border-arena-primary/40" : "border-arena-accent/40";
  return (
    <Card className={`relative text-center ${isWinner ? colorClass : ""}`} glass={isWinner}>
      {isWinner && <Trophy className="absolute right-3 top-3 h-5 w-5 text-arena-warning" />}
      <p className="text-xs font-bold uppercase tracking-widest text-arena-muted">{label}</p>
      <p className="mt-2 text-4xl font-black">{score !== undefined && score !== null ? Math.round(score) : "—"}</p>
      <p className="text-xs text-arena-muted">points</p>
      <div className="mt-4 flex justify-center -space-x-2">
        {team?.members?.map((m) => (
          <Avatar key={m.userId} name={m.user?.name} size="sm" className="ring-2 ring-arena-bg" />
        ))}
      </div>
    </Card>
  );
}

function RewardStat({ icon: Icon, label, value, color }) {
  const colorClass = { warning: "text-arena-warning", accent: "text-arena-accent", danger: "text-arena-danger" }[color];
  return (
    <div>
      <Icon className={`mx-auto h-5 w-5 ${colorClass}`} />
      <p className={`mt-1 text-xl font-bold ${colorClass}`}>{value}</p>
      <p className="text-xs text-arena-muted">{label}</p>
    </div>
  );
}
