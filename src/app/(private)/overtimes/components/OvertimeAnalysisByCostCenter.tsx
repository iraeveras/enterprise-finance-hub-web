// FILE: src/app/(private)/overtimes/components/OvertimeAnalysisByCostCenter.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OvertimeAnalysisByCostCenterTable from "./OvertimeAnalysisByCostCenterTable";
import type { Overtime } from "../types";

interface Props {
    entries: Overtime[];
    employeeName: (id: number) => string;
    costCenterName: (id: number) => string;
}

export function OvertimeAnalysisByCostCenter({ entries, employeeName, costCenterName }: Props) {
    const sectors = Array.from(new Set(entries.map(e => e.costcenterId))).filter(Boolean);

    const vClass = (p: number) =>
        p > 15 ? "text-red-600" : p > 5 ? "text-amber-600" : "text-green-600";

    return (
        <div className="space-y-6">
            {sectors.map((ccId) => {
                const ccEntries = entries.filter(e => e.costcenterId === ccId);
                if (ccEntries.length === 0) return null;

                const totalBudgeted = ccEntries.reduce((acc, e) => acc + (e.budgetedAmount ?? 0), 0);
                const totalActual = ccEntries.reduce((acc, e) => acc + (e.totalValue ?? 0), 0);
                const totalVariance = totalActual - totalBudgeted;
                const variancePercentage = totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0;

                const rows = ccEntries.map(e => ({
                    id: e.id!,
                    year: e.year,
                    month: e.month,
                    employeeName: employeeName(e.employeeId),
                    employeeCode: String(e.employeeId).padStart(3, "0"),
                    func: e.function,
                    overtime50: e.overtime50 ?? e.he50Qty ?? 0,
                    overtime100: e.overtime100 ?? e.he100Qty ?? 0,
                    dsrValue: e.dsrValue ?? 0,
                    additionalValue: e.additionalValue ?? 0,
                    totalValue: e.totalValue ?? 0,
                    budgetedAmount: e.budgetedAmount ?? e.previousYearTotal ?? 0,
                    variance: e.variance ?? 0,
                    variancePercentage: e.variancePercentage ?? 0,
                    status: e.status ?? "open",
                }));

                return (
                    <Card key={String(ccId)}>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">
                                    Horas Extras — {costCenterName(ccId)} ({ccEntries.length})
                                </CardTitle>
                                <div className="flex gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">Orçado</div>
                                        <div className="font-medium">R$ {totalBudgeted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">Realizado</div>
                                        <div className="font-medium">R$ {totalActual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">Variação</div>
                                        <div className={`font-medium ${vClass(Math.abs(variancePercentage))}`}>
                                            {(totalVariance >= 0 ? "+" : "")}R$ {totalVariance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <OvertimeAnalysisByCostCenterTable rows={rows} />
                        </CardContent>
                    </Card>
                );
            })}

            {sectors.length === 0 && (
                <Card><CardContent className="text-center py-8 text-muted-foreground">Nenhum lançamento para análise por centro de custo.</CardContent></Card>
            )}
        </div>
    );
}