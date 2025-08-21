// FILE: src/app/(private)/costcenterplans/hooks/useExpenseSubtypeDelete.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useExpenseSubtypeDelete() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/expensesubtypes/${id}`);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["expensesubtypes"] });
        },
    });
}