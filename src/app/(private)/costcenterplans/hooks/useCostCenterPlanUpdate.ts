// FILE: src/app/(private)/costcenterplans/hooks/useCostCenterPlanUpdate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useCostCenterPlanUpdate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: any }) => {
            const res = await api.put(`/costcenterplans/${id}`, data);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["costcenterplans"] });
        },
    });
}