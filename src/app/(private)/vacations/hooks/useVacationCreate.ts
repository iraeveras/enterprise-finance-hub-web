// FILE: src/app/(private)/vacations/hooks/useVacationCreate.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { CreateVacationInput, Vacation } from "../types";

export function useVacationCreate() {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateVacationInput) => {
      const res = await api.post<{ data: Vacation }>("/vacations", payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["vacations"] });
    },
  });
}