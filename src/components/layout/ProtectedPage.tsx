// FILE: src/components/layout/ProctedPage.tsx
"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

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
            <div className="p-6 h-screen text-center flex flex-col items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span className="text-slate-400">Carregando...</span>
            </div>
        );
    }

    return <>{children}</>;
}