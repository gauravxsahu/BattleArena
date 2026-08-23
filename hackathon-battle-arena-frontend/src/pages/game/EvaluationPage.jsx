import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Sparkles, Loader2 } from "lucide-react";
import { gameApi } from "../../services/gameApi";
import { useAuth } from "../../hooks/useAuth";
import { useGame } from "../../hooks/useGame";
import { useGameSocket } from "../../hooks/useGameSocket";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import ProgressBar from "../../components/ui/ProgressBar.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";

const CRITERIA_LABELS = {
  functionality: { label: "Functionality", max: 30 },
  codeQuality: { label: "Code Quality", max: 20 },
  innovation: { label: "Innovation", max: 20 },
  ui: { label: "UI/UX", max: 15 },
  performance: { label: "Performance", max: 15 },
};

export default function EvaluationPage() {
  const { gameId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const game = useGame();
  useGameSocket(gameId);

  const [isLoading, setIsLoading] = useState(true);
  const [myTeamId, setMyTeamId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([game.game ? Promise.resolve(game.game) : gameApi.get(gameId), gameApi.players(gameId)])
      .then(([gameData, players]) => {
        if (!mounted) return;
        if (!game.game) game.setGame(gameData);
        game.setPlayers(players);
        const mine = players.find((p) => (p.userId || p.user?.id) === user?.id);
        setMyTeamId(mine?.teamId || mine?.team?.id);

        // If this tab loaded (or reloaded) after evaluation already finished,
        // the one-time `game:result` socket event was never received here —
        // fall back to fetching the persisted result over REST so a reload
        // never leaves the page permanently blank.
        if (!game.result && gameData.status === "COMPLETED") {
          return gameApi.result(gameId).then((full) => {
            if (!mounted) return;
            const teamScores = (full.teams || [])
              .map((team) => {
                const evaluation = team.submissions?.[0]?.evaluation;
                if (!evaluation) return null;
                return {
                  teamId: team.id,
                  automatedResults: evaluation.automatedResults,
                  automatedScore: evaluation.automatedScore,
                  aiResults: evaluation.aiResults,
                  aiScore: evaluation.aiScore,
                  finalScore: evaluation.finalScore,
                };
              })
              .filter(Boolean);
            if (teamScores.length > 0) {
              game.setResult({ gameId, teamScores, winnerTeamId: full.winnerTeamId });
            }
          });
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load evaluation");
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  const teamScore = game.result?.teamScores?.find((t) => t.teamId === myTeamId);
  const isDone = Boolean(game.result);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-arena-primary">
          {isDone ? "Evaluation Complete" : "Evaluation In Progress"}
        </p>
        <h1 className="mt-1 text-2xl font-black">{isDone ? "Here's how you scored" : "Judging your submission..."}</h1>
      </div>

      <ErrorMessage message={error} className="mb-6" />

      {isDone && !teamScore && !error && (
        <Card className="mb-6 text-center text-sm text-arena-muted" glass>
          Evaluation finished, but we couldn't find your team's score. Try refreshing the page.
        </Card>
      )}

      {!isDone && (
        <Card className="mb-6 flex flex-col items-center py-10 text-center" glass>
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-arena-primary" />
          <p className="text-sm text-arena-muted">
            Running automated requirement checks and AI evaluation. This usually takes a few moments — you'll see
            results here the instant they're ready.
          </p>
        </Card>
      )}

      {isDone && teamScore && (
        <>
          <Card className="mb-6 text-center" glass>
            <p className="text-sm text-arena-muted">Final Score</p>
            <p className="text-5xl font-black text-gradient">{Math.round(teamScore.finalScore)}</p>
            <p className="text-sm text-arena-muted">out of 100</p>
          </Card>

          <Card className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-arena-muted">
              <CheckCircle2 className="h-4 w-4 text-arena-accent" /> Automated Checks
            </h3>
            <ul className="space-y-2">
              {teamScore.automatedResults?.map((check, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  {check.passed ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-arena-accent" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-arena-danger" />
                  )}
                  <span className={check.passed ? "text-arena-text" : "text-arena-muted"}>{check.requirement}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="mb-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-arena-muted">
              <Sparkles className="h-4 w-4 text-arena-primary" /> AI Evaluation
            </h3>
            <div className="space-y-3">
              {Object.entries(CRITERIA_LABELS).map(([key, meta]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{meta.label}</span>
                    <span className="font-semibold">
                      {teamScore.aiResults?.[key] ?? 0} / {meta.max}
                    </span>
                  </div>
                  <ProgressBar value={teamScore.aiResults?.[key] ?? 0} max={meta.max} color="primary" />
                </div>
              ))}
            </div>

            {teamScore.aiResults?.feedback?.length > 0 && (
              <div className="mt-5 space-y-1.5 border-t border-arena-border pt-4">
                {teamScore.aiResults.feedback.map((line, i) => (
                  <p key={i} className="text-sm text-arena-muted">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </Card>

          <Button className="w-full" onClick={() => navigate(`/games/${gameId}/result`)}>
            View Full Result
          </Button>
        </>
      )}
    </div>
  );
}