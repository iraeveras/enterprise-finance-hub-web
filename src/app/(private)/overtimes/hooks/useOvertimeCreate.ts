// FILE: src/app/(private)/overtimes/hooks/useOvertimeCreate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Overtime } from "../types";

export function useOvertimeCreate() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Overtime, "id" | "createdAt" | "updatedAt">) => {
      // Normaliza tipos numéricos
      const base = {
        ...payload,
        year: Number(payload.year),
        month: Number(payload.month),
        companyId: Number(payload.companyId),
        employeeId: Number(payload.employeeId),
        budgetPeriodId: Number(payload.budgetPeriodId),
        // quantidades precisam ser inteiras para o backend
        he50Qty: Number(payload.he50Qty ?? 0),
        he100Qty: Number(payload.he100Qty ?? 0),
        holidayDaysQty: Number(payload.holidayDaysQty ?? 0),
        nightHoursQty: Number(payload.nightHoursQty ?? 0),
      };

      // 🔑 mapeia para o nome que o backend espera
      const { costcenterId, ...rest } = base as any;
      const toServer = { ...rest, costCenterId: Number(costcenterId) };

      const res = await api.post<{ data: Overtime }>("/overtimes", toServer);
      return res.data.data;
    },
    onSuccess: () => queryclient.invalidateQueries({ queryKey: ["overtimes"] }),
  });
}