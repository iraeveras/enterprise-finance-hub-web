// FILE: src/app/(private)/costcenterplans/hooks/useExpenseTypeCreate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useExpenseTypeCreate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post("/expensetypes", data);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["expensetypes"] });
        },
    });
}