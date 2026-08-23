import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Swords, Users, Clock, Zap, X, ArrowLeft } from "lucide-react";
import { matchmakingApi } from "../../services/matchmakingApi";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import { GAME_MODES, EXPERIENCE_LABELS } from "../../utils/constants";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";
import { formatDuration, formatNumber } from "../../utils/formatters";

const POLL_INTERVAL_MS = 2500;
const QUEUEABLE_MODES = ["BATTLE", "BUG_FIX"];

export default function MatchmakingPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const modeParam = (searchParams.get("mode") || "BATTLE").toUpperCase();
  const mode = QUEUEABLE_MODES.includes(modeParam) ? modeParam : "BATTLE";
  const modeInfo = GAME_MODES[mode];
  const playersRequired = modeInfo.playersRequired;

  const [status, setStatus] = useState(null); // { inQueue, queuePosition, queueSize, matchedGameId }
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState(null);
  const [matchFound, setMatchFound] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const pollRef = useRef(null);

  const refreshStatus = useCallback(async () => {
    try {
      const data = await matchmakingApi.status(mode);
      setStatus(data);
      if (data.matchedGameId) {
        setMatchFound(true);
        setTimeout(() => navigate(`/games/${data.matchedGameId}/lobby`), 1800);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, mode]);

  useEffect(() => {
    setStatus(null);
    setMatchFound(false);
    setError(null);
    refreshStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (status?.inQueue) {
      pollRef.current = setInterval(refreshStatus, POLL_INTERVAL_MS);
    } else if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [status?.inQueue, refreshStatus]);

  useEffect(() => {
    if (!status?.inQueue) {
      setElapsedMs(0);
      return undefined;
    }
    const interval = setInterval(() => {
      setElapsedMs((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [status?.inQueue]);

  useEffect(() => {
    if (!socket) return undefined;
    const handleMatched = (payload) => {
      setMatchFound(true);
      setTimeout(() => navigate(`/games/${payload.gameId}/lobby`), 1800);
    };
    socket.on("matchmaking:matched", handleMatched);
    return () => socket.off("matchmaking:matched", handleMatched);
  }, [socket, navigate]);

  const handleJoin = async () => {
    setIsJoining(true);
    setError(null);
    try {
      const data = await matchmakingApi.join(mode);
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    setIsLeaving(true);
    setError(null);
    try {
      const data = await matchmakingApi.leave(mode);
      setStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLeaving(false);
    }
  };

  if (matchFound) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center animate-fade-in px-4">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-arena-primary/15 shadow-glow">
          <Swords className="h-12 w-12 animate-pulse-slow text-arena-primary" />
        </div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          MATCH FOUND <span className="text-arena-warning">⚡</span>
        </h1>
        <p className="mt-3 text-base text-arena-muted sm:text-lg">
          {playersRequired} PLAYERS · {playersRequired > 2 ? "TEAM A vs TEAM B" : "1v1"}
        </p>
        <p className="mt-6 text-sm text-arena-muted">Taking you to the lobby...</p>
      </div>
    );
  }

  const found = status?.queueSize ? Math.min(playersRequired, status.queueSize) : 0;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Link to="/play" className="mb-4 flex items-center gap-1.5 text-sm text-arena-muted hover:text-arena-text">
          <ArrowLeft className="h-4 w-4" /> Choose a different mode
        </Link>

        <ErrorMessage message={error} className="mb-4" />

        {!status?.inQueue ? (
          <Card className="text-center" glass>
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-arena-primary/15">
              <Swords className="h-8 w-8 text-arena-primary" />
            </div>
            <h1 className="text-xl font-black tracking-tight sm:text-2xl">{modeInfo.label.toUpperCase()}</h1>
            <p className="mt-2 text-sm text-arena-muted">
              Players required: <span className="font-semibold text-arena-text">{playersRequired}</span> ·{" "}
              {modeInfo.durationMinutes} min timer
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-arena-surface2 px-4 py-3">
                <p className="text-xs uppercase text-arena-muted">Your Rating</p>
                <p className="text-xl font-bold">{formatNumber(user?.rating)}</p>
              </div>
              <div className="rounded-xl bg-arena-surface2 px-4 py-3">
                <p className="text-xs uppercase text-arena-muted">Experience</p>
                <p className="text-xl font-bold">{EXPERIENCE_LABELS[user?.profile?.experienceLevel] || "—"}</p>
              </div>
            </div>

            <Button className="mt-8 w-full text-base" onClick={handleJoin} isLoading={isJoining} icon={Swords}>
              Find Match
            </Button>
          </Card>
        ) : (
          <Card className="text-center" glass>
            <p className="text-sm font-semibold uppercase tracking-widest text-arena-primary">Finding opponents...</p>

            <div className="my-8 flex flex-wrap items-center justify-center gap-2">
              {Array.from({ length: playersRequired }).map((_, i) => (
                <div
                  key={i}
                  className={`h-9 w-9 rounded-full border-2 transition-all duration-500 ${
                    i < found ? "border-arena-primary bg-arena-primary/30" : "border-arena-border bg-arena-surface2"
                  }`}
                />
              ))}
            </div>

            <p className="text-3xl font-black">
              {found} <span className="text-arena-muted">/ {playersRequired}</span>
            </p>
            <p className="mt-1 text-sm text-arena-muted">players found</p>

            <ProgressBar value={found} max={playersRequired} className="mt-5" />

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-arena-muted sm:gap-6">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Searching {formatDuration(elapsedMs)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> Position #{status.queuePosition ?? "—"}
              </span>
            </div>

            <Button variant="danger" className="mt-8 w-full" onClick={handleLeave} isLoading={isLeaving} icon={X}>
              Cancel Search
            </Button>
          </Card>
        )}

        <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-arena-muted">
          <Zap className="h-3.5 w-3.5" /> Teams are balanced by rating, experience and skill coverage.
        </p>
      </div>
    </div>
  );
}
