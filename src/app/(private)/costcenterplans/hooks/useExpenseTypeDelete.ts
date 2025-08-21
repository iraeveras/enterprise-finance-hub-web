// FILE: src/app/(private)/costcenterplans/hooks/useExpenseTypeDelete.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useExpenseTypeDelete() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/expensetypes/${id}`);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["expensetypes"] });
            qc.invalidateQueries({ queryKey: ["expensesubtypes"] });
        },
    });
}