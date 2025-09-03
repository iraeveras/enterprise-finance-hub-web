// FILE: src/app/(private)/vacations/hooks/useVacationDelete.ts
"use client";

import { useScopedCompanyMutation, delByCompany } from "@/hooks/scopedCompany";

/**
 * Corrige tipagem do ID: string.
 */
export function useVacationDelete() {
  return useScopedCompanyMutation<unknown, string>(
    () => ["vacations"],
    (id, cid) => delByCompany(`/vacations/${id}`, cid)
  );
}