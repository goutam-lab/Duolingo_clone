"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Search, UserMinus, UserPlus, Users, X } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import {
  FriendRequestsResponse,
  FriendshipRecord,
  UserMeResponse,
  UserSearchResult,
} from "@/types/api";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorState } from "@/components/ui/ErrorState";
import { LoadingState } from "@/components/ui/LoadingState";

function initials(username: string): string {
  return username.slice(0, 2).toUpperCase();
}

export default function FriendsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [friends, setFriends] = useState<FriendshipRecord[]>([]);
  const [requests, setRequests] = useState<FriendRequestsResponse>({
    incoming: [],
    outgoing: [],
  });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) {
      setIsLoading(true);
    }
    setError(null);
    try {
      let userData: UserMeResponse;
      try {
        userData = await apiClient.getCurrentUser();
      } catch (authErr: unknown) {
        const err = authErr as { status?: number; message?: string };
        if (
          err?.status === 401 ||
          err?.message?.toLowerCase().includes("authentication") ||
          err?.message?.toLowerCase().includes("log in")
        ) {
          router.push("/login");
          return;
        }
        throw authErr;
      }

      setUser(userData);
      const [friendsData, requestsData] = await Promise.all([
        apiClient.getFriends(),
        apiClient.getFriendRequests(),
      ]);
      setFriends(friendsData.friends);
      setRequests(requestsData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load friends."
      );
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 1) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const data = await apiClient.searchUsers(trimmed);
        setResults(data.results);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => window.clearTimeout(timer);
  }, [query]);

  const incomingCount = requests.incoming.length;

  const handleSend = async (userId: number) => {
    setBusyId(userId);
    try {
      await apiClient.sendFriendRequest(userId);
      await loadData(false);
      if (query.trim()) {
        const data = await apiClient.searchUsers(query.trim());
        setResults(data.results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send request.");
    } finally {
      setBusyId(null);
    }
  };

  const handleAccept = async (requestId: number) => {
    setBusyId(requestId);
    try {
      await apiClient.acceptFriendRequest(requestId);
      await loadData(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not accept request.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (requestId: number) => {
    setBusyId(requestId);
    try {
      await apiClient.rejectFriendRequest(requestId);
      await loadData(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reject request.");
    } finally {
      setBusyId(null);
    }
  };

  const handleUnfriend = async (userId: number) => {
    setBusyId(userId);
    try {
      await apiClient.unfriend(userId);
      await loadData(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unfriend.");
    } finally {
      setBusyId(null);
    }
  };

  const emptyFriendsCopy = useMemo(
    () =>
      friends.length === 0
        ? "No friends yet. Search for a username and send a request."
        : null,
    [friends.length]
  );

  return (
    <AppShell user={user}>
      <div className="px-3 pt-3 pb-8 space-y-4">
          {isLoading && <LoadingState />}

          {!isLoading && error && !user && (
            <ErrorState message={error} onRetry={() => loadData()} />
          )}

        {!isLoading && user && (
          <>
            <header className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1cb0f6]/15 border border-[#1cb0f6]/40 flex items-center justify-center">
                <Users className="w-5 h-5 text-[#1cb0f6]" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">Friends</h1>
                <p className="text-xs text-[#afafaf]">
                  Find learners, accept requests, and keep each other going.
                </p>
              </div>
            </header>

            {error && (
              <p className="text-xs font-bold text-[#ff4b4b] bg-[#ff4b4b]/10 border border-[#ff4b4b]/30 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            <div className="relative">
              <Search className="w-4 h-4 text-[#afafaf] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search usernames"
                className="w-full bg-[#1a2c35] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl pl-9 pr-3 py-2.5 text-sm font-semibold outline-none"
                aria-label="Search users"
              />
            </div>

            {query.trim() && (
              <section className="rounded-2xl border-2 border-[#37464f] bg-[#1a2c35] overflow-hidden">
                <h2 className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-[#afafaf] border-b-2 border-[#37464f]">
                  {isSearching ? "Searching…" : "Search results"}
                </h2>
                {results.length === 0 && !isSearching && (
                  <p className="px-4 py-3 text-sm text-[#afafaf]">No users found.</p>
                )}
                {results.map((hit) => (
                  <div
                    key={hit.id}
                    className="flex items-center gap-3 px-4 py-2.5 border-b border-[#37464f] last:border-b-0"
                  >
                    <Avatar name={hit.username} />
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-sm truncate">{hit.username}</div>
                      <div className="text-[11px] text-[#afafaf]">{hit.total_xp} XP</div>
                    </div>
                    <RelationAction
                      status={hit.friendship_status}
                      busy={busyId === hit.id || busyId === hit.friendship_id}
                      onAdd={() => handleSend(hit.id)}
                      onAccept={() =>
                        hit.friendship_id
                          ? handleAccept(hit.friendship_id)
                          : undefined
                      }
                    />
                  </div>
                ))}
              </section>
            )}

            {incomingCount > 0 && (
              <section className="rounded-2xl border-2 border-[#37464f] bg-[#1a2c35] overflow-hidden">
                <h2 className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-[#afafaf] border-b-2 border-[#37464f]">
                  Friend requests ({incomingCount})
                </h2>
                {requests.incoming.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2.5 border-b border-[#37464f] last:border-b-0"
                  >
                    <Avatar name={item.user.username} />
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-sm truncate">
                        {item.user.username}
                      </div>
                      <div className="text-[11px] text-[#afafaf]">
                        {item.user.total_xp} XP · {item.user.current_streak} day streak
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconButton
                        label="Accept"
                        disabled={busyId === item.id}
                        onClick={() => handleAccept(item.id)}
                        tone="green"
                      >
                        <Check className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        label="Reject"
                        disabled={busyId === item.id}
                        onClick={() => handleReject(item.id)}
                        tone="red"
                      >
                        <X className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </section>
            )}

            <section className="rounded-2xl border-2 border-[#37464f] bg-[#1a2c35] overflow-hidden">
              <h2 className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-[#afafaf] border-b-2 border-[#37464f]">
                Your friends ({friends.length})
              </h2>
              {emptyFriendsCopy && (
                <p className="px-4 py-4 text-sm text-[#afafaf]">{emptyFriendsCopy}</p>
              )}
              {friends.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-4 py-2.5 border-b border-[#37464f] last:border-b-0"
                >
                  <Avatar name={item.user.username} />
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-sm truncate">{item.user.username}</div>
                    <div className="text-[11px] text-[#afafaf]">
                      {item.user.total_xp} XP · {item.user.current_streak} day streak
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={busyId === item.user.id}
                    onClick={() => handleUnfriend(item.user.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider text-[#afafaf] hover:text-[#ff4b4b] hover:bg-[#ff4b4b]/10"
                  >
                    <UserMinus className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))}
            </section>

            {requests.outgoing.length > 0 && (
              <section className="rounded-2xl border-2 border-[#37464f] bg-[#1a2c35] overflow-hidden">
                <h2 className="px-4 py-2 text-[11px] font-black uppercase tracking-wider text-[#afafaf] border-b-2 border-[#37464f]">
                  Sent requests
                </h2>
                {requests.outgoing.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-4 py-2.5 border-b border-[#37464f] last:border-b-0"
                  >
                    <Avatar name={item.user.username} />
                    <div className="min-w-0 flex-1">
                      <div className="font-black text-sm truncate">
                        {item.user.username}
                      </div>
                      <div className="text-[11px] text-[#afafaf]">Pending</div>
                    </div>
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="w-10 h-10 rounded-full bg-[#131f24] border-2 border-[#37464f] flex items-center justify-center text-xs font-black text-[#58cc02] shrink-0">
      {initials(name)}
    </div>
  );
}

function RelationAction({
  status,
  busy,
  onAdd,
  onAccept,
}: {
  status: UserSearchResult["friendship_status"];
  busy: boolean;
  onAdd: () => void;
  onAccept: () => void;
}) {
  if (status === "friends") {
    return (
      <span className="text-[11px] font-black uppercase tracking-wider text-[#58cc02]">
        Friends
      </span>
    );
  }
  if (status === "outgoing") {
    return (
      <span className="text-[11px] font-black uppercase tracking-wider text-[#afafaf]">
        Pending
      </span>
    );
  }
  if (status === "incoming") {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={onAccept}
        className="px-3 py-1.5 rounded-xl bg-[#58cc02] border-b-4 border-[#46a302] text-[11px] font-black uppercase text-[#131f24]"
      >
        Accept
      </button>
    );
  }
  return (
    <button
      type="button"
      disabled={busy}
      onClick={onAdd}
      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#1cb0f6] border-b-4 border-[#1899d6] text-[11px] font-black uppercase"
    >
      <UserPlus className="w-3.5 h-3.5" />
      Add
    </button>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
  tone,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone: "green" | "red";
}) {
  const classes =
    tone === "green"
      ? "bg-[#58cc02]/15 text-[#58cc02] hover:bg-[#58cc02]/25"
      : "bg-[#ff4b4b]/15 text-[#ff4b4b] hover:bg-[#ff4b4b]/25";
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`w-8 h-8 rounded-lg flex items-center justify-center ${classes}`}
    >
      {children}
    </button>
  );
}
