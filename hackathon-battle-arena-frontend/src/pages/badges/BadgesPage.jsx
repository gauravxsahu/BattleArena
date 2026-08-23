import { useEffect, useState } from "react";
import { userApi } from "../../services/userApi";
import { useAuth } from "../../hooks/useAuth";
import PageHeader from "../../components/common/PageHeader.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import BadgeCard from "../../components/profile/BadgeCard.jsx";
import { BADGES } from "../../utils/constants";

function progressFor(code, user) {
  if (code === "FIRST_WIN") return { value: Math.min(user?.wins || 0, 1), max: 1 };
  if (code === "FIVE_WINS") return { value: Math.min(user?.wins || 0, 5), max: 5 };
  if (code === "HACKATHON_CHAMPION") return { value: Math.min(user?.wins || 0, 10), max: 10 };
  return undefined;
}

export default function BadgesPage() {
  const { user } = useAuth();
  const [unlockedCodes, setUnlockedCodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    let mounted = true;
    userApi
      .getPublicProfile(user.id)
      .then((data) => {
        if (!mounted) return;
        setUnlockedCodes((data.badges || []).map((ub) => ub.badge.code));
      })
      .catch(() => {})
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  return (
    <div>
      <PageHeader title="Badges" subtitle="Milestones earned by competing in the arena." />

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {BADGES.map((badge) => (
            <BadgeCard
              key={badge.code}
              badge={badge}
              isUnlocked={unlockedCodes.includes(badge.code)}
              progress={progressFor(badge.code, user)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
