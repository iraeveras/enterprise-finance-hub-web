// FILE: src/app/(private)/vacations/hooks/useAcquisitionPeriodCreate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { AcquisitionPeriod, CreateAcquisitionPeriodInput } from "../types";

export function useAcquisitionPeriodCreate() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAcquisitionPeriodInput) => {
      const res = await api.post<{ data: AcquisitionPeriod }>("/acquisition-periods", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["acquisition-periods"] });
    },
  });
}