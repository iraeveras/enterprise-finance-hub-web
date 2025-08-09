// FILE: src/app/(private)/acquisitionperiods/hooks/useAcquisitionPeriods.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { AcquisitionPeriod } from "../types";

export function useAcquisitionPeriods() {
  return useQuery<AcquisitionPeriod[], Error>({
    queryKey: ["acquisition-periods"],
    queryFn: async () => {
      const res = await api.get<{ data: AcquisitionPeriod[] }>("/acquisition-periods");
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });
}