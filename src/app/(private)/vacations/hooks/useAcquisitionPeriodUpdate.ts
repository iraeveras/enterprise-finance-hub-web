// FILE: src/app/(private)/vacations/hooks/useAcquisitionPeriodUpdate.ts
"use client";

import { useScopedCompanyMutation, putByCompany } from "@/hooks/scopedCompany";
import type { AcquisitionPeriod, UpdateAcquisitionPeriodInput } from "../types";

/**
 * Aceita o próprio UpdateAcquisitionPeriodInput (que já contém id).
 */
export function useAcquisitionPeriodUpdate() {
  return useScopedCompanyMutation<AcquisitionPeriod, UpdateAcquisitionPeriodInput>(
    () => ["acquisition-periods"],
    (payload, cid) => {
      const { id, ...data } = payload;
      return putByCompany<AcquisitionPeriod>(`/acquisition-periods/${id}`, data, cid);
    }
  );
}