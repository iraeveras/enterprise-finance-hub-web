// src/app/(private)/departments/hooks/useDepartmentDelete.ts
"use client";

import { useScopedCompanyMutation, delByCompany } from "@/hooks/scopedCompany";

export function useDepartmentDelete() {
    return useScopedCompanyMutation<unknown, number>(
        () => ["departments"],
        (id, cid) => delByCompany(`/departments/${id}`, cid),
    );
}