// FILE: src/app/(private)/employees/hooks/useEmployees.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { Employee } from "../types";

export function useEmployees() {
    return useQuery<Employee[], Error>({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await api.get<{ data: Employee[] }>("/employees");
            return res.data.data;
        },
        refetchOnWindowFocus: false,
    });
}