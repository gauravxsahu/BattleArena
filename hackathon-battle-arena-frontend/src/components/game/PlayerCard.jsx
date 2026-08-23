import { CheckCircle2, Clock } from "lucide-react";
import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import { EXPERIENCE_LABELS } from "../../utils/constants";

/**
 * Renders whatever player data is available. GET /games/:gameId/players
 * returns id/name/rating for each member (no experience level or skills),
 * so those fields degrade gracefully instead of being invented client-side.
 */
export default function PlayerCard({ player, isCurrentUser = false }) {
  const user = player.user || player;
  const isReady = player.isReady;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
        isCurrentUser ? "border-arena-primary/40 bg-arena-primary/5" : "border-arena-border bg-arena-surface2"
      }`}
    >
      <Avatar name={user.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-arena-text">
          {user.name} {isCurrentUser && <span className="text-arena-muted">(you)</span>}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-arena-muted">
          <span>Rating {user.rating ?? "—"}</span>
          {user.experienceLevel && (
            <>
              <span>·</span>
              <span>{EXPERIENCE_LABELS[user.experienceLevel] || user.experienceLevel}</span>
            </>
          )}
        </div>
        {user.topSkills?.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {user.topSkills.slice(0, 3).map((skill) => (
              <Badge key={skill} color="neutral" className="!py-0.5 !text-[10px]">
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {isReady !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-medium ${isReady ? "text-arena-accent" : "text-arena-muted"}`}>
          {isReady ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
          {isReady ? "Ready" : "Waiting"}
        </span>
      )}
    </div>
  );
}
