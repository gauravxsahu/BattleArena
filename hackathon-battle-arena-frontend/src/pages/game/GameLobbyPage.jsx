import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CheckCircle2, Loader2, Swords, XCircle, Timer } from "lucide-react";
import { gameApi } from "../../services/gameApi";
import { useAuth } from "../../hooks/useAuth";
import { useGame } from "../../hooks/useGame";
import { useGameSocket } from "../../hooks/useGameSocket";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import TeamPanel from "../../components/game/TeamPanel.jsx";
import { GAME_STATUS } from "../../utils/constants";

const READY_CHECK_SECONDS = 90; // mirrors the backend's READY_CHECK_TIMEOUT_MS

export default function GameLobbyPage() {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const game = useGame();
  const { sendReady } = useGameSocket(gameId);

  const [isLoading, setIsLoading] = useState(true);
  const [isReadying, setIsReadying] = useState(false);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(READY_CHECK_SECONDS);

  useEffect(() => {
    let mounted = true;
    game.setLoading();
    Promise.all([gameApi.get(gameId), gameApi.players(gameId)])
      .then(([gameData, playersData]) => {
        if (!mounted) return;
        game.setGame(gameData);
        setPlayers(playersData);
        game.setPlayers(playersData);
      })
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // Keep local `players` in sync with live ready-status updates from context.
  useEffect(() => {
    if (game.players?.length) setPlayers(game.players);
  }, [game.players]);

  useEffect(() => {
    if (game.game?.status === GAME_STATUS.RUNNING) {
      navigate(`/games/${gameId}`, { replace: true });
    }
  }, [game.game?.status, gameId, navigate]);

  // Local visual countdown only — the backend independently enforces the
  // real timeout and will emit `game:cancelled` regardless of this display.
  useEffect(() => {
    if (game.cancellation || game.game?.status === GAME_STATUS.RUNNING) return undefined;
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [game.cancellation, game.game?.status]);

  const handleReady = async () => {
    setIsReadying(true);
    setError(null);
    try {
      await sendReady();
    } catch (err) {
      // Socket ready failed — fall back to the REST endpoint.
      try {
        await gameApi.ready(gameId);
      } catch (restErr) {
        setError(restErr.message || err.message);
      }
    } finally {
      setIsReadying(false);
    }
  };

  const teamA = players.filter((p) => p.team?.side === "TEAM_A");
  const teamB = players.filter((p) => p.team?.side === "TEAM_B");
  const isSolo = teamB.length === 0; // PRACTICE mode: only one team, no opponent
  const myMembership = players.find((p) => (p.userId || p.user?.id) === user?.id);
  const readyCount = players.filter((p) => p.isReady).length;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </div>
    );
  }

  if (game.cancellation) {
    const iWasNotReady = game.cancellation.notReadyUserIds.includes(user?.id);
    return (
      <div className="mx-auto max-w-md animate-fade-in text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-arena-danger/15">
          <XCircle className="h-7 w-7 text-arena-danger" />
        </div>
        <h1 className="text-xl font-bold text-arena-danger">Match Cancelled</h1>
        <p className="mt-2 text-sm text-arena-muted">
          {iWasNotReady
            ? "You didn't ready up in time, so this match was cancelled."
            : "Not everyone readied up in time, so this match was cancelled. You've been placed back in the matchmaking queue."}
        </p>
        <Link to="/play" className="mt-6 inline-block">
          <Button icon={Swords}>Find a New Match</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-arena-primary">Game Lobby</p>
        <h1 className="mt-1 text-2xl font-black">Get Ready to Compete</h1>
        <p className="mt-2 text-sm text-arena-muted">
          {readyCount} / {players.length} players ready · Challenge loading once everyone is ready
        </p>
        {secondsLeft > 0 && secondsLeft <= 30 && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-sm font-semibold text-arena-warning">
            <Timer className="h-4 w-4" /> {secondsLeft}s left to ready up
          </p>
        )}
      </div>

      <ErrorMessage message={error} className="mb-4" />

      <div className={isSolo ? "mx-auto max-w-md" : "grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-start"}>
        <TeamPanel label={isSolo ? "You" : "Team A"} members={teamA} currentUserId={user?.id} accent="primary" />
        {!isSolo && (
          <>
            <div className="flex items-center justify-center py-2 md:py-16">
              <span className="rounded-full border border-arena-border bg-arena-surface2 px-4 py-2 text-sm font-black text-arena-muted">VS</span>
            </div>
            <TeamPanel label="Team B" members={teamB} currentUserId={user?.id} accent="accent" />
          </>
        )}
      </div>

      <Card className="mt-6 flex flex-col items-center gap-4 text-center" glass>
        {myMembership?.isReady ? (
          <div className="flex items-center gap-2 text-arena-accent">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold">You're ready — waiting for teammates and opponents...</span>
          </div>
        ) : (
          <>
            <p className="text-sm text-arena-muted">Once you're ready, the challenge will be generated for both teams.</p>
            <Button onClick={handleReady} isLoading={isReadying} icon={Swords} className="w-full max-w-xs text-base">
              I'm Ready
            </Button>
          </>
        )}
        {game.game?.status === GAME_STATUS.TEAM_FORMING && readyCount === players.length && players.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-arena-muted">
            <Loader2 className="h-4 w-4 animate-spin" /> Challenge loading...
          </div>
        )}
      </Card>
    </div>
  );
}