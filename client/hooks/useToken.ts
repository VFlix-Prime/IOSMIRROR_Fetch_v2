import { useState, useEffect, useCallback } from "react";

const TOKEN_STORAGE_KEY = "prime_token";

export function useToken() {
  const [primeToken, setPrimeToken] = useState<string | null>(() => {
    // Load from localStorage on init
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchToken = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/fetch-token");
      const data = await response.json();

      if (data.success && data.primeToken) {
        setPrimeToken(data.primeToken);
        localStorage.setItem(TOKEN_STORAGE_KEY, data.primeToken);
        return true;
      } else {
        const errorMsg = data.error || "Failed to fetch token";
        setError(errorMsg);
        return false;
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to fetch token";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearToken = useCallback(() => {
    setPrimeToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setError(null);
  }, []);

  return {
    primeToken,
    loading,
    error,
    fetchToken,
    clearToken,
    hasToken: !!primeToken,
  };
}
