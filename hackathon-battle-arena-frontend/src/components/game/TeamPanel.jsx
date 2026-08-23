import PlayerCard from "./PlayerCard.jsx";

export default function TeamPanel({ label, members, currentUserId, accent = "primary" }) {
  const colorClass = accent === "primary" ? "text-arena-primary border-arena-primary/30" : "text-arena-accent border-arena-accent/30";

  return (
    <div className={`rounded-2xl border ${colorClass} bg-arena-surface p-4`}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`text-sm font-bold uppercase tracking-wide ${accent === "primary" ? "text-arena-primary" : "text-arena-accent"}`}>{label}</h3>
        <span className="text-xs text-arena-muted">{members.length} players</span>
      </div>
      <div className="space-y-2">
        {members.map((member) => (
          <PlayerCard key={member.userId || member.user?.id} player={member} isCurrentUser={(member.userId || member.user?.id) === currentUserId} />
        ))}
      </div>
    </div>
  );
}
