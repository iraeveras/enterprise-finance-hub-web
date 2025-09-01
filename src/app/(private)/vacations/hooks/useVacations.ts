// FILE: src/app/(private)/vacations/hooks/useVacations.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { useScopedCompanyQuery, getByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api";
import type { Vacation } from "../types";

export function useVacations(search = "") {
  return useScopedCompanyQuery<Vacation[]>(
    (cid) => ["vacations", { search }],
    (cid) => getByCompany<Vacation[]>("/vacations", cid, { search }),
    true,
    (rows, cid) => rows.filter((e: any) => Number(e.companyId) === Number(cid))
  );
}