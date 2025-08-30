// FILE: src/app/(private)/employees/hooks/useEmployees.ts
"use client";

import { useScopedCompanyQuery, getByCompany } from "@/hooks/scopedCompany";
import type { Employee } from "../types";

export function useEmployees(search = "") {
    return useScopedCompanyQuery<Employee[]>(
        (cid) => ["employees", { search }],
        (cid) => getByCompany<Employee[]>("/employees", cid, { search }),
        true,
        // SELECT (fallback): filtra por companyId se o back não filtrar
        (rows, cid) => rows.filter((e: any) => Number(e.companyId) === Number(cid))
    );
}