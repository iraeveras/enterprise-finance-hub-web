// FILe: src/app/(private)/costcenterplans/hooks/useCostCenterPlanDelete.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useCostCenterPlanDelete() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/costcenterplans/${id}`);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["costcenterplans"] });
            // também invalida listas relacionadas para evitar "órfãos"
            qc.invalidateQueries({ queryKey: ["costcenterplanitems"] });
            qc.invalidateQueries({ queryKey: ["expensetypes"] });
            qc.invalidateQueries({ queryKey: ["expensesubtypes"] });
        },
    });
}