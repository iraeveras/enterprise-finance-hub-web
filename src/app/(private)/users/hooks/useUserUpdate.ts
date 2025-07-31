"use client"
// src/app/(private)/users/hooks/useUserUpdate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { UpdateUserInput, User } from "../types";

export function useUserUpdate() {
    const queryClient = useQueryClient();

    return useMutation<User, Error, UpdateUserInput>({
        // agora deixamos explícito que mutate() recebe um UpdateUserInput
        mutationFn: async (input) => {
            const { id, ...payload } = input;
            const res = await api.put<{ data: User }>(`/users/${id}`, payload);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}