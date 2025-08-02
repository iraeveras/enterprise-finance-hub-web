// FILE: src/app/(private)/teams/hooks/useTeamUpdate.tsx
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/api"
import type { Team } from "../types"

export function useTeamUpdate() {
    const queryclient = useQueryClient()
    return useMutation({
        mutationFn: async (team: Team) => {
            const { id, ...data } = team
            const res = await api.put<{ data: Team }>(`/teams/${id}`, data)
            return res.data.data
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["teams"] })
        },
    })
}