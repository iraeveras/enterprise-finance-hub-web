// src/app/(private)/sectors/hooks/useSectors.ts
"use client"

import { useQuery } from "@tanstack/react-query";
import { useScopedCompanyQuery, getByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api";
import type { Sector } from "../types";

export function useSectors(search = "") {
    return useScopedCompanyQuery<Sector[]>(
        (cid) => ["sectors", { search }],
        (cid) => getByCompany<Sector[]>("/sectors", cid, { search }),
        true,
        (rows, cid) => rows.filter((e: any) => Number(e.companyId) === Number(cid))
    );
}