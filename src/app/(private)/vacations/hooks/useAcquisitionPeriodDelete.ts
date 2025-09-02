// FILE: src/app/(private)/vacations/hooks/useAcquisitionPeriodDelete.ts
"use client";

import { useScopedCompanyMutation, delByCompany } from "@/hooks/scopedCompany";

export function useAcquisitionPeriodDelete() {
  return useScopedCompanyMutation<unknown, string>(
    () => ["acquisition-periods"],
    (id, cid) => delByCompany(`/acquisition-periods/${id}`, cid)
  );
}