// FILE: src/app/(private)/roles/hooks/useRoleCreate.ts
"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Role } from "../types";

// omita o id, ele é gerado pelo backend
type CreateRoleInput = Omit<Role, "id">;

export function useRoleCreate() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (newRole: CreateRoleInput) => {
            const res = await api.post<{data: Role}>("/roles", newRole);
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({queryKey: ["roles"] });
        },
    });
}