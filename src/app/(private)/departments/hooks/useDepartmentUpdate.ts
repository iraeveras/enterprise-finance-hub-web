// src/app/(private)/departments/hooks/useDepartmentUpdate.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Department } from "@/types";

export function useDepartmentUpdate() {
    const queryclient = useQueryClient();
    return useMutation<Department, Error, Department>({
        mutationFn: async ({ id, ...data }) => {
            const res = await api.put<{ data: Department }>(`/departments/${id}`, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["departments"] });
        },
    });
}