// FILE: src/app/(private)/teams/hooks/useTeamDelete.tsx
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/api"

export function useTeamDelete() {
    const queryclient = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/teams/${id}`)
            return id
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["teams"] })
        },
    })
}