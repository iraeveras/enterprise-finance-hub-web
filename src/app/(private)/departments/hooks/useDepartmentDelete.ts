// src/app/(private)/departments/hooks/useDepartmentDelete.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useDepartmentDelete() {
    const queryclient = useQueryClient();
    return useMutation<string, Error, string>({
        mutationFn: async (id) => {
            await api.delete(`/departments/${id}`);
            return id;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["departments"] });
        },
    });
}