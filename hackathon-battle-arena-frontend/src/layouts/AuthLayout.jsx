import { Outlet } from "react-router-dom";
import { Swords } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-arena-bg px-4 py-12">
      <div className="absolute inset-0 bg-grid-pattern bg-[size:32px_32px] opacity-40" />
      <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-arena-primary/20 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-arena-primary to-arena-accent shadow-glow">
            <Swords className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Battle<span className="text-gradient">Arena</span>
          </h1>
          <p className="mt-1 text-sm text-arena-muted">Compete. Build. Win.</p>
        </div>
        <div className="glass-panel p-6 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
