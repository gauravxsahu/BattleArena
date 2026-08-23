import { useEffect, useState } from "react";
import { Gamepad2 } from "lucide-react";
import { gameApi } from "../../services/gameApi";
import PageHeader from "../../components/common/PageHeader.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import GameHistoryCard from "../../components/game/GameHistoryCard.jsx";

export default function GamesHistoryPage() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    gameApi
      .listMine()
      .then((data) => mounted && setGames(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <PageHeader title="Game History" subtitle="Every hackathon battle you've competed in." />

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-arena-danger">{error}</p>
      ) : games.length === 0 ? (
        <EmptyState icon={Gamepad2} title="No games yet" description="Join matchmaking to play your first hackathon battle." />
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <GameHistoryCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}
