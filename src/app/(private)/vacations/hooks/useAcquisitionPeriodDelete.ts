// FILE: src/app/(private)/vacations/hooks/useAcquisitionPeriodDelete.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useAcquisitionPeriodDelete() {
  const queryclient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/acquisition-periods/${id}`);
      return id;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["acquisition-periods"] });
    },
  });
}