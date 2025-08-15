// FILE: src/app/(private)/overtimes/components/OvertimeTableNew.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Filter, Download, Search } from "lucide-react";
import type { Overtime } from "../types";

interface Props {
    entries: Overtime[];
    onEdit: (e: Overtime) => void;
    onDelete: (id: number | string) => void;
    employeeName: (id: number) => string;
}

export function OvertimeTableNew({ entries, onEdit, onDelete, employeeName }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [monthlyDetails, setMonthlyDetails] = useState<any[]>([]);
    const itemsPerPage = 10;

    const grouped = useMemo(() => {
        const map = new Map<number, any>();
        for (const e of entries) {
            const key = e.employeeId;
            if (!map.has(key)) {
                map.set(key, {
                    employeeId: key,
                    employeeName: employeeName(key),
                    position: e.function,
                    he50Total: 0, he100Total: 0, holidayTotal: 0, nightTotal: 0,
                    dsrTotal: 0, dsrNightTotal: 0, yearTotal: 0, budgetedTotal: 0, variance: 0,
                    status: "open" as "open" | "closed" | "mixed",
                    entries: [] as Overtime[],
                });
            }
            const obj = map.get(key)!;
            obj.he50Total += e.he50Value ?? e.overtime50Value ?? 0;
            obj.he100Total += e.he100Value ?? e.overtime100Value ?? 0;
            obj.holidayTotal += e.holidayValue ?? 0;
            obj.nightTotal += e.nightValue ?? e.nightShiftValue ?? 0;
            obj.dsrTotal += e.dsrValue ?? 0;
            obj.dsrNightTotal += e.dsrNightValue ?? 0;
            obj.yearTotal += e.totalValue ?? 0;
            obj.budgetedTotal += e.previousYearTotal ?? e.budgetedAmount ?? 0;
            obj.entries.push(e);
        }
        // finalize status + variance
        return Array.from(map.values()).map((d) => {
            const hasOpen = d.entries.some((e: Overtime) => e.status === "open");
            const hasClosed = d.entries.some((e: Overtime) => e.status === "closed");
            return { ...d, variance: d.yearTotal - d.budgetedTotal, status: hasOpen && hasClosed ? "mixed" : hasOpen ? "open" : "closed" };
        });
    }, [entries, employeeName]);

    const filtered = useMemo(() => {
        return grouped.filter(d => {
            const matchesSearch =
                d.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (d.position ?? "").toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || d.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [grouped, searchTerm, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const current = filtered.slice(start, start + itemsPerPage);

    const getVarianceColor = (p: number) =>
        p > 10 ? "text-red-600" : p < -10 ? "text-green-600" : "text-yellow-600";

    const openDetails = (employeeId: number) => {
        const list = entries.filter(e => e.employeeId === employeeId);
        const rows = Array.from({ length: 12 }, (_, i) => {
            const month = i + 1;
            const m = list.find(e => e.month === month);
            return {
                month, monthName: new Date(list[0]?.year ?? new Date().getFullYear(), i).toLocaleDateString("pt-BR", { month: "long" }),
                he50Value: m?.he50Value ?? m?.overtime50Value ?? 0,
                he100Value: m?.he100Value ?? m?.overtime100Value ?? 0,
                holidayValue: m?.holidayValue ?? 0,
                nightValue: m?.nightValue ?? m?.nightShiftValue ?? 0,
                dsrValue: m?.dsrValue ?? 0,
                dsrNightValue: m?.dsrNightValue ?? 0,
                totalValue: m?.totalValue ?? 0,
                previousYearTotal: m?.previousYearTotal ?? m?.budgetedAmount ?? 0,
                variance: (m?.totalValue ?? 0) - (m?.previousYearTotal ?? m?.budgetedAmount ?? 0),
            };
        });
        setMonthlyDetails(rows);
        setSelectedEmployee(employeeId);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <CardTitle>Lançamentos de Horas Extras</CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" />Filtrar</Button>
                            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" />Exportar</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* filtros */}
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_12rem] gap-2">
                        <div className="relative min-w-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                aria-label="Buscar por funcionário ou função"
                                placeholder="Buscar por funcionário ou função..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 w-full"
                            />
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Todos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="open">Aberto</SelectItem>
                                <SelectItem value="closed">Fechado</SelectItem>
                                <SelectItem value="mixed">Misto</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* tabela */}
                    <div className="-mx-4 sm:mx-0 overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Funcionário</TableHead>
                                    <TableHead>Função</TableHead>
                                    <TableHead className="text-right">H.E. 50%</TableHead>
                                    <TableHead className="text-right">H.E. 100%</TableHead>
                                    <TableHead className="text-right">Feriados</TableHead>
                                    <TableHead className="text-right">Noturno</TableHead>
                                    <TableHead className="text-right">DSR</TableHead>
                                    <TableHead className="text-right">DSR Not.</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead className="text-right">Orçado</TableHead>
                                    <TableHead className="text-right">Variação</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-32">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {current.length > 0 ? current.map((d) => {
                                    const vPerc = d.budgetedTotal > 0 ? (d.variance / d.budgetedTotal) * 100 : 0;
                                    return (
                                        <TableRow key={d.employeeId}>
                                            <TableCell className="font-medium">{d.employeeName}</TableCell>
                                            <TableCell>{d.position}</TableCell>
                                            <TableCell className="text-right">R$ {d.he50Total.toFixed(2).replace(".", ",")}</TableCell>
                                            <TableCell className="text-right">R$ {d.he100Total.toFixed(2).replace(".", ",")}</TableCell>
                                            <TableCell className="text-right">R$ {d.holidayTotal.toFixed(2).replace(".", ",")}</TableCell>
                                            <TableCell className="text-right">R$ {d.nightTotal.toFixed(2).replace(".", ",")}</TableCell>
                                            <TableCell className="text-right">R$ {d.dsrTotal.toFixed(2).replace(".", ",")}</TableCell>
                                            <TableCell className="text-right">R$ {d.dsrNightTotal.toFixed(2).replace(".", ",")}</TableCell>
                                            <TableCell className="text-right font-medium">R$ {d.yearTotal.toFixed(2).replace(".", ",")}</TableCell>
                                            <TableCell className="text-right">R$ {d.budgetedTotal.toFixed(2).replace(".", ",")}</TableCell>
                                            <TableCell className={`text-right ${getVarianceColor(vPerc)}`}>
                                                <div className="flex flex-col items-end">
                                                    <span className="font-medium">{(d.variance >= 0 ? "+" : "")}R$ {d.variance.toFixed(2).replace(".", ",")}</span>
                                                    <span className="text-xs">{(vPerc >= 0 ? "+" : "")}{vPerc.toFixed(1)}%</span>
                                                </div>
                                            </TableCell>
                                            <TableCell><Badge variant={d.status === "open" ? "destructive" : d.status === "closed" ? "secondary" : "outline"}>{d.status === "mixed" ? "Misto" : d.status === "open" ? "Aberto" : "Fechado"}</Badge></TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openDetails(d.employeeId)}><Eye className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => { const first = d.entries[0]; if (first) onEdit(first); }}><Edit className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700" onClick={() => d.entries.forEach((e: Overtime) => onDelete(e.id!))}><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : (
                                    <TableRow><TableCell colSpan={13} className="text-center py-8 text-muted-foreground">Nenhum lançamento encontrado</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* paginação básica */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2">
                            <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Anterior</Button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                <Button key={p} size="sm" variant={p === currentPage ? "default" : "outline"} onClick={() => setCurrentPage(p)}>{p}</Button>
                            ))}
                            <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Próxima</Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de detalhes */}
            {selectedEmployee && (
                <Dialog open onOpenChange={() => setSelectedEmployee(null)}>
                    <DialogContent className="w-[calc(100vw-2rem)] max-w-5xl max-h-[90vh] overflow-y-auto p-0">
                        <div className="px-4 sm:px-6 py-4">
                            <DialogHeader>
                                <DialogTitle>Detalhamento Mensal — {employeeName(selectedEmployee)}</DialogTitle>
                            </DialogHeader>

                            <div className="-mx-4 sm:mx-0 overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Mês</TableHead>
                                            <TableHead className="text-right">HE 50%</TableHead>
                                            <TableHead className="text-right">HE 100%</TableHead>
                                            <TableHead className="text-right">Feriados</TableHead>
                                            <TableHead className="text-right">Noturno</TableHead>
                                            <TableHead className="text-right">DSR</TableHead>
                                            <TableHead className="text-right">DSR Noturno</TableHead>
                                            <TableHead className="text-right">Total Exercício</TableHead>
                                            <TableHead className="text-right">Ano Anterior</TableHead>
                                            <TableHead className="text-right">Diferença</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {monthlyDetails.map(m => (
                                            <TableRow key={m.month}>
                                                <TableCell className="font-medium">{m.monthName}</TableCell>
                                                <TableCell className="text-right">R$ {m.he50Value.toFixed(2).replace(".", ",")}</TableCell>
                                                <TableCell className="text-right">R$ {m.he100Value.toFixed(2).replace(".", ",")}</TableCell>
                                                <TableCell className="text-right">R$ {m.holidayValue.toFixed(2).replace(".", ",")}</TableCell>
                                                <TableCell className="text-right">R$ {m.nightValue.toFixed(2).replace(".", ",")}</TableCell>
                                                <TableCell className="text-right">R$ {m.dsrValue.toFixed(2).replace(".", ",")}</TableCell>
                                                <TableCell className="text-right">R$ {m.dsrNightValue.toFixed(2).replace(".", ",")}</TableCell>
                                                <TableCell className="text-right font-medium">R$ {m.totalValue.toFixed(2).replace(".", ",")}</TableCell>
                                                <TableCell className="text-right">R$ {m.previousYearTotal.toFixed(2).replace(".", ",")}</TableCell>
                                                <TableCell className={`text-right ${m.variance >= 0 ? "text-red-600" : "text-green-600"}`}>
                                                    {(m.variance >= 0 ? "+" : "")}R$ {m.variance.toFixed(2).replace(".", ",")}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={() => setSelectedEmployee(null)}>Fechar</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}