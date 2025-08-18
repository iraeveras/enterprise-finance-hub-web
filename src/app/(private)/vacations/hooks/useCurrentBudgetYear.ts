// FILE: src/app/(private)/vacations/hooks/useCurrentBudgetYear.ts
"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

type BudgetPeriod = {
    id: number;
    year: number;
    companyId: number;
    status: "open" | "closed" | "pending";
};

type Result = { id: number | null; year: number };

export function useCurrentBudgetYear(companyId?: number) {
    return useQuery<Result>({
        queryKey: ["current-budget-year", companyId ?? null],
        queryFn: async () => {
            // 1) tenta aberto da empresa
            const res = await api.get<{ data: BudgetPeriod[] }>("/budgetperiods", {
                params: { companyId, status: "open" },
            });
            const open = res.data.data;
            if (open.length) return { id: open[0].id, year: open[0].year };

            // 2) senão, pega o mais recente da empresa
            const allRes = await api.get<{ data: BudgetPeriod[] }>("/budgetperiods", {
                params: { companyId },
            });
            const all = allRes.data.data;
            if (all.length) {
                const latest = [...all].sort((a, b) => b.year - a.year)[0];
                return { id: latest.id, year: latest.year };
            }

            // 3) fallback
            return { id: null, year: new Date().getFullYear() };
        },
    });
}