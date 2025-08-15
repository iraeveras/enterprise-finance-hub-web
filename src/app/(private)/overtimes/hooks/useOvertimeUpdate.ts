// FILE: src/app/(private)/overtimes/hooks/useOvertimeUpdate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Overtime } from "../types";

export function useOvertimeUpdate() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: Overtime) => {
            const { id, ...data } = payload;
            const sanitized = {
                ...data,
                year: Number(data.year),
                month: Number(data.month),
                companyId: Number(data.companyId),
                costCenterId: Number(data.costCenterId),
                employeeId: Number(data.employeeId),
                budgetPeriodId: Number(data.budgetPeriodId),
            };
            const res = await api.put<{ data: Overtime }>(`/overtimes/${id}`, sanitized);
            return res.data.data;
        },
        onSuccess: () => queryclient.invalidateQueries({ queryKey: ["overtimes"] }),
    });
}