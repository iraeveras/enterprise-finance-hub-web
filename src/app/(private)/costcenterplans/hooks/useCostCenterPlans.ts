// FILE: src/app/(private)/costcenterplans/hooks/useCostCenterPlans.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { CostCenterPlan } from "../types";

type Filters = {
    companyId?: number | string;
    status?: "active" | "inactive";
    search?: string;
};

export function useCostCenterPlans(filters?: Filters) {
    return useQuery<CostCenterPlan[]>({
        queryKey: ["costcenterplans", filters ?? {}],
        queryFn: async () => {
            const res = await api.get("/costcenterplans", { params: filters });
            return (res.data?.data ?? res.data) as CostCenterPlan[];
        },
    });
}