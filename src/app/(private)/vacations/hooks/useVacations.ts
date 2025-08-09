// FILE: src/app/(private)/vacations/hooks/useVacations.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { Vacation } from "../types";

export function useVacations() {
  return useQuery<Vacation[], Error>({
    queryKey: ["vacations"],
    queryFn: async () => {
      const res = await api.get<{ data: Vacation[] }>("/vacations");
      return res.data.data;
    },
    refetchOnWindowFocus: false,
  });
}