// FILE: src/app/(private)/budgetperiods/components/BudgetPeriodTable.tsx
"use client";
import React, { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Pagination,
    PaginationPrevious,
    PaginationNext,
    PaginationItem,
    PaginationLink,
    PaginationContent,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit, Lock, Unlock } from "lucide-react";
import type { BudgetPeriod } from "../types";
import { useBudgetPeriods } from "../hooks/useBudgetPeriods";

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
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const badge = (status: BudgetPeriod["status"]) => {
        if (status === "open") return <Badge className="bg-green-100 text-green-800">Aberto</Badge>;
        if (status === "closed") return <Badge variant="secondary">Fechado</Badge>;
        return <Badge variant="outline" className="gap-1"><AlertCircle className="w-3 h-3" />Pendente</Badge>;
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return periods.filter((period) => {
            const matchesPeriodDescription = period.description.toLowerCase().includes(q)

            return matchesPeriodDescription;
        });
    }, [periods, search,]);

    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return (
        <>
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
                    {items.map((p) => (
                        <TableRow key={p.id}>
                            <TableCell className="font-medium py-1">{p.description}</TableCell>
                            <TableCell className="py-1">{p.year}</TableCell>
                            <TableCell className="py-1">{formatBR(p.startDate)} - {formatBR(p.endDate)}</TableCell>
                            <TableCell className="py-1">{badge(p.status)}</TableCell>
                            <TableCell className="py-1">{formatBR(p.createdAt)}</TableCell>
                            <TableCell className="py-1">{p.closedBy ?? "-"}</TableCell>
                            <TableCell className="py-1">
                                <div className="flex gap-2">
                                    <Button className="cursor-pointer" variant="ghost" size="sm" onClick={() => onEdit(p)} disabled={p.status === "closed"}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    {p.status === "open" ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onClose(String(p.id))}
                                            className="text-red-600 border-red-200 hover:bg-red-50 cursor-pointer"
                                        >
                                            <Lock className="w-4 h-4 mr-1" /> Fechar
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onReopen(String(p.id))}
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

            <div className="flex items-center justify-center mt-4">
                {total > 0 && (
                    <div className="mt-4 flex justify-end">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => page > 1 && setPage(page - 1)}
                                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {Array.from({ length: pageCount }).map((_, i) => {
                                    const n = i + 1;
                                    const active = n === page;
                                    return (
                                        <PaginationItem key={n} className={active ? "cursor-pointer list-none" : ""}>
                                            <PaginationLink
                                                className="cursor-pointer"
                                                onClick={() => setPage(n)}
                                                {...(active && { "aria-current": "page" })}

                                            >
                                                {n}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => page < pageCount && setPage(page + 1)}
                                        className={page === pageCount ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {total === 0 && (
                    <div className="text-center py-8 text-gray-500">Nenhum registro encontrado.</div>
                )}
            </div>
        </>
    );
}