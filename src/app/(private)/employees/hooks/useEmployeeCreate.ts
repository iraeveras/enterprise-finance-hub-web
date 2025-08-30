// FILE: src/app/(private)/employees/hooks/useEmployeeCreate.ts
"use client";

import { useScopedCompanyMutation, postByCompany } from "@/hooks/scopedCompany";
import type { Employee, CreateEmployeeInput } from "../types";

export function useEmployeeCreate() {
    return useScopedCompanyMutation<Employee, Partial<Employee>>(
        () => ["employees"],
        (vars, cid) => postByCompany<Employee>("/employees", vars, cid),
    );
}