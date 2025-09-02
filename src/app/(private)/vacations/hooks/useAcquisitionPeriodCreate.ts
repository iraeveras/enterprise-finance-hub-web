// FILE: src/app/(private)/vacations/hooks/useAcquisitionPeriodCreate.ts
"use client";

import { useScopedCompanyMutation, postByCompany } from "@/hooks/scopedCompany";
import type { AcquisitionPeriod, CreateAcquisitionPeriodInput } from "../types";

export function useAcquisitionPeriodCreate() {
  return useScopedCompanyMutation<AcquisitionPeriod, CreateAcquisitionPeriodInput>(
    () => ["acquisition-periods"],
    (payload, cid) => postByCompany<AcquisitionPeriod>("/acquisition-periods", payload, cid)
  );
}