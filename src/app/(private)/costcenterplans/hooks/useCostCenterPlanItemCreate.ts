// FILE: src/app/(private)/costcenterplans/hooks/useCostCenterPlanItemCreate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useCostCenterPlanItemCreate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post("/costcenterplanitems", data);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["costcenterplanitems"] });
        },
    });
}