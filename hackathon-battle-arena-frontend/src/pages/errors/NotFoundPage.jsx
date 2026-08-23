import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../../components/ui/Button.jsx";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-arena-bg px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-arena-primary/10">
        <Compass className="h-10 w-10 text-arena-primary" />
      </div>
      <h1 className="text-5xl font-black text-gradient">404</h1>
      <p className="mt-3 text-lg font-semibold text-arena-text">Lost in the arena</p>
      <p className="mt-1 max-w-sm text-sm text-arena-muted">This page doesn't exist. Let's get you back to the action.</p>
      <Link to="/dashboard" className="mt-6">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
