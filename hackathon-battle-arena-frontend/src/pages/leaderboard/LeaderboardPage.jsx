import { useEffect, useMemo, useState } from "react";
import { Search, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { leaderboardApi } from "../../services/leaderboardApi";
import { useAuth } from "../../hooks/useAuth";
import PageHeader from "../../components/common/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Input from "../../components/ui/Input.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import { formatNumber, formatWinRate } from "../../utils/formatters";

const MEDALS = ["🥇", "🥈", "🥉"];
const PAGE_SIZE = 20;

export default function LeaderboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    leaderboardApi
      .top(100)
      .then((data) => mounted && setRows(data))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase())), [rows, query]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        title="Global Leaderboard"
        subtitle="Ranked by rating — win high-stakes hackathon battles to climb."
        actions={
          <div className="w-56">
            <Input
              icon={Search}
              placeholder="Search player..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
        }
      />

      <Card className="overflow-hidden !p-0">
        {isLoading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState icon={Trophy} title="No players found" description="Try a different search term." />
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-arena-border text-xs uppercase tracking-wide text-arena-muted">
                  <th className="px-5 py-3 font-medium">Rank</th>
                  <th className="px-5 py-3 font-medium">Player</th>
                  <th className="px-5 py-3 font-medium">Rating</th>
                  <th className="px-5 py-3 font-medium">Wins</th>
                  <th className="px-5 py-3 font-medium">Losses</th>
                  <th className="px-5 py-3 font-medium">Win Rate</th>
                  <th className="px-5 py-3 font-medium">Coins</th>
                  <th className="px-5 py-3 font-medium">XP</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row) => {
                  const isMe = row.userId === user?.id;
                  return (
                    <tr
                      key={row.userId}
                      onClick={() => navigate(`/users/${row.userId}`)}
                      className={`cursor-pointer border-b border-arena-border/60 last:border-0 ${isMe ? "bg-arena-primary/10" : "hover:bg-arena-surface2/50"}`}
                    >
                      <td className="px-5 py-3 font-bold">
                        {row.rank <= 3 ? <span className="text-lg">{MEDALS[row.rank - 1]}</span> : `#${row.rank}`}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={row.name} size="sm" />
                          <span className={`font-medium ${isMe ? "text-arena-primary" : "text-arena-text"}`}>
                            {row.name} {isMe && "(you)"}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-semibold">{formatNumber(row.rating)}</td>
                      <td className="px-5 py-3 text-arena-accent">{row.wins}</td>
                      <td className="px-5 py-3 text-arena-danger">{row.losses}</td>
                      <td className="px-5 py-3 text-arena-muted">{formatWinRate(row.wins, row.losses)}</td>
                      <td className="px-5 py-3 text-arena-muted">{formatNumber(row.coins)}</td>
                      <td className="px-5 py-3 text-arena-muted">{formatNumber(row.xp)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-arena-border px-5 py-3 text-sm">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="text-arena-muted hover:text-arena-text disabled:opacity-30"
            >
              Previous
            </button>
            <span className="text-arena-muted">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="text-arena-muted hover:text-arena-text disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
