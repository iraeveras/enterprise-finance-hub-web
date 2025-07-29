"use client"
// FILE: src/app/(private)/users/hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";
import type { User } from "@/types";

export function useUsers() {
    return useQuery<User[], Error>({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await api.get("/users");
            // nosso backend empacota em { data: [...] }
            return res.data.data;
        },
        // refetch ao voltar da aba
        refetchOnWindowFocus: false,
    });
}