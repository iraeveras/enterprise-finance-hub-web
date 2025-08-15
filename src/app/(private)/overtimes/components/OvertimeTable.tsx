// FILE: src/app/(private)/overtimes/components/OvertimeTable.tsx
"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Download, Filter, Edit, Trash2 } from "lucide-react";
import type { Overtime } from "../types";
import { useEmployees } from "@/app/(private)/employees/hooks/useEmployees";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    entries: Overtime[];
    onEdit: (entry: Overtime) => void;
    onDelete: (id: number | string) => void;
}

export function OvertimeTable({ entries, onEdit, onDelete }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const empQ = useEmployees();
    const employees = empQ.data ?? [];
    const empName = (id: number) => employees.find((e) => Number(e.id) === Number(id))?.name ?? `ID ${id}`;

    const filtered = entries.filter((e) => {
        const matchesSearch =
            (e.function ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (e.justification ?? "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || e.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const start = (currentPage - 1) * itemsPerPage;
    const pageEntries = filtered.slice(start, start + itemsPerPage);

    const getVarianceColor = (pct: number) => (pct > 15 ? "text-red-600" : pct > 5 ? "text-amber-600" : "text-green-600");
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    return (
        <Card className="rounded-none">
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="text-lg md:text-xl">Lançamentos de Horas Extras ({filtered.length})</CardTitle>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filtros</Button>
                        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Exportar</Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar por função ou justificativa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos os status</SelectItem>
                            <SelectItem value="open">Aberto</SelectItem>
                            <SelectItem value="closed">Fechado</SelectItem>
                        </SelectContent>
                    </Select>
                    {/* <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-md">
                        <option value="all">Todos os status</option>
                        <option value="open">Aberto</option>
                        <option value="closed">Fechado</option>
                    </select> */}
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="min-w-[100px]">Período</TableHead>
                                <TableHead className="min-w-[150px]">Funcionário</TableHead>
                                <TableHead className="min-w-[120px]">Função</TableHead>
                                <TableHead className="text-center w-20">H.E. 50%</TableHead>
                                <TableHead className="text-center w-20">H.E. 100%</TableHead>
                                <TableHead className="text-right w-24">DSR</TableHead>
                                <TableHead className="text-right w-24">Adicional</TableHead>
                                <TableHead className="text-right w-24">Total</TableHead>
                                <TableHead className="text-right w-24">Orçado</TableHead>
                                <TableHead className="text-right w-24">Variação</TableHead>
                                <TableHead className="text-center w-20">Status</TableHead>
                                <TableHead className="text-center w-20">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageEntries.map((e) => (
                                <TableRow key={e.id}>
                                    <TableCell className="text-sm font-medium">{months[e.month - 1]}/{e.year}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{empName(Number(e.employeeId))}</span>
                                            <span className="text-xs text-gray-500">ID: {e.employeeId}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{e.function}</TableCell>
                                    <TableCell className="text-center text-sm">{e.overtime50}h</TableCell>
                                    <TableCell className="text-center text-sm">{e.overtime100}h</TableCell>
                                    <TableCell className="text-right text-sm">R$ {(e.dsrValue ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right text-sm">R$ {(e.additionalValue ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right text-sm font-medium">R$ {(e.totalValue ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right text-sm">R$ {(e.budgetedAmount ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</TableCell>
                                    <TableCell className="text-right">
                                        <div className={`text-sm font-medium ${getVarianceColor(Math.abs(e.variancePercentage ?? 0))}`}>
                                            {e.variance! >= 0 ? "+" : ""}R$ {(e.variance ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            <div className="text-xs">{(e.variancePercentage ?? 0) >= 0 ? "+" : ""}{(e.variancePercentage ?? 0).toFixed(1)}%</div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={e.status === "open" ? "default" : "secondary"} className="text-xs">
                                            {e.status === "open" ? "Aberto" : "Fechado"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-1">
                                            <Button variant="outline" size="sm" className="h-6 w-6 p-0" onClick={() => onEdit(e)}><Edit className="w-3 h-3" /></Button>
                                            <Button variant="outline" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-700" onClick={() => onDelete(Number(e.id!))}><Trash2 className="w-3 h-3" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""} />
                                </PaginationItem>
                                {Array.from({ length: totalPages }).map((_, i) => {
                                    const n = i + 1;
                                    return (
                                        <PaginationItem key={n}>
                                            <PaginationLink onClick={() => setCurrentPage(n)} isActive={currentPage === n} className="cursor-pointer">
                                                {n}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                                <PaginationItem>
                                    <PaginationNext onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""} />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {filtered.length === 0 && <div className="text-center py-8 text-gray-500">Nenhum lançamento encontrado.</div>}
            </CardContent>
        </Card>
    );
}