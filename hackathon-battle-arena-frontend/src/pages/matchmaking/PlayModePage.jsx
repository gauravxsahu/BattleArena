import { Link } from "react-router-dom";
import { Swords, Bug, Zap, UserPlus, ChevronRight } from "lucide-react";
import PageHeader from "../../components/common/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import { GAME_MODES } from "../../utils/constants";

const MODE_CARDS = [
  {
    key: "BATTLE",
    to: "/matchmaking?mode=BATTLE",
    icon: Swords,
    color: "text-arena-primary bg-arena-primary/10",
    title: GAME_MODES.BATTLE.label,
    description: "4 players, 2v2. Build a full app from scratch against a balanced opposing team.",
  },
  {
    key: "BUG_FIX",
    to: "/matchmaking?mode=BUG_FIX",
    icon: Bug,
    color: "text-arena-danger bg-arena-danger/10",
    title: GAME_MODES.BUG_FIX.label,
    description: "1v1. AI gives you buggy starter code — whoever fixes it best, fastest, wins.",
  },
  {
    key: "PRACTICE",
    to: "/practice",
    icon: Zap,
    color: "text-arena-accent bg-arena-accent/10",
    title: GAME_MODES.PRACTICE.label,
    description: "No opponent, no queue. Start instantly and get a timed AI project to practice on your own.",
  },
  {
    key: "FRIEND_CHALLENGE",
    to: "/friend-challenge",
    icon: UserPlus,
    color: "text-arena-warning bg-arena-warning/10",
    title: GAME_MODES.FRIEND_CHALLENGE.label,
    description: "1v1. Send a friend an invite code and battle them directly — no random matchmaking.",
  },
];

export default function PlayModePage() {
  return (
    <div>
      <PageHeader title="Play" subtitle="Pick a mode to get started." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {MODE_CARDS.map((mode) => {
          const Icon = mode.icon;
          const info = GAME_MODES[mode.key];
          return (
            <Link key={mode.key} to={mode.to}>
              <Card className="h-full transition-colors hover:border-arena-primary/40">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${mode.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-arena-text">{mode.title}</h2>
                <p className="mt-1.5 text-sm text-arena-muted">{mode.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-arena-muted">
                  <span>
                    {info.playersRequired === 1 ? "Solo" : `${info.playersRequired} players`} · {info.durationMinutes} min
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
