"use client"
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { Company } from "../types";

export function useCompanies() {
    return useQuery<Company[]>({
        queryKey: ["companies"],
        queryFn: async () => {
            const { data } = await api.get("/companies");
            // Se usar apiResponse, retorne o data.data
            return data.data || [];
        },
    });
}