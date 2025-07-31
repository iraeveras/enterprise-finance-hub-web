// src/app/(private)/departments/hooks/useDepartmentCreate.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Department, CreateDepartmentInput } from "../types";

export function useDepartmentCreate() {
    const queryclient = useQueryClient();
    return useMutation<Department, Error, CreateDepartmentInput>({
        mutationFn: async (newDept) => {
            const res = await api.post<{ data: Department }>("/departments", newDept);
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["departments"] });
        },
    });
}