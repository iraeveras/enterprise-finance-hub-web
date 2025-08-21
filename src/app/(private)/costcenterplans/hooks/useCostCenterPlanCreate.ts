// FILE: src/app/(private)/costcenterplans/hooks/useCostCenterPlanCreate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useCostCenterPlanCreate() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const res = await api.post("/costcenterplans", data);
            return res.data?.data ?? res.data;
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["costcenterplans"] });
        },
    });
}