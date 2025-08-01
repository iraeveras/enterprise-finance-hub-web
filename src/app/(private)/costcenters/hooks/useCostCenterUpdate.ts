// FILE: src/app/(private)/costcenters/hooks/useCostCenterUpdate.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/api"
import type { CostCenter } from "../types"

export function useCostCenterUpdate() {
    const queryclient = useQueryClient()
    return useMutation<CostCenter, Error, CostCenter>({
        mutationFn: async ({ id, ...data }) => {
            const res = await api.put<{ data: CostCenter }>(`/cost-centers/${id}`, data)
            return res.data.data
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["cost-centers"] })
        },
    })
}