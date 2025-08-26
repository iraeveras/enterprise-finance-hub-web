// FILE: src/components/layout/ClientLayout.tsx
"use client"
import { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CompanyProvider } from "@/context/CompanyContext";

const queryClient = new QueryClient();

export default function ClientLayout({
    children
}: {
    children: ReactNode
}) {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <CompanyProvider>
                    <TooltipProvider>
                        <Sonner richColors />
                        {children}
                    </TooltipProvider>
                </CompanyProvider>
            </QueryClientProvider>
        </AuthProvider>
    );
}