import { useCallback, useState } from "react";

/**
 * Generic loading/error/data wrapper around a single async API call.
 * Usage: const { run, data, isLoading, error } = useApi(profileApi.get)
 */
export function useApi(apiFn) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (...args) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await apiFn(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message || "Something went wrong");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFn]
  );

  return { data, setData, isLoading, error, run };
}
