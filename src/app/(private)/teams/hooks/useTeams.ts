// FILE: src/app/(private)/teams/hooks/useTeams.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { useScopedCompanyQuery, getByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api"
import type { Team } from "../types"

export function useTeams(search = "") {
    return useScopedCompanyQuery<Team[]>(
        (cid) => ["teams"],
        (cid) => getByCompany<Team[]>("/teams", cid, { search }),
        true,
        (rows, cid) => rows.filter((e: any) => Number(e.companyId) === Number(cid))
    );
}