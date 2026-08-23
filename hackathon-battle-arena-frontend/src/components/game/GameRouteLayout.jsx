import { Outlet, useParams } from "react-router-dom";
import { GameProvider } from "../../context/GameContext.jsx";

/**
 * Wraps every /games/:gameId/* route with a fresh GameContext, keyed by
 * gameId so navigating between games (e.g. Play Again -> new match)
 * doesn't leak stale state from the previous game.
 */
export default function GameRouteLayout() {
  const { gameId } = useParams();
  return (
    <GameProvider key={gameId}>
      <Outlet />
    </GameProvider>
  );
}
