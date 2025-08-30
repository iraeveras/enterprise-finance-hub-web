// FILE: src/contexts/CompanyContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Company } from "@/app/(private)/companies/types";
import { useQueryClient } from "@tanstack/react-query";
import { getPersistedCompanyId, persistCompanyId } from "@/lib/company-storage";
import { useCompanies } from "@/app/(private)/companies/hooks/useCompanies";

type CompanyContextType = {
    companies: Company[];
    selectedCompany: Company | null;
    isCompanySelected: boolean;
    setSelectedCompany: (c: Company | null) => void;
};

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const companiesQ = useCompanies();
    const companies = companiesQ.data ?? [];

    const [selectedCompany, setSelectedCompanyState] = useState<Company | null>(null);

    // boot inicial pelo cookie/localStorage
    useEffect(() => {
        if (!companies.length) return;
        const persisted = getPersistedCompanyId();
        const match = companies.find((c) => Number(c.id) === persisted);
        if (match) setSelectedCompanyState(match);
    }, [companies.length]);

    const setSelectedCompany = (c: Company | null) => {
        setSelectedCompanyState(c);
        persistCompanyId(c ? Number(c.id) : null);

        // Estratégia de cache: como a queryKey é escopada por companyId (ver hooks),
        // mudar a empresa dispara novas queries automaticamente. Opcionalmente,
        // pode-se limpar caches antigos para liberar memória:
        queryClient.removeQueries({ predicate: () => true });
    };

    const value = useMemo<CompanyContextType>(
        () => ({
            companies,
            selectedCompany,
            isCompanySelected: !!selectedCompany,
            setSelectedCompany,
        }),
        [companies, selectedCompany],
    );

    // escuta alterações de outras abas
    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as { companyId: number | null };
            if (!companies.length) return;
            const match = companies.find((c) => Number(c.id) === (detail?.companyId ?? -1)) || null;
            setSelectedCompanyState(match);
        };
        window.addEventListener("company-changed", handler as any);
        return () => window.removeEventListener("company-changed", handler as any);
    }, [companies]);

    return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
    const ctx = useContext(CompanyContext);
    if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
    return ctx;
}