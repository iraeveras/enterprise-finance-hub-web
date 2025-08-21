// FILE: src/app/(private)/overtimes/components/OvertimeSectorAnalysis.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import OvertimeSectorAnalysisTable from "./OvertimeSectorAnalysisTable";
import { useBudgetPeriods } from "../../budgetperiods/hooks/useBudgetPeriods";
import type { Overtime } from "../types";

interface Props {
    entries: Overtime[];
    sectorOptions: { id: number; name: string }[];
    employeeName: (id: number) => string;
}

export function OvertimeSectorAnalysis({ entries, sectorOptions, employeeName }: Props) {
    const [selectedSector, setSelectedSector] = useState<number | "">("");

    const sectorEntries = useMemo(() => {
        if (!selectedSector) return [];
        return entries.filter(e => Number(e.costcenterId) === Number(selectedSector));
    }, [entries, selectedSector]);

    const totals = useMemo(() => {
        const budgeted = sectorEntries.reduce((acc, e) => acc + (e.budgetedAmount ?? 0), 0);
        const actual = sectorEntries.reduce((acc, e) => acc + (e.totalValue ?? 0), 0);
        const variance = actual - budgeted;
        const vPerc = budgeted > 0 ? (variance / budgeted) * 100 : 0;
        return { budgeted, actual, variance, vPerc };
    }, [sectorEntries]);

    const rows = sectorEntries.map((e) => ({
        id: e.id!,
        year: e.year,
        month: e.month,
        employeeName: employeeName(e.employeeId),
        employeeCode: String(e.employeeId).padStart(3, "0"),
        func: e.function,
        overtime50: e.overtime50 ?? e.he50Qty ?? 0,
        overtime100: e.overtime100 ?? e.he100Qty ?? 0,
        holidayHours: e.holidayHours ?? 0,
        nightShiftHours: e.nightShiftHours ?? 0,
        dsrValue: e.dsrValue ?? 0,
        dsrNightValue: e.dsrNightValue ?? 0,
        totalValue: e.totalValue ?? 0,
        budgetedAmount: e.budgetedAmount ?? e.previousYearTotal ?? 0,
        variance: e.variance ?? 0,
        variancePercentage: e.variancePercentage ?? 0,
        status: e.status ?? "open",
    }));

    const vClass = (p: number) => (p > 15 ? "text-red-600" : p > 5 ? "text-amber-600" : "text-green-600");

    return (
        <div className="space-y-4">
            <Card className="rounded-none">
                <CardHeader>
                    <CardTitle className="text-lg">Análise de Horas Extras por Setor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label>Selecione o Setor</Label>
                        <Select
                            value={selectedSector ? String(selectedSector) : ""}
                            onValueChange={(v) => setSelectedSector(v ? Number(v) : "")}
                        >
                            <SelectTrigger className="w-full sm:w-64">
                                <SelectValue placeholder="Escolha um setor" />
                            </SelectTrigger>
                            <SelectContent>
                                {sectorOptions.map(s => (
                                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {selectedSector !== "" && rows.length > 0 && (
                        <>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">
                                    {sectorOptions.find(s => s.id === selectedSector)?.name} ({rows.length})
                                </h3>
                                <div className="flex gap-4 text-sm">
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">Orçado</div>
                                        <div className="font-medium">R$ {totals.budgeted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">Realizado</div>
                                        <div className="font-medium">R$ {totals.actual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-xs text-muted-foreground">Variação</div>
                                        <div className={`font-medium ${vClass(Math.abs(totals.vPerc))}`}>
                                            {(totals.variance >= 0 ? "+" : "")}R$ {totals.variance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <OvertimeSectorAnalysisTable rows={rows} />
                        </>
                    )}

                    {selectedSector !== "" && rows.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            Nenhum lançamento encontrado para o setor selecionado.
                        </div>
                    )}

                    {selectedSector === "" && (
                        <div className="text-center py-8 text-muted-foreground">
                            Selecione um setor para visualizar a análise.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}