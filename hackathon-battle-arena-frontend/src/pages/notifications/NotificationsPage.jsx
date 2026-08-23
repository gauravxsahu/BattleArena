import { Bell, CheckCheck, Swords, Trophy, Award, CheckCircle2 } from "lucide-react";
import { useNotifications } from "../../hooks/useNotifications";
import PageHeader from "../../components/common/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import { formatDate } from "../../utils/formatters";

const ICONS = {
  MATCH_FOUND: Swords,
  GAME_ENDED: Trophy,
  BADGE_AWARDED: Award,
  SUBMISSION_RECEIVED: CheckCircle2,
};

export default function NotificationsPage() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"}
        actions={
          notifications.length > 0 && (
            <Button variant="secondary" icon={CheckCheck} onClick={markAllRead}>
              Mark all read
            </Button>
          )
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="Match updates, game results, and badge unlocks will show up here in real time."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = ICONS[n.type] || Bell;
            return (
              <Card
                key={n.id}
                onClick={() => markRead(n.id)}
                className={`flex cursor-pointer items-start gap-3 transition-colors ${!n.read ? "border-arena-primary/40 bg-arena-primary/5" : ""}`}
              >
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-arena-surface2">
                  <Icon className="h-4 w-4 text-arena-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-arena-text">{n.message}</p>
                  <p className="mt-0.5 text-xs text-arena-muted">{formatDate(n.createdAt)}</p>
                </div>
                {!n.read && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-arena-primary" />}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
