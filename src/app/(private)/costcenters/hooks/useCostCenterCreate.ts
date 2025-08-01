// FILE: src/app/(private)/costcenters/hooks/useCostCenterCreate.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/services/api"
import type { CostCenter, CreateCostCenterInput } from "../types"

export function useCostCenterCreate() {
    const queryclient = useQueryClient()
    return useMutation<CostCenter, Error, CreateCostCenterInput>({
        mutationFn: async (newCC) => {
            const res = await api.post<{ data: CostCenter }>("/cost-centers", newCC)
            return res.data.data
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["cost-centers"] });
        },
    })
}