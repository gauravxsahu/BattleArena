import { useState } from "react";
import { LogOut, Trash2, Shield } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import PageHeader from "../../components/common/PageHeader.jsx";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Modal from "../../components/ui/Modal.jsx";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" subtitle="Manage your account and session." />

      <Card className="mb-4">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-arena-muted">
          <Shield className="h-4 w-4" /> Account
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-arena-border pb-3">
            <span className="text-arena-muted">Name</span>
            <span className="font-medium">{user?.name}</span>
          </div>
          <div className="flex justify-between border-b border-arena-border pb-3">
            <span className="text-arena-muted">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-arena-muted">Role</span>
            <span className="font-medium">{user?.role}</span>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-arena-danger">Session</h2>
        <Button variant="danger" icon={LogOut} onClick={() => setIsLogoutModalOpen(true)}>
          Log out
        </Button>
      </Card>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Log out?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={Trash2} onClick={logout}>
              Log out
            </Button>
          </>
        }
      >
        <p className="text-sm text-arena-muted">You'll need to sign in again to access your account.</p>
      </Modal>
    </div>
  );
}
