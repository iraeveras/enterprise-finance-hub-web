// FILE: src/app/(private)/vacations/hooks/useVacationDelete.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useVacationDelete() {
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/vacations/${id}`);
      return id;
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["vacations"] });
    },
  });
}