// FILE: src/app/(private)/roles/hooks/useRoleUpdate.ts
"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Role } from "../types";

type UpdadeRoleInput = Omit<Role, "id">;

export function useRoleUpdate() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...data }: Role) => {
            const res = await api.put<{ data: Role }>(`/roles/${id}`, data);
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["roles"] });
        },
    });
}