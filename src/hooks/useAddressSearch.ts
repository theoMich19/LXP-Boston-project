import { Address, UseAddressSearchResult } from "@/types/adress";
import { useState, useCallback } from "react";

export const useAddressSearch = (): UseAddressSearchResult => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchAddresses = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setAddresses([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/address/search?q=${encodeURIComponent(query)}&limit=8`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Search failed");
      }

      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      setAddresses([]);
      console.error("Address search error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearAddresses = useCallback(() => {
    setAddresses([]);
    setError(null);
  }, []);

  return {
    addresses,
    loading,
    error,
    searchAddresses,
    clearAddresses,
  };
};
