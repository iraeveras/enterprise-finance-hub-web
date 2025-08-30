// FILE: src/app/(private)/employees/hooks/useEmployeeUpdate.ts
"use client";

import { useScopedCompanyMutation, putByCompany } from "@/hooks/scopedCompany";
import type { Employee, UpdateEmployeeInput } from "../types";

export function useEmployeeUpdate() {
    return useScopedCompanyMutation<Employee, { id: number; data: Partial<Employee> }>(
        () => ["employees"],
        (vars, cid) => putByCompany<Employee>(`/employees/${vars.id}`, vars.data, cid),
    );
}