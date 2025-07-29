"use client"
// src/app/(private)/users/hooks/useUserDelete.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useUserDelete() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/users/${id}`);
            return id;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["users"] });
        }
    });
}