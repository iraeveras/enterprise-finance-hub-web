// FILE: src/app/(private)/vacations/hooks/useVacationUpdate.ts
"use client";

import { useScopedCompanyMutation, putByCompany } from "@/hooks/scopedCompany";
import type { Vacation } from "../types";

/**
 * Atualização do lançamento de férias.
 * Corrige a tipagem do ID para string (seu modelo usa string)
 * e normaliza o payload como no create.
 */
export function useVacationUpdate() {
  return useScopedCompanyMutation<Vacation, { id: string; data: Partial<Vacation> }>(
    () => ["vacations"],
    async (vars, cid) => {
      const payload = normalizeVacationPayload(vars.data);
      return putByCompany<Vacation>(`/vacations/${vars.id}`, payload, cid);
    }
  );
}

function normalizeVacationPayload(input: Partial<Vacation>) {
  return {
    ...input,
    employeeId: num(input.employeeId),
    companyId: num(input.companyId),
    sectorId: num(input.sectorId),
    budgetPeriodId: num(input.budgetPeriodId),
    month: num(input.month),
    year: num(input.year),
    vacationDays: num(input.vacationDays),
    abonoDays: num(input.abonoDays ?? 0),
    thirteenthAdvance: Boolean(input.thirteenthAdvance),
    baseSalary: num(input.baseSalary),
    overtimeAverage: num(input.overtimeAverage ?? 0),
    vacationValue: num(input.vacationValue ?? 0),
    onethirdValue: num(input.onethirdValue ?? 0),
    abonoValue: num(input.abonoValue ?? 0),
    abonoOnethirdValue: num(input.abonoOnethirdValue ?? 0),
  };
}
const num = (v: any) => (v == null ? 0 : Number(v));