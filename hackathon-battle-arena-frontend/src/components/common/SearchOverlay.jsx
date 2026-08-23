import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { userApi } from "../../services/userApi";
import Avatar from "../ui/Avatar.jsx";
import Spinner from "../ui/Spinner.jsx";
import { formatNumber } from "../../utils/formatters";

const DEBOUNCE_MS = 300;

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(() => {
      userApi
        .search(trimmed)
        .then((data) => setResults(data))
        .catch(() => setResults([]))
        .finally(() => setIsLoading(false));
    }, DEBOUNCE_MS);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (userId) => {
    onClose();
    navigate(`/users/${userId}`);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-20 sm:pt-28">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className="glass-panel relative z-10 w-full max-w-md animate-slide-up p-4">
        <div className="flex items-center gap-2 rounded-xl border border-arena-border bg-arena-surface2 px-3 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-arena-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search players..."
            className="w-full bg-transparent text-sm text-arena-text placeholder:text-arena-muted focus:outline-none"
            aria-label="Search players"
          />
          {isLoading && <Spinner size={16} />}
          <button onClick={onClose} aria-label="Close search" className="text-arena-muted hover:text-arena-text">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2 max-h-96 overflow-y-auto scrollbar-thin">
          {query.trim().length < 2 ? (
            <p className="px-3 py-6 text-center text-sm text-arena-muted">Type at least 2 characters to search.</p>
          ) : !isLoading && results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-arena-muted">No players found for &quot;{query}&quot;.</p>
          ) : (
            <ul className="space-y-1">
              {results.map((user) => (
                <li key={user.id}>
                  <button
                    onClick={() => handleSelect(user.id)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-arena-surface2"
                  >
                    <Avatar name={user.name} src={user.avatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-arena-text">{user.name}</p>
                      <p className="text-xs text-arena-muted">Rating {formatNumber(user.rating)}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
