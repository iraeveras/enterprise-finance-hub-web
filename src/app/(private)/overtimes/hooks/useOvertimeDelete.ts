// FILE: src/app/(private)/overtimes/hooks/useOvertimeDelete.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useOvertimeDelete() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            await api.delete(`/overtimes/${id}`);
            return id;
        },
        onSuccess: () => queryclient.invalidateQueries({ queryKey: ["overtimes"] }),
    });
}