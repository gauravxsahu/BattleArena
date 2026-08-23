import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute.jsx";
import PublicRoute from "./PublicRoute.jsx";

import AuthLayout from "../layouts/AuthLayout.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import GameRouteLayout from "../components/game/GameRouteLayout.jsx";

import LoginPage from "../pages/auth/LoginPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import DashboardPage from "../pages/dashboard/DashboardPage.jsx";
import ProfilePage from "../pages/profile/ProfilePage.jsx";
import SkillsPage from "../pages/profile/SkillsPage.jsx";
import PlayerProfilePage from "../pages/profile/PlayerProfilePage.jsx";
import PlayModePage from "../pages/matchmaking/PlayModePage.jsx";
import MatchmakingPage from "../pages/matchmaking/MatchmakingPage.jsx";
import PracticePage from "../pages/matchmaking/PracticePage.jsx";
import FriendChallengePage from "../pages/matchmaking/FriendChallengePage.jsx";
import GamesHistoryPage from "../pages/games/GamesHistoryPage.jsx";
import GameLobbyPage from "../pages/game/GameLobbyPage.jsx";
import GameArenaPage from "../pages/game/GameArenaPage.jsx";
import SubmissionPage from "../pages/game/SubmissionPage.jsx";
import EvaluationPage from "../pages/game/EvaluationPage.jsx";
import ResultPage from "../pages/game/ResultPage.jsx";
import LeaderboardPage from "../pages/leaderboard/LeaderboardPage.jsx";
import BadgesPage from "../pages/badges/BadgesPage.jsx";
import NotificationsPage from "../pages/notifications/NotificationsPage.jsx";
import SettingsPage from "../pages/settings/SettingsPage.jsx";
import NotFoundPage from "../pages/errors/NotFoundPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public (auth) routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/skills" element={<SkillsPage />} />
          <Route path="/users/:userId" element={<PlayerProfilePage />} />

          {/* Game mode selection + per-mode entry points */}
          <Route path="/play" element={<PlayModePage />} />
          <Route path="/matchmaking" element={<MatchmakingPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/friend-challenge" element={<FriendChallengePage />} />

          <Route path="/games" element={<GamesHistoryPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/badges" element={<BadgesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Game subtree shares a GameContext instance per gameId */}
          <Route path="/games/:gameId" element={<GameRouteLayout />}>
            <Route index element={<GameArenaPage />} />
            <Route path="lobby" element={<GameLobbyPage />} />
            <Route path="submission" element={<SubmissionPage />} />
            <Route path="evaluation" element={<EvaluationPage />} />
            <Route path="result" element={<ResultPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
