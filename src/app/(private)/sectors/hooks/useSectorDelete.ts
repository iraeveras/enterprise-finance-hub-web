// src/app/(private)/sectors/hooks/useSectorDelete.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useSectorDelete() {
    const queryclient = useQueryClient();
    return useMutation<String, Error, String>({
        mutationFn: async (id) => {
            await api.delete(`/sectors/${id}`);
            return id;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["sectors"] });
        },
    });
}