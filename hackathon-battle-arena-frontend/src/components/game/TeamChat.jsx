import { useEffect, useRef, useState } from "react";
import { Send, MessageSquare } from "lucide-react";
import Avatar from "../ui/Avatar.jsx";
import { formatTime } from "../../utils/formatters";
import { useAuth } from "../../hooks/useAuth";

export default function TeamChat({ messages, onSend, isConnected }) {
  const { user } = useAuth();
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    try {
      await onSend(trimmed);
      setDraft("");
    } catch {
      // keep the draft so the user can retry
    } finally {
      setIsSending(false);
    }
  };

  // Group consecutive messages from the same user to avoid repeating avatar/name.
  const grouped = messages.reduce((acc, msg) => {
    const prev = acc[acc.length - 1];
    if (prev && prev.userId === msg.userId && new Date(msg.createdAt) - new Date(prev.messages.at(-1).createdAt) < 60000) {
      prev.messages.push(msg);
    } else {
      acc.push({ userId: msg.userId, userName: msg.userName, messages: [msg] });
    }
    return acc;
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-arena-border px-4 py-3">
        <MessageSquare className="h-4 w-4 text-arena-primary" />
        <h3 className="text-sm font-semibold text-arena-text">Team Chat</h3>
        {!isConnected && <span className="ml-auto text-xs text-arena-danger">Reconnecting...</span>}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-3 scrollbar-thin">
        {grouped.length === 0 ? (
          <p className="py-8 text-center text-sm text-arena-muted">No messages yet. Say hi to your team!</p>
        ) : (
          grouped.map((group, i) => {
            const isMe = group.userId === user?.id;
            return (
              <div key={`${group.userId}-${i}`} className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""}`}>
                <Avatar name={isMe ? "You" : group.userName} size="sm" />
                <div className={`flex max-w-[75%] flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                  <span className="text-xs font-medium text-arena-muted">{isMe ? "You" : group.userName}</span>
                  {group.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-2xl px-3.5 py-2 text-sm ${
                        isMe ? "rounded-tr-sm bg-arena-primary text-white" : "rounded-tl-sm bg-arena-surface2 text-arena-text"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  <span className="text-[10px] text-arena-muted">{formatTime(group.messages.at(-1).createdAt)}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-arena-border p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message your team..."
          maxLength={2000}
          className="input-field flex-1 !py-2"
          aria-label="Chat message"
        />
        <button
          type="submit"
          disabled={!draft.trim() || isSending}
          aria-label="Send message"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-arena-primary text-white transition-transform hover:bg-arena-primaryDark active:scale-95 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
