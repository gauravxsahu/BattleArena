import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Coins, Zap, Target, TrendingUp, Swords, ChevronRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { leaderboardApi } from "../../services/leaderboardApi";
import { matchmakingApi } from "../../services/matchmakingApi";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import Badge from "../../components/ui/Badge.jsx";
import { formatNumber, formatWinRate } from "../../utils/formatters";

function StatCard({ icon: Icon, label, value, accent = "primary" }) {
  const colorMap = {
    primary: "text-arena-primary bg-arena-primary/10",
    accent: "text-arena-accent bg-arena-accent/10",
    warning: "text-arena-warning bg-arena-warning/10",
    danger: "text-arena-danger bg-arena-danger/10",
  };
  return (
    <Card className="flex items-center gap-4">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${colorMap[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-arena-muted">{label}</p>
        <p className="text-xl font-bold text-arena-text">{value}</p>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [rank, setRank] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null);
  const [isLoadingRank, setIsLoadingRank] = useState(true);

  useEffect(() => {
    let mounted = true;
    leaderboardApi
      .me()
      .then((data) => mounted && setRank(data))
      .catch(() => {})
      .finally(() => mounted && setIsLoadingRank(false));

    matchmakingApi
      .status()
      .then((data) => mounted && setQueueStatus(data))
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const winRate = formatWinRate(user?.wins, user?.losses);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-arena-text sm:text-3xl">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-sm text-arena-muted">Ready to build something great under pressure?</p>
        </div>
        <Link to="/play">
          <Button icon={Swords} className="shadow-glow">
            Play Now
          </Button>
        </Link>
      </div>

      {queueStatus?.inQueue && (
        <Card className="flex items-center justify-between border-arena-primary/40 bg-arena-primary/5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-arena-primary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-arena-primary" />
            </span>
            <p className="text-sm font-medium">
              You're in the matchmaking queue ({queueStatus.queuePosition ?? "?"} / {queueStatus.queueSize})
            </p>
          </div>
          <Link to="/play" className="text-sm font-semibold text-arena-primary hover:underline">
            View
          </Link>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard icon={TrendingUp} label="Rating" value={formatNumber(user?.rating)} accent="primary" />
        <StatCard icon={Zap} label="XP" value={formatNumber(user?.xp)} accent="accent" />
        <StatCard icon={Coins} label="Coins" value={formatNumber(user?.coins)} accent="warning" />
        <StatCard icon={Trophy} label="Wins" value={formatNumber(user?.wins)} accent="accent" />
        <StatCard icon={Target} label="Losses" value={formatNumber(user?.losses)} accent="danger" />
        <StatCard icon={TrendingUp} label="Win Rate" value={winRate} accent="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-arena-text">Your Standing</h2>
            <Link to="/leaderboard" className="flex items-center gap-1 text-sm font-medium text-arena-primary hover:underline">
              Full leaderboard <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {isLoadingRank ? (
            <Skeleton className="h-24 w-full" />
          ) : rank ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-arena-surface2 px-6 py-4">
                <span className="text-xs text-arena-muted">Global Rank</span>
                <span className="text-3xl font-black text-gradient">#{rank.rank ?? "—"}</span>
              </div>
              <div className="flex-1 space-y-2 text-sm">
                <div className="flex justify-between border-b border-arena-border pb-2">
                  <span className="text-arena-muted">Rating</span>
                  <span className="font-semibold">{formatNumber(rank.rating)}</span>
                </div>
                <div className="flex justify-between border-b border-arena-border pb-2">
                  <span className="text-arena-muted">Record</span>
                  <span className="font-semibold">
                    {rank.wins}W – {rank.losses}L
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-arena-muted">Coins earned</span>
                  <span className="font-semibold">{formatNumber(rank.coins)}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-arena-muted">Play your first match to appear on the leaderboard.</p>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-arena-text">Quick Actions</h2>
          <div className="space-y-2">
            <Link to="/profile/skills" className="flex items-center justify-between rounded-xl bg-arena-surface2 px-4 py-3 text-sm font-medium transition-colors hover:bg-arena-surface2/70">
              Manage skills <ChevronRight className="h-4 w-4 text-arena-muted" />
            </Link>
            <Link to="/profile" className="flex items-center justify-between rounded-xl bg-arena-surface2 px-4 py-3 text-sm font-medium transition-colors hover:bg-arena-surface2/70">
              Edit profile <ChevronRight className="h-4 w-4 text-arena-muted" />
            </Link>
            <Link to="/badges" className="flex items-center justify-between rounded-xl bg-arena-surface2 px-4 py-3 text-sm font-medium transition-colors hover:bg-arena-surface2/70">
              View badges <ChevronRight className="h-4 w-4 text-arena-muted" />
            </Link>
            <Link to="/games" className="flex items-center justify-between rounded-xl bg-arena-surface2 px-4 py-3 text-sm font-medium transition-colors hover:bg-arena-surface2/70">
              Game history <ChevronRight className="h-4 w-4 text-arena-muted" />
            </Link>
          </div>
          {user?.role === "ADMIN" && (
            <div className="mt-4">
              <Badge color="primary">Admin</Badge>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
