// src/app/(private)/sectors/hooks/useSectors.ts
"use client"

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { Sector } from "../types";

export function useSectors() {
    return useQuery<Sector[], Error>({
        queryKey: ["sectors"],
        queryFn: async () => {
            const res = await api.get<{ data: Sector[]}>("/sectors");
            return res.data.data;
        },
        refetchOnWindowFocus: false,
    });
}