import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Swords,
  Trophy,
  User,
  Wrench,
  Award,
  Bell,
  Settings,
  LogOut,
  Gamepad2,
  Search,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNotifications } from "../../hooks/useNotifications";
import Avatar from "../ui/Avatar";
import SearchOverlay from "../common/SearchOverlay.jsx";
import { formatNumber } from "../../utils/formatters";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/play", label: "Play", icon: Swords },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/profile/skills", label: "Skills", icon: Wrench },
  { to: "/badges", label: "Badges", icon: Award },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-arena-border bg-arena-surface/60 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-arena-primary to-arena-accent">
          <Swords className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight">
          Battle<span className="text-gradient">Arena</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-arena-muted transition-colors hover:bg-arena-surface2 hover:text-arena-text"
        >
          <Search className="h-4.5 w-4.5" />
          Search Players
        </button>

        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-arena-primary/15 text-arena-primary"
                  : "text-arena-muted hover:bg-arena-surface2 hover:text-arena-text"
              }`
            }
          >
            <span className="flex items-center gap-3">
              <Icon className="h-4.5 w-4.5" />
              {label}
            </span>
            {label === "Notifications" && unreadCount > 0 && (
              <span className="rounded-full bg-arena-danger px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-arena-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-arena-surface2 px-3 py-2.5">
          <Avatar name={user?.name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-arena-text">{user?.name}</p>
            <p className="text-xs text-arena-muted">Rating {formatNumber(user?.rating)}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-arena-muted transition-colors hover:bg-arena-danger/10 hover:text-arena-danger"
        >
          <LogOut className="h-4.5 w-4.5" />
          Logout
        </button>
      </div>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </aside>
  );
}
