// FILE: src/app/(private)/vacations/hooks/useVacations.ts
"use client";

import { useScopedCompanyQuery, getByCompany } from "@/hooks/scopedCompany";
import type { Vacation } from "../types";

/**
 * Lista de férias escopada por empresa.
 * Se por qualquer motivo vierem registros de outras empresas, fazemos
 * um filtro de segurança no client.
 */
export function useVacations(search = "") {
  return useScopedCompanyQuery<Vacation[]>(
    (cid) => ["vacations", { search }],
    (cid) => getByCompany<Vacation[]>("/vacations", cid, { search }),
    true,
    (rows, cid) => rows.filter((v: any) => Number(v.companyId) === Number(cid))
  );
}