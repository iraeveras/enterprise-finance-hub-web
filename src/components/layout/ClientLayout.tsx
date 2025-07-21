"use client"
// FILE: src/components/layout/ClientLayout.tsx
import { ReactNode } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function ClientLayout({ 
    children 
}: { 
    children: ReactNode 
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Sonner/>
                {children}
            </TooltipProvider>
        </QueryClientProvider>
    );
}