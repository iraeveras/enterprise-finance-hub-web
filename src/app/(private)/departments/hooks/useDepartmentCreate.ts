// src/app/(private)/departments/hooks/useDepartmentCreate.ts
"use client";

import { useScopedCompanyMutation, postByCompany } from "@/hooks/scopedCompany";
import type { Department, CreateDepartmentInput } from "../types";

export function useDepartmentCreate() {
    return useScopedCompanyMutation<Department, Partial<Department>>(
        () => ["departments"],
        (vars, cid) => postByCompany<Department>("/departments", vars, cid),
    );
}