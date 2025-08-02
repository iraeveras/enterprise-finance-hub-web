// FILE: src/app/(private)/teams/hooks/useTeams.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"
import type { Team } from "../types"

export function useTeams() {
    return useQuery<Team[], Error>({
        queryKey: ["teams"],
        queryFn: async () => {
            const res = await api.get<{ data: Team[] }>("/teams")
            return res.data.data
        },
        refetchOnWindowFocus: false,
    })
}