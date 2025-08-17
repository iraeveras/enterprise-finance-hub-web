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

      const base = {
        ...data,
        year: Number(data.year),
        month: Number(data.month),
        companyId: Number(data.companyId),
        employeeId: Number(data.employeeId),
        budgetPeriodId: Number(data.budgetPeriodId),
        he50Qty: Number(data.he50Qty ?? 0),
        he100Qty: Number(data.he100Qty ?? 0),
        holidayDaysQty: Number(data.holidayDaysQty ?? 0),
        nightHoursQty: Number(data.nightHoursQty ?? 0),
      };

      const { costcenterId, ...rest } = base as any;
      const toServer = { ...rest, costCenterId: Number(costcenterId) };

      const res = await api.put<{ data: Overtime }>(`/overtimes/${id}`, toServer);
      return res.data.data;
    },
    onSuccess: () => queryclient.invalidateQueries({ queryKey: ["overtimes"] }),
  });
}