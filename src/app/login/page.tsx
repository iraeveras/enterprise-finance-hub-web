// FILE: src/app/login/page.tsx
"use client";

import { useForm } from "react-hook-form";
import api from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/app/login/hooks/useLogin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type FormData = { email: string; password: string };

export default function LoginPage() {
    const { register, handleSubmit } = useForm<FormData>();
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        try {
            await api.post("/users/login", data);
            router.replace("/");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Erro ao autenticar");
        }
    };

    return (
        <div className="flex items-center justify-center min-w-full h-screen">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="min-w-sm md:max-w-md bg-white rounded-lg shadow-md p-8 space-y-6"
            >
                <h1 className="text-xl font-bold text-center">Login</h1>
                <div>
                    <Input
                        type="email"
                        placeholder="Email"
                        {...register("email", { required: true })}
                    />
                </div>
                <div>
                    <Input
                        type="password"
                        placeholder="Senha"
                        {...register("password", { required: true })}
                    />
                </div>
                
                <Button type="submit" className="w-full">
                    Entrar
                </Button>
            </form>
        </div>
    );
}