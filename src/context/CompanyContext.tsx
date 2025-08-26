// FILE: src/contexts/CompanyContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCompanies } from "@/app/(private)/companies/hooks/useCompanies";
import type { Company } from "@/app/(private)/companies/types";

type CompanyCtx = {
    companies: Company[];
    isLoading: boolean;
    selectedCompany: Company | null;
    selectedCompanyId: string | null;
    setSelectedCompany: (company: Company | null) => void;
    clearCompany: () => void;
    isCompanySelected: boolean;
};

const CompanyContext = createContext<CompanyCtx | undefined>(undefined);

const STORAGE_KEY = "selectedCompanyId";

export function CompanyProvider({ children }: { children: React.ReactNode }) {
    const companiesQ = useCompanies(); // dados reais
    const companies = (companiesQ.data ?? []).filter((c) => c.status === "active");
    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    // carrega id salvo
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setSelectedCompanyId(raw);
        } catch { }
    }, []);

    // se a empresa salva não existe mais, limpa
    useEffect(() => {
        if (companiesQ.isLoading) return;
        if (!selectedCompanyId) return;
        const exists = companies.some((c) => String(c.id) === String(selectedCompanyId));
        if (!exists) {
            setSelectedCompanyId(null);
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch { }
        }
    }, [companiesQ.isLoading, companies, selectedCompanyId]);

    const selectedCompany = useMemo(
        () => companies.find((c) => String(c.id) === String(selectedCompanyId)) ?? null,
        [companies, selectedCompanyId]
    );

    const setSelectedCompany = (c: Company | null) => {
        if (!c) {
            setSelectedCompanyId(null);
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch { }
            return;
        }
        const idStr = String(c.id);
        setSelectedCompanyId(idStr);
        try {
            localStorage.setItem(STORAGE_KEY, idStr);
        } catch { }
    };

    const clearCompany = () => setSelectedCompany(null);

    const value: CompanyCtx = {
        companies,
        isLoading: companiesQ.isLoading,
        selectedCompany,
        selectedCompanyId,
        setSelectedCompany,
        clearCompany,
        isCompanySelected: !!selectedCompany,
    };

    return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
}

export function useCompany() {
    const ctx = useContext(CompanyContext);
    if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
    return ctx;
}