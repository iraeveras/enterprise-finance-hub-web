// src/app/(private)/sectors/hooks/useSectorUpdate.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Sector } from "../types";

export function useSectorUpdate() {
    const queryclient = useQueryClient();
    return useMutation<Sector, Error, Sector>({
        mutationFn: async ({ id, ...data }) => {
            const res = await api.put<{ data: Sector }>(`/sectors/${id}`, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["sectors"] });
        },
    });
}