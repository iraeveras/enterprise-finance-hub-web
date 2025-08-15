// FILE: src/app/(private)/overtimes/hooks/useOvertimes.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { Overtime } from "../types";

export function useOvertimes() {
    return useQuery<Overtime[], Error>({
        queryKey: ["overtimes"],
        queryFn: async () => {
            const res = await api.get<{ data: Overtime[] }>("/overtimes");
            return res.data.data;
        },
        refetchOnWindowFocus: false,
    });
}
