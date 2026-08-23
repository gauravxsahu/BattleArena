import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";
import { skillApi } from "../../services/skillApi";
import PageHeader from "../../components/common/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import SkillRow from "../../components/profile/SkillRow.jsx";
import SkillPicker from "../../components/profile/SkillPicker.jsx";

export default function SkillsPage() {
  const [catalog, setCatalog] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([skillApi.listCatalog(), skillApi.listMine()])
      .then(([catalogData, mineData]) => {
        if (!mounted) return;
        setCatalog(catalogData);
        setMySkills(mineData);
      })
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = async ({ skillId, proficiency }) => {
    setPendingAction(`add-${skillId}`);
    setError(null);
    try {
      const created = await skillApi.add({ skillId, proficiency });
      setMySkills((prev) => [...prev.filter((s) => s.skill.id !== skillId), created]);
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingAction(null);
    }
  };

  const handleChangeProficiency = async (skillId, proficiency) => {
    setPendingAction(`update-${skillId}`);
    setError(null);
    try {
      const updated = await skillApi.update(skillId, { proficiency });
      setMySkills((prev) => prev.map((s) => (s.skill.id === skillId ? updated : s)));
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingAction(null);
    }
  };

  const handleRemove = async (skillId) => {
    setPendingAction(`remove-${skillId}`);
    setError(null);
    try {
      await skillApi.remove(skillId);
      setMySkills((prev) => prev.filter((s) => s.skill.id !== skillId));
    } catch (err) {
      setError(err.message);
    } finally {
      setPendingAction(null);
    }
  };

  return (
    <div>
      <PageHeader title="Skills" subtitle="Your skills drive how you're matched into balanced teams." />

      <Card>
        <ErrorMessage message={error} className="mb-4" />

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <>
            {mySkills.length === 0 ? (
              <EmptyState icon={Wrench} title="No skills added yet" description="Add your technical skills so matchmaking can build balanced teams." />
            ) : (
              <div className="space-y-2">
                {mySkills.map((userSkill) => (
                  <SkillRow
                    key={userSkill.id}
                    userSkill={userSkill}
                    onChangeProficiency={handleChangeProficiency}
                    onRemove={handleRemove}
                    isUpdating={pendingAction === `update-${userSkill.skill.id}` || pendingAction === `remove-${userSkill.skill.id}`}
                  />
                ))}
              </div>
            )}

            <div className="mt-5">
              <SkillPicker
                catalog={catalog}
                existingSkillIds={mySkills.map((s) => s.skill.id)}
                onAdd={handleAdd}
                isAdding={Boolean(pendingAction?.startsWith("add-"))}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
