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

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name + "="));
    return match ? decodeURIComponent(match.split("=")[1]) : null;
}

function setCookie(name: string, value: string, days = 30) {
    if (typeof document === "undefined") return;
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(
        value
    )}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export function CompanyProvider({ children }: { children: React.ReactNode }) {
    const companiesQ = useCompanies(); // dados reais
    const companies = (companiesQ.data ?? []).filter((c) => c.status === "active");

    const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

    // carrega id salvo
    useEffect(() => {
        const saved = getCookie(STORAGE_KEY);
        if (saved) setSelectedCompanyId(saved);
    }, []);

    // se a empresa salva não existe mais, limpa
    useEffect(() => {
        if (companiesQ.isLoading) return;
        if (!selectedCompanyId) return;
        const exists = companies.some((c) => String(c.id) === String(selectedCompanyId));
        if (!exists) {
            setSelectedCompanyId(null);
            deleteCookie(STORAGE_KEY);
        }
    }, [companiesQ.isLoading, companies, selectedCompanyId]);

    const selectedCompany = useMemo(
        () => companies.find((c) => String(c.id) === String(selectedCompanyId)) ?? null,
        [companies, selectedCompanyId]
    );

    const setSelectedCompany = (c: Company | null) => {
        if (!c) {
            setSelectedCompanyId(null);
            deleteCookie(STORAGE_KEY);
            return;
        }
        const idStr = String(c.id);
        setSelectedCompanyId(idStr);
        setCookie(STORAGE_KEY, idStr); // segue o padrão de cookies da app
    };

    const clearCompany = () => {
        setSelectedCompany(null);
    };

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