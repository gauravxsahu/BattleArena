import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "../services/authApi";
import { registerAuthFailureHandler } from "../services/api";
import { getAccessToken, setAccessToken, clearAccessToken } from "../utils/storage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const clearSession = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  // On app startup: try to restore the session. If there's no in-memory
  // access token yet, attempt a refresh first (the HTTP-only cookie may
  // still be valid from a previous visit), then call /auth/me.
  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      try {
        if (!getAccessToken()) {
          const refreshed = await authApi.refresh().catch(() => null);
          if (refreshed?.accessToken) {
            setAccessToken(refreshed.accessToken);
          } else {
            if (!cancelled) setIsLoading(false);
            return;
          }
        }
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        clearSession();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrap();
    registerAuthFailureHandler(() => {
      if (!cancelled) clearSession();
    });

    return () => {
      cancelled = true;
    };
  }, [clearSession]);

  const login = useCallback(async ({ email, password }) => {
    setError(null);
    try {
      const result = await authApi.login({ email, password });
      setAccessToken(result.accessToken);
      setUser(result.user);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    setError(null);
    try {
      const result = await authApi.register({ name, email, password });
      setAccessToken(result.accessToken);
      const me = await authApi.me();
      setUser(me);
      return me;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout — clear the local session regardless
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const refreshUser = useCallback(async () => {
    const me = await authApi.me();
    setUser(me);
    return me;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      register,
      logout,
      refreshUser,
      setUser,
    }),
    [user, isLoading, error, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
