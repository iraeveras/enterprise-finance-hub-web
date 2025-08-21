// FILE: src/app/(private)/costcenterplans/hooks/useCostCenterPlanItemDelete.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useCostCenterPlanItemDelete() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res = await api.delete(`/costcenterplanitems/${id}`);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["costcenterplanitems"] });
            qc.invalidateQueries({ queryKey: ["expensetypes"] });
            qc.invalidateQueries({ queryKey: ["expensesubtypes"] });
        },
    });
}