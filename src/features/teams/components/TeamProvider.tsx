"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

interface TeamInfo {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
  memberCount: number;
  workflowCount: number;
}

interface TeamContextValue {
  activeTeamId: string | null;
  activeTeam: TeamInfo | null;
  teams: TeamInfo[];
  switchTeam: (teamId: string) => void;
  isLoading: boolean;
}

const TeamContext = createContext<TeamContextValue>({
  activeTeamId: null,
  activeTeam: null,
  teams: [],
  switchTeam: () => {},
  isLoading: true,
});

const STORAGE_KEY = "flowgent:active-team";

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const trpc = useTRPC();
  const { data: teams, isLoading } = useQuery(
    trpc.teams.list.queryOptions(),
  );

  const [activeTeamId, setActiveTeamId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
  });

  // Auto-select first team if none stored or stored id no longer exists
  useEffect(() => {
    if (!teams || teams.length === 0) return;
    const ids = teams.map((t) => t.id);
    if (!activeTeamId || !ids.includes(activeTeamId)) {
      const first = teams[0].id;
      setActiveTeamId(first);
      localStorage.setItem(STORAGE_KEY, first);
    }
  }, [teams, activeTeamId]);

  const switchTeam = useCallback((teamId: string) => {
    setActiveTeamId(teamId);
    localStorage.setItem(STORAGE_KEY, teamId);
  }, []);

  const activeTeam =
    (teams as TeamInfo[] | undefined)?.find((t) => t.id === activeTeamId) ??
    null;

  return (
    <TeamContext.Provider
      value={{
        activeTeamId,
        activeTeam,
        teams: (teams as TeamInfo[]) ?? [],
        switchTeam,
        isLoading,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
