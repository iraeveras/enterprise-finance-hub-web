// FILE: src/app/(private)/vacations/hooks/useVacationUpdate.ts
"use client";

import { useScopedCompanyMutation, putByCompany } from "@/hooks/scopedCompany";
import type { UpdateVacationInput, Vacation } from "../types";

export function useVacationUpdate() {
  return useScopedCompanyMutation<Vacation, { id: number; data: Partial<Vacation> }>(
    () => ["vacations"],
    (vars, cid) => putByCompany<Vacation>(`/vacations/${vars.id}`, vars.data, cid),
  );
}