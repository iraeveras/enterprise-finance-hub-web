// FILE: src/app/(private)/vacations/hooks/useVacationCreate.ts
"use client";

import { useScopedCompanyMutation, postByCompany } from "@/hooks/scopedCompany";
import type { Vacation } from "../types";

/**
 * Criação de lançamento de férias.
 * Normalizamos campos numéricos/booleanos para evitar que o backend
 * descarte valores (ex.: "false" string).
 */
export function useVacationCreate() {
  return useScopedCompanyMutation<Vacation, Partial<Vacation>>(
    () => ["vacations"],
    async (vars, cid) => {
      const payload = normalizeVacationPayload(vars);
      return postByCompany<Vacation>("/vacations", payload, cid);
    }
  );
}

/** Converte tipos para o que o backend espera */
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
    thirteenthAdvance: Boolean(input.thirteenthAdvance), // garante boolean
    baseSalary: num(input.baseSalary),
    overtimeAverage: num(input.overtimeAverage ?? 0),
    vacationValue: num(input.vacationValue ?? 0),
    onethirdValue: num(input.onethirdValue ?? 0),
    abonoValue: num(input.abonoValue ?? 0),
    abonoOnethirdValue: num(input.abonoOnethirdValue ?? 0),
  };
}
const num = (v: any) => (v == null ? 0 : Number(v));