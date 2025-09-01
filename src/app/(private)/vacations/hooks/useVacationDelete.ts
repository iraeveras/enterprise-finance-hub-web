// FILE: src/app/(private)/vacations/hooks/useVacationDelete.ts
"use client";

import { useScopedCompanyMutation, delByCompany } from "@/hooks/scopedCompany";

export function useVacationDelete() {
  return useScopedCompanyMutation<unknown, number>(
    () => ["vacations"],
    (id, cid) => delByCompany(`/vacations/${id}`, cid),
  );
}