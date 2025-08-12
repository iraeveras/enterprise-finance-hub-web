"use client";
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

type BudgetPeriod = {
    id: number;
    year: number;
    companyId: number;
    status: "open" | "closed" | "pending";
};

export function useCurrentBudgetYear(companyId?: number) {
    return useQuery<number>({
        queryKey: ["current-budget-year", companyId ?? null],
        queryFn: async () => {
            // tenta pegar aberto da empresa; se não houver, pega o maior ano dessa empresa
            const res = await api.get<{ data: BudgetPeriod[] }>("/budgetperiods", {
                params: { companyId, status: "open" },
            });
            const open = res.data.data;
            if (open.length) return open[0].year;

            const allRes = await api.get<{ data: BudgetPeriod[] }>("/budgetperiods", { params: { companyId } });
            const all = allRes.data.data;
            if (all.length) return all.sort((a, b) => b.year - a.year)[0].year;

            return new Date().getFullYear();
        },
    });
}