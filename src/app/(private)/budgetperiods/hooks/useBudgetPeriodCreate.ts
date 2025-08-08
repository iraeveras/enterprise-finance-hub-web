"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { BudgetPeriod, CreateBudgetPeriodInput } from "../types";

export function useBudgetPeriodCreate() {
    const queryclient = useQueryClient();
    
    return useMutation<BudgetPeriod, Error, CreateBudgetPeriodInput>({
        mutationFn: async (newBudgetPeriod) => {
            const res = await api.post<{ data: BudgetPeriod }>("/budgetperiods", newBudgetPeriod);
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries( { queryKey: ["budgetperiods"]});
        },
    });
}