// FILE: src/app/(private)/vacations/hooks/useVacationUpdate.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { UpdateVacationInput, Vacation } from "../types";

export function useVacationUpdate() {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateVacationInput) => {
      const { id, ...data } = payload;
      const res = await api.put<{ data: Vacation }>(`/vacations/${id}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["vacations"] });
    },
  });
}