// src/app/(private)/departments/hooks/useDepartmentUpdate.ts
"use client";

import { useScopedCompanyMutation, putByCompany } from "@/hooks/scopedCompany";
import type { Department } from "../types";

export function useDepartmentUpdate() {
    return useScopedCompanyMutation<Department, { id: number; data: Partial<Department>}>(
        () => ["departments"],
        (vars, cid) => putByCompany<Department>(`/departments/${vars.id}`, vars.data, cid),
    );
}