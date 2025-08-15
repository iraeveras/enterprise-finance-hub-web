// FILE: src/app/(private)/overtimes/hooks/useOvertimeCreate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Overtime } from "../types";

export function useOvertimeCreate() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Omit<Overtime, "id" | "createdAt" | "updatedAt">) => {
            // garantir tipos numéricos
            const sanitized = {
                ...payload,
                year: Number(payload.year),
                month: Number(payload.month),
                companyId: Number(payload.companyId),
                costCenterId: Number(payload.costCenterId),
                employeeId: Number(payload.employeeId),
                budgetPeriodId: Number(payload.budgetPeriodId),
            };
            const res = await api.post<{ data: Overtime }>("/overtimes", sanitized);
            return res.data.data;
        },
        onSuccess: () => queryclient.invalidateQueries({ queryKey: ["overtimes"] }),
    });
}