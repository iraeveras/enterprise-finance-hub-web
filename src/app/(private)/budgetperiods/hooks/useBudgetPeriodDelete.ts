"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useBudgetPeriodDelete() {
    const queryclient = useQueryClient();
    
    return useMutation<void, Error, string>({
        mutationFn: async (id) => {
            await api.delete(`/budgetperiods/${id}`);
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["budgetperiods"] });
        },
    });
}