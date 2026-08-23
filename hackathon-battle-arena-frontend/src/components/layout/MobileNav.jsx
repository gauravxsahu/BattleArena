import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Swords, LayoutDashboard, Trophy, User, Gamepad2, LogOut, Search } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../ui/Avatar";
import SearchOverlay from "../common/SearchOverlay.jsx";

const BOTTOM_ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/play", label: "Play", icon: Swords },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/leaderboard", label: "Ranks", icon: Trophy },
  { to: "/profile", label: "Profile", icon: User },
];

export function MobileTopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <>
      <header className="flex items-center justify-between border-b border-arena-border bg-arena-surface/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-arena-primary to-arena-accent">
            <Swords className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold">
            Battle<span className="text-gradient">Arena</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search players"
            className="rounded-lg p-2 text-arena-text hover:bg-arena-surface2"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 text-arena-text hover:bg-arena-surface2"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setIsOpen(false)} />
          <div className="glass-panel absolute right-0 top-0 h-full w-72 animate-slide-up rounded-none border-l p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name} size="sm" />
                <div>
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-arena-muted">Rating {user?.rating}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} aria-label="Close menu" className="rounded-lg p-1.5 hover:bg-arena-surface2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1">
              {[
                { to: "/dashboard", label: "Dashboard" },
                { to: "/play", label: "Play" },
                { to: "/games", label: "Games" },
                { to: "/leaderboard", label: "Leaderboard" },
                { to: "/profile", label: "Profile" },
                { to: "/profile/skills", label: "Skills" },
                { to: "/badges", label: "Badges" },
                { to: "/notifications", label: "Notifications" },
                { to: "/settings", label: "Settings" },
              ].map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2.5 text-sm font-medium ${isActive ? "bg-arena-primary/15 text-arena-primary" : "text-arena-muted hover:bg-arena-surface2"}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={logout}
                className="mt-4 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-arena-danger hover:bg-arena-danger/10"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-arena-border bg-arena-surface/95 backdrop-blur-xl lg:hidden">
      {BOTTOM_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/dashboard"}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium ${isActive ? "text-arena-primary" : "text-arena-muted"}`
          }
        >
          <Icon className="h-5 w-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
