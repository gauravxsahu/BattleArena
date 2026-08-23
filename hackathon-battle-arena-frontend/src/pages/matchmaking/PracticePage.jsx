import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { practiceApi } from "../../services/practiceApi";
import { useAuth } from "../../hooks/useAuth";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import { GAME_MODES } from "../../utils/constants";
import { formatNumber } from "../../utils/formatters";

export default function PracticePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState(null);

  const handleStart = async () => {
    setIsStarting(true);
    setError(null);
    try {
      // Solo games skip the ready-check lobby entirely (there's no one else
      // to wait for) — by the time this responds the AI challenge is
      // already generated and the timer is already running, so we go
      // straight to the arena.
      const game = await practiceApi.start();
      navigate(`/games/${game.id}`);
    } catch (err) {
      setError(err.message);
      setIsStarting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Link to="/play" className="mb-4 flex items-center gap-1.5 text-sm text-arena-muted hover:text-arena-text">
          <ArrowLeft className="h-4 w-4" /> Choose a different mode
        </Link>

        <ErrorMessage message={error} className="mb-4" />

        <Card className="text-center" glass>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-arena-accent/15">
            <Zap className="h-8 w-8 text-arena-accent" />
          </div>
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">SOLO PRACTICE</h1>
          <p className="mt-2 text-sm text-arena-muted">
            No opponent, no queue, no rating risk. AI gives you a{" "}
            <span className="font-semibold text-arena-text">{GAME_MODES.PRACTICE.durationMinutes}-minute</span> project
            based on your own skills — start whenever you're ready.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-arena-surface2 px-4 py-3">
              <p className="text-xs uppercase text-arena-muted">Your Rating</p>
              <p className="text-xl font-bold">{formatNumber(user?.rating)}</p>
              <p className="mt-0.5 text-[10px] text-arena-muted">Never changes in practice</p>
            </div>
            <div className="rounded-xl bg-arena-surface2 px-4 py-3">
              <p className="text-xs uppercase text-arena-muted">Reward</p>
              <p className="text-xl font-bold">Coins + XP</p>
              <p className="mt-0.5 text-[10px] text-arena-muted">Scaled to your score</p>
            </div>
          </div>

          <Button className="mt-8 w-full text-base" onClick={handleStart} isLoading={isStarting} icon={Zap}>
            Start Practice Now
          </Button>
        </Card>
      </div>
    </div>
  );
}
