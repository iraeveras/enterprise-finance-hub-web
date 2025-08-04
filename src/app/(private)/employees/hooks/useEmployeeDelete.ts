// FILE: src/app/(private)/employees/hooks/useEmployeeDelete.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useEmployeeDelete() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/employees/${id}`);
            return id;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}