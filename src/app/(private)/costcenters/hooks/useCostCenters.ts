// FILE: src/app/(private)/costcenters/hooks/useCostCenters.ts
"use client"

import { useQuery } from "@tanstack/react-query"
import api from "@/services/api"
import type { CostCenter } from "../types"

export function useCostCenters() {
    return useQuery<CostCenter[], Error>({
        queryKey: ["cost-centers"],
        queryFn: async () => {
            const res = await api.get<{ data: CostCenter[]}>("/cost-centers")
            return res.data.data;
        },
        refetchOnWindowFocus: false,
    })
}