// FILE: src/app/(private)/teams/hooks/useTeamCreate.tsx
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/api"
import type { Team, CreateTeamInput } from "../types"

export function useTeamCreate() {
    const queryclient = useQueryClient()
    return useMutation({
        mutationFn: async (newTeam: CreateTeamInput) => {
            const res = await api.post<{ data: Team }>("/teams", newTeam)
            return res.data.data
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["teams"] })
        },
    })
}