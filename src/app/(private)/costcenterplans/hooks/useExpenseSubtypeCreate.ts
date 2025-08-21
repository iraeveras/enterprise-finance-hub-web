// FILE: src/app/(private)/costcenterplans/hooks/useExpenseSubtypeCreate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useExpenseSubtypeCreate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post("/expensesubtypes", data);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["expensesubtypes"] });
        },
    });
}