// FILE: src/app/(private)/costcenterplans/hooks/useExpenseTypes.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { ExpenseType } from "../types";

type Filters = {
    planoCentroCustoItemId?: number | string;
    status?: "active" | "inactive";
    search?: string;
};

export function useExpenseTypes(filters?: Filters) {
    return useQuery<ExpenseType[]>({
        queryKey: ["expensetypes", filters ?? {}],
        queryFn: async () => {
            const res = await api.get("/expensetypes", { params: filters });
            return (res.data?.data ?? res.data) as ExpenseType[];
        },
    });
}