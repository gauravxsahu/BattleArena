import { Trash2 } from "lucide-react";
import Select from "../ui/Select.jsx";
import { EXPERIENCE_LEVELS, EXPERIENCE_LABELS } from "../../utils/constants";

export default function SkillRow({ userSkill, onChangeProficiency, onRemove, isUpdating }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-arena-border bg-arena-surface2 px-4 py-3">
      <span className="font-medium text-arena-text">{userSkill.skill.name}</span>
      <div className="flex items-center gap-3">
        <Select
          className="!py-1.5 !pr-8 text-sm"
          value={userSkill.proficiency}
          onChange={(e) => onChangeProficiency(userSkill.skill.id, e.target.value)}
          options={EXPERIENCE_LEVELS.map((level) => ({ value: level, label: EXPERIENCE_LABELS[level] }))}
          disabled={isUpdating}
        />
        <button
          onClick={() => onRemove(userSkill.skill.id)}
          aria-label={`Remove ${userSkill.skill.name}`}
          className="rounded-lg p-2 text-arena-muted transition-colors hover:bg-arena-danger/10 hover:text-arena-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
