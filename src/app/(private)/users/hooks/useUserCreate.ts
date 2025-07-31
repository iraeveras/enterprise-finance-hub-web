"use client"
// src/app/(private)/users/hooks/useUserCreate.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { CreateUserInput, User } from "../types";

export function useUserCreate() {
    const queryClient = useQueryClient();

    return useMutation<User, Error, CreateUserInput>({
        mutationFn: async (newUser) => {
            const res = await api.post<{ data: User }>("/users", newUser);
            return res.data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
}