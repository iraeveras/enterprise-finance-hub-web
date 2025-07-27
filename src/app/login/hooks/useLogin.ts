// FILE: src/app/login/hooks/useLogin.ts
import { Role } from "@/types";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api"
import axios from "axios";

export interface LoginResponse {
    user: {
        id: string;
        name: string;
        email: string;
        role: Role; // tipar depois conforme seu backend
    };
    token: string;
}

export function useLogin() {
    return useMutation<LoginResponse, Error, { email: string; password: string }>({
        mutationFn: async ({ email, password }) => {
            const res = await api.post("/users/login", { email, password });
        // O payload esperado está em res.data.data por causa do apiResponse
            if (!res.data?.data) throw new Error(res.data.message || "Erro de login");
            return res.data.data as LoginResponse;
        },
    });
}