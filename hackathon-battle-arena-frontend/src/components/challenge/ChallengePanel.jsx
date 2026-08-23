import { useState } from "react";
import { CheckCircle2, Star, Clock, BarChart3, Bug, Copy, Check } from "lucide-react";
import Card from "../ui/Card.jsx";
import Badge from "../ui/Badge.jsx";
import Skeleton from "../ui/Skeleton.jsx";
import { EXPERIENCE_LABELS, GAME_MODES, GAME_DURATION_MINUTES } from "../../utils/constants";

const CRITERIA_LABELS = {
  functionality: "Functionality",
  codeQuality: "Code Quality",
  innovation: "Innovation",
  ui: "UI/UX",
  performance: "Performance",
};

export default function ChallengePanel({ challenge, isLoading }) {
  const [copied, setCopied] = useState(false);

  if (isLoading) {
    return (
      <Card className="space-y-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card>
        <p className="text-sm text-arena-muted">The challenge will appear here once the match begins.</p>
      </Card>
    );
  }

  const isBugFix = challenge.mode === "BUG_FIX" && Boolean(challenge.starterCode);
  const durationMinutes = GAME_MODES[challenge.mode]?.durationMinutes ?? GAME_DURATION_MINUTES;

  const handleCopyStarterCode = async () => {
    if (!challenge.starterCode) return;
    try {
      await navigator.clipboard.writeText(challenge.starterCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access can fail silently in some contexts — code remains visible to copy manually
    }
  };

  return (
    <Card className="max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-arena-text">{challenge.title}</h2>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge color="primary">
          <Star className="mr-1 h-3 w-3" /> {EXPERIENCE_LABELS[challenge.difficulty] || challenge.difficulty}
        </Badge>
        <Badge color="neutral">
          <Clock className="mr-1 h-3 w-3" /> {durationMinutes} minutes
        </Badge>
        {isBugFix && (
          <Badge color="danger">
            <Bug className="mr-1 h-3 w-3" /> Bug Hunt
          </Badge>
        )}
      </div>

      <section className="mb-5">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-arena-muted">Description</h3>
        <p className="text-sm leading-relaxed text-arena-text">{challenge.description}</p>
      </section>

      {isBugFix && (
        <section className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wide text-arena-muted">Starter Code (has bugs!)</h3>
            <button
              onClick={handleCopyStarterCode}
              className="flex items-center gap-1 text-xs text-arena-muted hover:text-arena-text"
              aria-label="Copy starter code"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-arena-accent" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre rounded-xl border border-arena-border bg-arena-surface2 p-4 text-xs leading-relaxed text-arena-text scrollbar-thin">
            <code>{challenge.starterCode}</code>
          </pre>
        </section>
      )}

      <section className="mb-5">
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-arena-muted">
          {isBugFix ? "Bugs to Find & Fix" : "Requirements"}
        </h3>
        <ul className="space-y-1.5">
          {challenge.requirements?.map((req) => (
            <li key={req} className="flex items-start gap-2 text-sm text-arena-text">
              {isBugFix ? (
                <Bug className="mt-0.5 h-4 w-4 shrink-0 text-arena-danger" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-arena-accent" />
              )}
              {req}
            </li>
          ))}
        </ul>
      </section>

      {challenge.bonusRequirements?.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-arena-muted">Bonus Requirements</h3>
          <ul className="space-y-1.5">
            {challenge.bonusRequirements.map((req) => (
              <li key={req} className="flex items-start gap-2 text-sm text-arena-muted">
                <Star className="mt-0.5 h-4 w-4 shrink-0 text-arena-warning" />
                {req}
              </li>
            ))}
          </ul>
        </section>
      )}

      {challenge.evaluationCriteria && (
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-arena-muted">
            <BarChart3 className="h-3.5 w-3.5" /> Evaluation Criteria
          </h3>
          <div className="space-y-2">
            {Object.entries(challenge.evaluationCriteria).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-arena-text">{CRITERIA_LABELS[key] || key}</span>
                <span className="font-semibold text-arena-muted">{value}%</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </Card>
  );
}
