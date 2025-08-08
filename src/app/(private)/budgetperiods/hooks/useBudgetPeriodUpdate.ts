"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { BudgetPeriod, UpdateBudgetPeriodInput } from "../types";

export function useBudgetPeriodUpdate() {
    const queryclient = useQueryClient();
    
    return useMutation<BudgetPeriod, Error, UpdateBudgetPeriodInput>({
        mutationFn: async ({ id, ...data }) => {
            const res = await api.put<{ data: BudgetPeriod }>(`/budgetperiods/${id}`, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["budgetperiods"]});
        },
    });
}