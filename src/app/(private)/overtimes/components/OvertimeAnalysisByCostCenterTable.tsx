// FILE: src/app/(private)/overtimes/components/OvertimeAnalysisByCostCenterTable.tsx
"use client";

import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Row = {
    id: number | string;
    year: number;
    month: number;
    employeeName: string;
    employeeCode?: string;
    func: string;
    overtime50?: number;
    overtime100?: number;
    dsrValue?: number;
    additionalValue?: number;
    totalValue: number;
    budgetedAmount: number;
    variance: number;
    variancePercentage: number;
    status?: "open" | "closed" | "pending";
};

interface Props {
    rows: Row[];
}

const monthsAbbr = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

const varianceClass = (p: number) =>
    p > 15 ? "text-red-600" : p > 5 ? "text-amber-600" : "text-green-600";

export default function OvertimeAnalysisByCostCenterTable({ rows }: Props) {
    return (
        <div className="-mx-4 sm:mx-0 overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="min-w-12 sm:min-w-16">Período</TableHead>
                        <TableHead className="min-w-36">Funcionário</TableHead>
                        <TableHead className="min-w-28">Função</TableHead>
                        <TableHead className="text-center min-w-16 sm:min-w-20">H.E. 50%</TableHead>
                        <TableHead className="text-center min-w-16 sm:min-w-20">H.E. 100%</TableHead>
                        <TableHead className="text-right min-w-20">DSR</TableHead>
                        <TableHead className="text-right min-w-20">Adicional</TableHead>
                        <TableHead className="text-right min-w-24">Total</TableHead>
                        <TableHead className="text-right min-w-24">Orçado</TableHead>
                        <TableHead className="text-right min-w-24">Variação</TableHead>
                        <TableHead className="text-center min-w-20">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell className="font-medium text-sm">
                                {monthsAbbr[r.month - 1]}/{r.year}
                            </TableCell>
                            <TableCell>
                                <div className="min-w-0">
                                    <div className="font-medium text-sm truncate">{r.employeeName}</div>
                                    {r.employeeCode && (
                                        <div className="text-[11px] text-muted-foreground truncate">
                                            Matrícula: {r.employeeCode}
                                        </div>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-sm">{r.func}</TableCell>
                            <TableCell className="text-center text-sm">{r.overtime50 ?? 0}h</TableCell>
                            <TableCell className="text-center text-sm">{r.overtime100 ?? 0}h</TableCell>
                            <TableCell className="text-right text-sm">
                                R$ {(r.dsrValue ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                                R$ {(r.additionalValue ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right font-medium text-sm">
                                R$ {r.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                                R$ {r.budgetedAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className={`text-sm font-medium ${varianceClass(Math.abs(r.variancePercentage))}`}>
                                    {(r.variance >= 0 ? "+" : "")}R$ {r.variance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                    <div className="text-[11px]">
                                        {(r.variancePercentage >= 0 ? "+" : "")}{r.variancePercentage.toFixed(1)}%
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge
                                    variant={r.status === "open" ? "default" : "secondary"}
                                    className="text-xs"
                                >
                                    {r.status === "open" ? "Aberto" : r.status === "closed" ? "Fechado" : "Pendente"}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}