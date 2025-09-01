// FILE: src/app/(private)/vacations/hooks/useVacationCreate.ts
"use client";

import { useScopedCompanyMutation, postByCompany } from "@/hooks/scopedCompany";
import type { CreateVacationInput, Vacation } from "../types";

export function useVacationCreate() {
  return useScopedCompanyMutation<Vacation, Partial<Vacation>>(
    () => ["vacations"],
    (vars, cid) => postByCompany<Vacation>("/vacations", vars, cid)
  );
}