"use client";

import { useState, useEffect, useCallback } from "react";
import { UserMeResponse } from "@/types/api";
import { apiClient } from "@/lib/api/client";

export function useAuth() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchUser = useCallback(async () => {
    const token = apiClient.getToken();
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await apiClient.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err: unknown) {
      const error = err as { status?: number };
      if (error?.status === 401) {
        apiClient.setToken(null);
      }
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await apiClient.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      apiClient.setToken(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  return {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    refreshUser: fetchUser,
    logout,
  };
}
