"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useCompanyDelete() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/companies/${id}`);
            return id;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["companies"] });
        }
    })
}