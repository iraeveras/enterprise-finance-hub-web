// FILE: src/app/(private)/vacations/hooks/useAcquisitionPeriodUpdate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { AcquisitionPeriod, UpdateAcquisitionPeriodInput } from "../types";

export function useAcquisitionPeriodUpdate() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateAcquisitionPeriodInput) => {
      const { id, ...data } = payload;
      const res = await api.put<{ data: AcquisitionPeriod }>(`/acquisition-periods/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["acquisition-periods"] });
    },
  });
}