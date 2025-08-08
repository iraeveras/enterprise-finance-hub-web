"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { BudgetPeriod } from "../types";

export function useBudgetPeriods() {
    return useQuery<BudgetPeriod[], Error>({
        queryKey: ["budgetperiods"],
        queryFn: async () => {
            const res = await api.get<{ data: BudgetPeriod[] }>("/budgetperiods");
            return res.data.data;
        },
        refetchOnWindowFocus: false,
    });
}