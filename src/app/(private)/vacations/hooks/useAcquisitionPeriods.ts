// FILE: src/app/(private)/acquisitionperiods/hooks/useAcquisitionPeriods.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { AcquisitionPeriod, AcquisitionPeriodsParams } from "../types";

export function useAcquisitionPeriods(params: AcquisitionPeriodsParams = {}) {
  return useQuery<AcquisitionPeriod[], Error>({
    queryKey: ["acquisition-periods", params],
    queryFn: async () => {
      const res = await api.get<{ data: AcquisitionPeriod[] }>("/acquisition-periods", { params });
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });
}