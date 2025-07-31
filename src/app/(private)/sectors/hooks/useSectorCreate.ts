// src/app/(private)/sectors/hooks/useSectorCreate.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { CreateSectorInput, Sector } from "../types";

export function useSectorCreate() {
    const queryclient = useQueryClient();
    return useMutation<Sector, Error, CreateSectorInput>({
        mutationFn: async (newSector) => {
            const res = await api.post<{ data: Sector }>("/sectors", newSector);
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["sectors"] });
        },
    });
}