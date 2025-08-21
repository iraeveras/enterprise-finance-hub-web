// FILE: src/app/(private)/costcenterplans/hooks/useExpenseSubtypes.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { ExpenseSubtype } from "../types";

type Filters = {
    tipoDespesaId?: number | string;
    status?: "active" | "inactive";
    search?: string;
};

export function useExpenseSubtypes(filters?: Filters) {
    return useQuery<ExpenseSubtype[]>({
        queryKey: ["expensesubtypes", filters ?? {}],
        queryFn: async () => {
            const res = await api.get("/expensesubtypes", { params: filters });
            return (res.data?.data ?? res.data) as ExpenseSubtype[];
        },
    });
}