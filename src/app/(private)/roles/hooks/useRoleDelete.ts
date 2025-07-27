// FILE: src/app/(private)/roles/hooks/useRoleDelete.ts
"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useRoleDelete() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/roles/${id}`);
            return id;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}