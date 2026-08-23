import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Github, Linkedin, ArrowLeft } from "lucide-react";
import { userApi } from "../../services/userApi";
import PageHeader from "../../components/common/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Avatar from "../../components/ui/Avatar.jsx";
import Badge from "../../components/ui/Badge.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import BadgeCard from "../../components/profile/BadgeCard.jsx";
import { EXPERIENCE_LABELS, BADGES } from "../../utils/constants";
import { formatNumber, formatWinRate } from "../../utils/formatters";

export default function PlayerProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(null);
    userApi
      .getPublicProfile(userId)
      .then((data) => mounted && setProfile(data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-72 w-full lg:col-span-1" />
          <Skeleton className="h-72 w-full lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-md text-center">
        <ErrorMessage message={error || "Player not found"} />
        <Link to="/leaderboard" className="mt-4 inline-flex items-center gap-1 text-sm text-arena-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to leaderboard
        </Link>
      </div>
    );
  }

  const unlockedCodes = (profile.badges || []).map((ub) => ub.badge.code);
  const profileInfo = profile.profile || {};

  return (
    <div>
      <PageHeader title={profile.name} subtitle="Player profile" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center text-center lg:col-span-1">
          <Avatar name={profile.name} src={profileInfo.avatar} size="xl" />
          <h2 className="mt-4 text-lg font-bold text-arena-text">{profile.name}</h2>
          {profileInfo.experienceLevel && (
            <Badge color="primary" className="mt-2">
              {EXPERIENCE_LABELS[profileInfo.experienceLevel] || profileInfo.experienceLevel}
            </Badge>
          )}
          {profileInfo.bio && <p className="mt-3 text-sm text-arena-muted">{profileInfo.bio}</p>}

          <div className="mt-4 flex gap-3">
            {profileInfo.githubUrl && (
              <a href={profileInfo.githubUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-arena-surface2 p-2 text-arena-muted hover:text-arena-text" aria-label="GitHub profile">
                <Github className="h-4 w-4" />
              </a>
            )}
            {profileInfo.linkedinUrl && (
              <a href={profileInfo.linkedinUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-arena-surface2 p-2 text-arena-muted hover:text-arena-text" aria-label="LinkedIn profile">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>

          {profileInfo.preferredTechnologies?.length > 0 && (
            <div className="mt-5 w-full">
              <p className="mb-2 text-left text-xs font-semibold uppercase tracking-wide text-arena-muted">Technologies</p>
              <div className="flex flex-wrap gap-1.5">
                {profileInfo.preferredTechnologies.map((tech) => (
                  <Badge key={tech} color="neutral">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {profile.skills?.length > 0 && (
            <div className="mt-5 w-full">
              <p className="mb-2 text-left text-xs font-semibold uppercase tracking-wide text-arena-muted">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s) => (
                  <Badge key={s.skill.id || s.skill.name} color="accent">
                    {s.skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div className="lg:col-span-2">
          <Card className="mb-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-arena-muted">Stats</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <Stat label="Rating" value={formatNumber(profile.rating)} />
              <Stat label="Wins" value={formatNumber(profile.wins)} />
              <Stat label="Losses" value={formatNumber(profile.losses)} />
              <Stat label="Win Rate" value={formatWinRate(profile.wins, profile.losses)} />
              <Stat label="Coins" value={formatNumber(profile.coins)} />
              <Stat label="XP" value={formatNumber(profile.xp)} />
            </div>
          </Card>

          <Card>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-arena-muted">Badges</h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {BADGES.filter((b) => unlockedCodes.includes(b.code)).map((badge) => (
                <BadgeCard key={badge.code} badge={badge} isUnlocked />
              ))}
              {unlockedCodes.length === 0 && <p className="col-span-full text-sm text-arena-muted">No badges unlocked yet.</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-arena-surface2 px-4 py-3">
      <p className="text-xs uppercase text-arena-muted">{label}</p>
      <p className="text-xl font-bold text-arena-text">{value}</p>
    </div>
  );
}
