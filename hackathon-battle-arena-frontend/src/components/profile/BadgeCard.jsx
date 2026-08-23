import { Lock, Award } from "lucide-react";
import Card from "../ui/Card.jsx";
import ProgressBar from "../ui/ProgressBar.jsx";

const ICONS_BY_CODE = {
  FIRST_WIN: "🏆",
  FIVE_WINS: "⭐",
  WIN_STREAK: "🔥",
  SPEED_CODER: "⚡",
  AI_MASTER: "🤖",
  TEAM_PLAYER: "🤝",
  HACKATHON_CHAMPION: "👑",
};

export default function BadgeCard({ badge, isUnlocked, progress }) {
  return (
    <Card className={`text-center transition-opacity ${isUnlocked ? "" : "opacity-50"}`}>
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-arena-surface2 text-3xl">
        {isUnlocked ? ICONS_BY_CODE[badge.code] || <Award className="h-7 w-7 text-arena-primary" /> : <Lock className="h-6 w-6 text-arena-muted" />}
      </div>
      <h3 className="font-bold text-arena-text">{badge.name}</h3>
      <p className="mt-1 text-xs text-arena-muted">{badge.description}</p>
      {!isUnlocked && progress !== undefined && (
        <div className="mt-3">
          <ProgressBar value={progress.value} max={progress.max} showLabel />
        </div>
      )}
      <p className={`mt-3 text-xs font-semibold ${isUnlocked ? "text-arena-accent" : "text-arena-muted"}`}>
        {isUnlocked ? "Unlocked" : "Locked"}
      </p>
    </Card>
  );
}
