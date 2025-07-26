// FILE: src/components/layout/ProctedPage.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function ProtectedPage({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            console.warn("Usuário não autenticado, redirecionando para login...");
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="p-6 h-screen text-center flex items-center justify-center">
                <span className="text-slate-400">Carregando...</span>
            </div>
        );
    }

    return <>{children}</>;
}