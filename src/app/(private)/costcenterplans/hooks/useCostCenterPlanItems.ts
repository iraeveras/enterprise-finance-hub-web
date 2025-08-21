// FILE: src/app/(private)/costcenterplans/hooks/useCostCenterPlanItems.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { CostCenterPlanItem } from "../types";

type Filters = {
    planoCentroCustoId?: number | string;
    status?: "active" | "inactive";
    search?: string;
};

export function useCostCenterPlanItems(filters?: Filters) {
    return useQuery<CostCenterPlanItem[]>({
        queryKey: ["costcenterplanitems", filters ?? {}],
        queryFn: async () => {
            const res = await api.get("/costcenterplanitems", { params: filters });
            return (res.data?.data ?? res.data) as CostCenterPlanItem[];
        },
    });
}