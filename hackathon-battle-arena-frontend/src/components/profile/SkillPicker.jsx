import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import Input from "../ui/Input.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { EXPERIENCE_LEVELS, EXPERIENCE_LABELS } from "../../utils/constants";

export default function SkillPicker({ catalog, existingSkillIds, onAdd, isAdding }) {
  const [query, setQuery] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("");
  const [proficiency, setProficiency] = useState("BEGINNER");

  const available = useMemo(() => {
    return catalog
      .filter((skill) => !existingSkillIds.includes(skill.id))
      .filter((skill) => skill.name.toLowerCase().includes(query.toLowerCase()));
  }, [catalog, existingSkillIds, query]);

  const handleAdd = () => {
    if (!selectedSkillId) return;
    onAdd({ skillId: selectedSkillId, proficiency });
    setSelectedSkillId("");
    setQuery("");
  };

  return (
    <div className="rounded-xl border border-dashed border-arena-border p-4">
      <p className="mb-3 text-sm font-semibold text-arena-text">Add a skill</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <div>
          <Input icon={Search} placeholder="Search skills..." value={query} onChange={(e) => setQuery(e.target.value)} />
          {query && (
            <div className="mt-1 max-h-40 overflow-y-auto rounded-xl border border-arena-border bg-arena-surface2 scrollbar-thin">
              {available.length === 0 ? (
                <p className="px-3 py-2 text-sm text-arena-muted">No matching skills</p>
              ) : (
                available.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    onClick={() => {
                      setSelectedSkillId(skill.id);
                      setQuery(skill.name);
                    }}
                    className={`block w-full px-3 py-2 text-left text-sm hover:bg-arena-surface ${
                      selectedSkillId === skill.id ? "bg-arena-primary/10 text-arena-primary" : "text-arena-text"
                    }`}
                  >
                    {skill.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        <Select
          value={proficiency}
          onChange={(e) => setProficiency(e.target.value)}
          options={EXPERIENCE_LEVELS.map((level) => ({ value: level, label: EXPERIENCE_LABELS[level] }))}
        />
        <Button icon={Plus} onClick={handleAdd} disabled={!selectedSkillId} isLoading={isAdding}>
          Add
        </Button>
      </div>
    </div>
  );
}
