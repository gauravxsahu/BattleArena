import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Users, MessageSquare, X } from "lucide-react";
import { gameApi } from "../../services/gameApi";
import { useAuth } from "../../hooks/useAuth";
import { useGame } from "../../hooks/useGame";
import { useGameSocket } from "../../hooks/useGameSocket";
import GameHeader from "../../components/game/GameHeader.jsx";
import ChallengePanel from "../../components/challenge/ChallengePanel.jsx";
import TeamPanel from "../../components/game/TeamPanel.jsx";
import TeamChat from "../../components/game/TeamChat.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import Button from "../../components/ui/Button.jsx";
import { GAME_STATUS } from "../../utils/constants";

export default function GameArenaPage() {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const game = useGame();
  const { sendMessage, isConnected } = useGameSocket(gameId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    game.setLoading();
    Promise.all([gameApi.get(gameId), gameApi.players(gameId), gameApi.messages(gameId).catch(() => [])])
      .then(([gameData, playersData, messagesData]) => {
        if (!mounted) return;
        game.setGame(gameData);
        game.setPlayers(playersData);
        game.setMessages(messagesData || []);
      })
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  // Backend-driven transitions — the frontend never decides these itself.
  useEffect(() => {
    const status = game.game?.status;
    if (status === GAME_STATUS.SUBMISSION) {
      navigate(`/games/${gameId}/submission`, { replace: false });
    } else if (status === GAME_STATUS.EVALUATING) {
      navigate(`/games/${gameId}/evaluation`, { replace: false });
    } else if (status === GAME_STATUS.COMPLETED) {
      navigate(`/games/${gameId}/result`, { replace: false });
    }
  }, [game.game?.status, gameId, navigate]);

  const teamA = game.players.filter((p) => p.team?.side === "TEAM_A");
  const teamB = game.players.filter((p) => p.team?.side === "TEAM_B");
  const isSolo = teamB.length === 0; // PRACTICE mode: no opponent team

  const handleSend = async (content) => {
    await sendMessage(content);
  };

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col gap-4 lg:h-[calc(100vh-48px)]">
      <ErrorMessage message={error} />

      <GameHeader
        challenge={game.game?.challenge}
        status={game.game?.status}
        endTime={game.timer.endTime || game.game?.endTime}
        liveRemainingMs={game.timer.remainingMs}
      />

      {/* Mobile toggles for teams / chat, since the desktop layout stacks them as side panels */}
      <div className="flex gap-2 lg:hidden">
        <Button variant="secondary" icon={Users} onClick={() => setIsTeamsOpen(true)} className="flex-1">
          Teams
        </Button>
        <Button variant="secondary" icon={MessageSquare} onClick={() => setIsChatOpen(true)} className="flex-1">
          Chat
        </Button>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[1fr_320px]">
        <ChallengePanel challenge={game.game?.challenge} isLoading={isLoading} />

        <div className="hidden flex-col gap-4 overflow-hidden lg:flex">
          <div className="space-y-3 overflow-y-auto scrollbar-thin">
            <TeamPanel label={isSolo ? "You" : "Team A"} members={teamA} currentUserId={user?.id} accent="primary" />
            {!isSolo && <TeamPanel label="Team B" members={teamB} currentUserId={user?.id} accent="accent" />}
          </div>
          <div className="card flex-1 overflow-hidden">
            <TeamChat messages={game.messages} onSend={handleSend} isConnected={isConnected} />
          </div>
        </div>
      </div>

      {/* Mobile drawers */}
      {isTeamsOpen && (
        <MobileDrawer title="Teams" onClose={() => setIsTeamsOpen(false)}>
          <div className="space-y-3 p-4">
            <TeamPanel label={isSolo ? "You" : "Team A"} members={teamA} currentUserId={user?.id} accent="primary" />
            {!isSolo && <TeamPanel label="Team B" members={teamB} currentUserId={user?.id} accent="accent" />}
          </div>
        </MobileDrawer>
      )}
      {isChatOpen && (
        <MobileDrawer title="Team Chat" onClose={() => setIsChatOpen(false)}>
          <TeamChat messages={game.messages} onSend={handleSend} isConnected={isConnected} />
        </MobileDrawer>
      )}

      <p className="text-center text-xs text-arena-muted lg:hidden">
        Need to submit? <Link to={`/games/${gameId}/submission`} className="font-semibold text-arena-primary">Go to submission</Link>
      </p>
    </div>
  );
}

function MobileDrawer({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-arena-bg lg:hidden">
      <div className="flex items-center justify-between border-b border-arena-border px-4 py-3">
        <h3 className="font-semibold">{title}</h3>
        <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 hover:bg-arena-surface2">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
