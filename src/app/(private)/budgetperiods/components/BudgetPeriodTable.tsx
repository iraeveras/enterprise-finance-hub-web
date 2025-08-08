// FILE: src/app/(private)/budgetperiods/components/BudgetPeriodTable.tsx
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit, Lock, Unlock } from "lucide-react";
import type { BudgetPeriod } from "../types";

function formatBR(iso: string) {
    return new Date(iso).toLocaleDateString("pt-BR");
}

export interface BudgetPeriodTableProps {
    periods: BudgetPeriod[];
    onEdit: (p: BudgetPeriod) => void;
    onClose: (id: string) => void;
    onReopen: (id: string) => void;
}

export function BudgetPeriodTable({ periods, onEdit, onClose, onReopen }: BudgetPeriodTableProps) {
    const badge = (status: BudgetPeriod["status"]) => {
        if (status === "open") return <Badge className="bg-green-100 text-green-800">Aberto</Badge>;
        if (status === "closed") return <Badge variant="secondary">Fechado</Badge>;
        return <Badge variant="outline" className="gap-1"><AlertCircle className="w-3 h-3" />Pendente</Badge>;
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Ano</TableHead>
                    <TableHead>Período</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>Fechado por</TableHead>
                    <TableHead>Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {periods.map((p) => (
                    <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.description}</TableCell>
                        <TableCell>{p.year}</TableCell>
                        <TableCell>{formatBR(p.startDate)} - {formatBR(p.endDate)}</TableCell>
                        <TableCell>{badge(p.status)}</TableCell>
                        <TableCell>{formatBR(p.createdAt)}</TableCell>
                        <TableCell>{p.closedBy ?? "-"}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => onEdit(p)} disabled={p.status === "closed"}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                {p.status === "open" ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onClose(p.id)}
                                        className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                                    >
                                        <Lock className="w-4 h-4 mr-1" /> Fechar
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onReopen(p.id)}
                                        className="text-green-600 border-green-200 hover:bg-green-50 cursor-pointer"
                                    >
                                        <Unlock className="w-4 h-4 mr-1" /> Reabrir
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}