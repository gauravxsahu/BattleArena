import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, ArrowLeft, Copy, Check, Loader2 } from "lucide-react";
import { friendChallengeApi } from "../../services/friendChallengeApi";
import { useSocket } from "../../hooks/useSocket";
import Card from "../../components/ui/Card.jsx";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import ErrorMessage from "../../components/common/ErrorMessage.jsx";
import { GAME_MODES } from "../../utils/constants";

export default function FriendChallengePage() {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [tab, setTab] = useState("create"); // "create" | "join"

  const [invite, setInvite] = useState(null); // { code, expiresInSeconds }
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [copied, setCopied] = useState(false);

  const [joinCode, setJoinCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState(null);

  // Once an invite exists, wait for the friend to join — reuses the same
  // socket event the queue-based matchmaking flow emits.
  useEffect(() => {
    if (!socket || !invite) return undefined;
    const handleMatched = (payload) => {
      navigate(`/games/${payload.gameId}/lobby`);
    };
    socket.on("matchmaking:matched", handleMatched);
    return () => socket.off("matchmaking:matched", handleMatched);
  }, [socket, invite, navigate]);

  const handleCreate = async () => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const data = await friendChallengeApi.create();
      setInvite(data);
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async () => {
    if (!invite) return;
    try {
      await navigator.clipboard.writeText(invite.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access can fail (e.g. insecure context) — the code is still visible to copy manually
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setIsJoining(true);
    setJoinError(null);
    try {
      const game = await friendChallengeApi.join(joinCode.trim());
      navigate(`/games/${game.id}/lobby`);
    } catch (err) {
      setJoinError(err.message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Link to="/play" className="mb-4 flex items-center gap-1.5 text-sm text-arena-muted hover:text-arena-text">
          <ArrowLeft className="h-4 w-4" /> Choose a different mode
        </Link>

        <Card className="text-center" glass>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-arena-warning/15">
            <UserPlus className="h-8 w-8 text-arena-warning" />
          </div>
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">FRIEND CHALLENGE</h1>
          <p className="mt-2 text-sm text-arena-muted">
            1v1 · {GAME_MODES.FRIEND_CHALLENGE.durationMinutes} minute timer. Battle a friend directly — no random matchmaking.
          </p>

          {/* Tabs — stack full-width on mobile, side-by-side from sm: up */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-arena-surface2 p-1">
            <button
              onClick={() => setTab("create")}
              className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                tab === "create" ? "bg-arena-primary text-white" : "text-arena-muted"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setTab("join")}
              className={`rounded-lg py-2 text-sm font-semibold transition-colors ${
                tab === "join" ? "bg-arena-primary text-white" : "text-arena-muted"
              }`}
            >
              Join
            </button>
          </div>

          {tab === "create" ? (
            <div className="mt-6">
              <ErrorMessage message={createError} className="mb-4" />
              {!invite ? (
                <Button className="w-full text-base" onClick={handleCreate} isLoading={isCreating} icon={UserPlus}>
                  Generate Invite Code
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-arena-border bg-arena-surface2 px-4 py-5">
                    <p className="text-xs uppercase tracking-wide text-arena-muted">Share this code</p>
                    <div className="mt-2 flex items-center justify-center gap-3">
                      <span className="font-mono text-3xl font-black tracking-[0.2em] text-arena-primary">{invite.code}</span>
                      <button
                        onClick={handleCopy}
                        aria-label="Copy invite code"
                        className="rounded-lg p-2 text-arena-muted hover:bg-arena-surface hover:text-arena-text"
                      >
                        {copied ? <Check className="h-4 w-4 text-arena-accent" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-arena-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Waiting for your friend to join...
                  </div>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleJoin} className="mt-6 space-y-4">
              <ErrorMessage message={joinError} />
              <Input
                placeholder="Enter invite code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="text-center font-mono text-lg tracking-[0.2em]"
                maxLength={12}
              />
              <Button type="submit" className="w-full text-base" isLoading={isJoining} icon={UserPlus}>
                Join Challenge
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
