import { useEffect, useState } from "react";
import { profileApi } from "../../services/profileApi";
import { useAuth } from "../../hooks/useAuth";
import PageHeader from "../../components/common/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Skeleton from "../../components/ui/Skeleton.jsx";
import ProfileForm from "../../components/profile/ProfileForm.jsx";
import ProfileSummaryCard from "../../components/profile/ProfileSummaryCard.jsx";
import StatsCharts from "../../components/profile/StatsCharts.jsx";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    profileApi
      .get()
      .then((data) => mounted && setProfile(data))
      .catch(() => {})
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async (payload) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const updated = await profileApi.update(payload);
      setProfile(updated);
      await refreshUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage how teammates see you in the arena." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          {isLoading ? <Skeleton className="h-96 w-full" /> : <ProfileSummaryCard user={user} profile={profile} />}
        </div>
        <div className="lg:col-span-2">
          <Card>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <ProfileForm profile={profile} onSave={handleSave} isSaving={isSaving} saveError={saveError} saveSuccess={saveSuccess} />
            )}
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-4 text-lg font-semibold text-arena-text">Statistics</h2>
        <StatsCharts user={user} />
      </div>
    </div>
  );
}
