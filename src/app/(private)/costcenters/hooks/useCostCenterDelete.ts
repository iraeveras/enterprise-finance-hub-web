// FILE: src/app/(private)/costcenters/hooks/useCostCenterDelete.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/api"

export function useCostCenterDelete() {
    const queryclient = useQueryClient()
    return useMutation<String, Error, String>({
        mutationFn: async (id) => {
            await api.delete(`/cost-centers/${id}`)
            return id;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["cost-centers"] })
        },
    })
}