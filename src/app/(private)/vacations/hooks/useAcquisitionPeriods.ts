// FILE: src/app/(private)/acquisitionperiods/hooks/useAcquisitionPeriods.ts
"use client";

import { useMemo } from "react";
import {
  useScopedCompanyQuery,
  getByCompany,
  useCompanyId,
} from "@/hooks/scopedCompany";
import { useEmployees } from "@/app/(private)/employees/hooks/useEmployees";
import type { AcquisitionPeriod, AcquisitionPeriodsParams } from "../types";

export function useAcquisitionPeriods(params: AcquisitionPeriodsParams = {}) {
  const companyId = useCompanyId();
  const employeesQ = useEmployees("");

  const employeeIdsSet = useMemo<Set<number>>(() => {
    const set = new Set<number>();
    (employeesQ.data ?? []).forEach((e: any) => set.add(Number(e.id)));
    return set;
  }, [employeesQ.data]);

  return useScopedCompanyQuery<AcquisitionPeriod[]>(
    () => ["acquisition-periods", params],
    async (cid) => {
      const rows: AcquisitionPeriod[] = await getByCompany<AcquisitionPeriod[]>(
        "/acquisition-periods",
        cid,
        params
      );

      // 1) Se o período já veio com companyId próprio, filtra direto
      const haveOwnCompany = rows.some((p) => (p as any).companyId != null);
      if (haveOwnCompany) {
        return rows.filter(
          (p) => Number((p as any).companyId) === Number(cid)
        );
      }

      // 2) Se o embed employee inclui companyId, usa isso
      const haveEmployeeCompany = rows.some(
        (p) => p.employee && p.employee.companyId != null
      );
      if (haveEmployeeCompany) {
        return rows.filter(
          (p) => Number(p.employee?.companyId) === Number(cid)
        );
      }

      // 3) Fallback: cruza pelo employeeId com a lista de employees da empresa ativa
      if (!employeeIdsSet.size) return [];
      return rows.filter((p) => employeeIdsSet.has(Number(p.employeeId)));
    },
    // Habilita só quando já temos empresa e employees prontos
    !!companyId && !employeesQ.isLoading
  );
}