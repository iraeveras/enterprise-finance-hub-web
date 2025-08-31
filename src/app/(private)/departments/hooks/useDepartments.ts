// src/app/(private)/departments/hooks/useDepartments.ts
"use client";

import { useScopedCompanyQuery, getByCompany } from "@/hooks/scopedCompany";
import type { Department } from "../types";

export function useDepartments(search = "") {
    return useScopedCompanyQuery<Department[]>(
        (cid) => ["departments", { search }],
        (cid) => getByCompany<Department[]>("/departments", cid, { search}),
        true,
        (rows, cid) => rows.filter((e: any) => Number(e.companyId) === Number(cid))
    );
}