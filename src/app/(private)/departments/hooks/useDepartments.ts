// src/app/(private)/departments/hooks/useDepartments.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { Department } from "@/types";

export function useDepartments() {
    return useQuery<Department[], Error>({
        queryKey: ["departments"],
        queryFn: async () => {
            const res = await api.get<{ data: Department[] }>("/departments");
            return res.data.data;
        },
        refetchOnWindowFocus: false,
    });
}