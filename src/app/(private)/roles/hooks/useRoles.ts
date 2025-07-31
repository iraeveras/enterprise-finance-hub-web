// FILE: src/app/(private)/roles/hooks/useRoles.ts
"use client"
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { Role } from "../types";

export function useRoles() {
    return useQuery<Role[], Error>({
        queryKey: ["roles"],
        queryFn: async () => {
            const res = await api.get("/roles");
            return res.data.data as Role[];
        }
    })
}