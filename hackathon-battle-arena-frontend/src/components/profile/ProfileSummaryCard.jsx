import { Github, Linkedin } from "lucide-react";
import Card from "../ui/Card.jsx";
import Avatar from "../ui/Avatar.jsx";
import Badge from "../ui/Badge.jsx";
import { EXPERIENCE_LABELS } from "../../utils/constants";

export default function ProfileSummaryCard({ user, profile }) {
  return (
    <Card className="flex flex-col items-center text-center">
      <Avatar name={user?.name} src={profile?.avatar} size="xl" />
      <h2 className="mt-4 text-lg font-bold text-arena-text">{user?.name}</h2>
      {profile?.experienceLevel && (
        <Badge color="primary" className="mt-2">
          {EXPERIENCE_LABELS[profile.experienceLevel] || profile.experienceLevel}
        </Badge>
      )}
      {profile?.bio && <p className="mt-3 text-sm text-arena-muted">{profile.bio}</p>}

      <div className="mt-4 flex gap-3">
        {profile?.githubUrl && (
          <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-arena-surface2 p-2 text-arena-muted hover:text-arena-text" aria-label="GitHub profile">
            <Github className="h-4 w-4" />
          </a>
        )}
        {profile?.linkedinUrl && (
          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="rounded-lg bg-arena-surface2 p-2 text-arena-muted hover:text-arena-text" aria-label="LinkedIn profile">
            <Linkedin className="h-4 w-4" />
          </a>
        )}
      </div>

      {profile?.preferredTechnologies?.length > 0 && (
        <div className="mt-5 w-full">
          <p className="mb-2 text-left text-xs font-semibold uppercase tracking-wide text-arena-muted">Technologies</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.preferredTechnologies.map((tech) => (
              <Badge key={tech} color="neutral">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {profile?.interests?.length > 0 && (
        <div className="mt-4 w-full">
          <p className="mb-2 text-left text-xs font-semibold uppercase tracking-wide text-arena-muted">Interests</p>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest) => (
              <Badge key={interest} color="accent">
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
