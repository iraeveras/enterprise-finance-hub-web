// FILE: src/app/(private)/employees/hooks/useEmployeeDelete.ts
"use client";

import { useScopedCompanyMutation, delByCompany } from "@/hooks/scopedCompany";

export function useEmployeeDelete() {
    return useScopedCompanyMutation<unknown, number>(
        () => ["employees"],
        (id, cid) => delByCompany(`/employees/${id}`, cid),
    );
}