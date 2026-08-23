import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Lock, Clock } from "lucide-react";
import { gameApi } from "../../services/gameApi";
import { submissionApi } from "../../services/submissionApi";
import { useGame } from "../../hooks/useGame";
import { useGameSocket } from "../../hooks/useGameSocket";
import Card from "../../components/ui/Card.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import SubmissionForm from "../../components/submission/SubmissionForm.jsx";
import TimerDisplay from "../../components/game/TimerDisplay.jsx";
import { GAME_STATUS } from "../../utils/constants";

export default function SubmissionPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const game = useGame();
  useGameSocket(gameId); // keep timer/status live while on this screen

  const [isLoading, setIsLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      game.game ? Promise.resolve(game.game) : gameApi.get(gameId),
      submissionApi.list(gameId).catch(() => []),
    ])
      .then(([gameData, submissions]) => {
        if (!mounted) return;
        if (!game.game) game.setGame(gameData);
        // A team's own submission — the backend enforces one-per-team, so if
        // any submission in the list belongs to the user's team it's final.
        if (submissions?.length) setExistingSubmission(submissions[0]);
      })
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameId]);

  useEffect(() => {
    if (game.game?.status === GAME_STATUS.EVALUATING) {
      navigate(`/games/${gameId}/evaluation`);
    } else if (game.game?.status === GAME_STATUS.COMPLETED) {
      navigate(`/games/${gameId}/result`);
    }
  }, [game.game?.status, gameId, navigate]);

  const deadlinePassed = game.timer.remainingMs === 0 && game.game?.status !== GAME_STATUS.RUNNING && game.game?.status !== GAME_STATUS.SUBMISSION;
  const submissionsClosed = deadlinePassed || game.game?.status === GAME_STATUS.EVALUATING || game.game?.status === GAME_STATUS.COMPLETED;

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const created = await submissionApi.submit(gameId, {
        githubUrl: values.githubUrl,
        demoUrl: values.demoUrl || undefined,
        description: values.description,
      });
      setExistingSubmission(created);
      setJustSubmitted(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-arena-primary">Final Submission</p>
          <h1 className="mt-1 text-2xl font-black">Submit Your Solution</h1>
        </div>
        {!submissionsClosed && (
          <div className="text-right">
            <p className="mb-1 flex items-center justify-end gap-1 text-xs text-arena-muted">
              <Clock className="h-3.5 w-3.5" /> Deadline
            </p>
            <TimerDisplay endTime={game.timer.endTime || game.game?.endTime} liveRemainingMs={game.timer.remainingMs} />
          </div>
        )}
      </div>

      <Card>
        {existingSubmission ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-arena-accent/15">
              <CheckCircle2 className="h-7 w-7 text-arena-accent" />
            </div>
            <h2 className="text-xl font-bold text-arena-accent">SUBMITTED ✓</h2>
            <p className="mt-2 max-w-sm text-sm text-arena-muted">
              {justSubmitted ? "Your final solution is locked in." : "Your team has already submitted a final solution."} Only one
              submission per team is allowed.
            </p>
            <div className="mt-6 w-full space-y-2 rounded-xl bg-arena-surface2 p-4 text-left text-sm">
              <p>
                <span className="text-arena-muted">GitHub:</span>{" "}
                <a href={existingSubmission.githubUrl} target="_blank" rel="noreferrer" className="text-arena-primary hover:underline">
                  {existingSubmission.githubUrl}
                </a>
              </p>
              {existingSubmission.demoUrl && (
                <p>
                  <span className="text-arena-muted">Demo:</span>{" "}
                  <a href={existingSubmission.demoUrl} target="_blank" rel="noreferrer" className="text-arena-primary hover:underline">
                    {existingSubmission.demoUrl}
                  </a>
                </p>
              )}
            </div>
          </div>
        ) : submissionsClosed ? (
          <div className="flex flex-col items-center py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-arena-danger/15">
              <Lock className="h-7 w-7 text-arena-danger" />
            </div>
            <h2 className="text-xl font-bold text-arena-danger">SUBMISSIONS CLOSED</h2>
            <p className="mt-2 text-sm text-arena-muted">The submission window for this game has ended.</p>
          </div>
        ) : (
          <SubmissionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitError={submitError} disabled={false} />
        )}
      </Card>
    </div>
  );
}
