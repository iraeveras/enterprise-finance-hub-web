// FILE: src/app/(private)/employees/components/EmployeeTable.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationNext,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { Edit, Trash2 } from "lucide-react";

import type { Employee } from "../types";
import type { Company } from "@/app/(private)/companies/types";
import type { Department } from "@/app/(private)/departments/types";
import type { Sector } from "@/app/(private)/sectors/types";

type Props = {
    employees: Employee[];
    companies: Company[];
    departments: Department[];
    sectors: Sector[];
    onEdit: (emp: Employee) => void;
    onDelete: (id: string) => void;
    pageSize?: number;
};

export default function EmployeeTable({
    employees,
    companies,
    departments,
    sectors,
    onEdit,
    onDelete,
    pageSize = 10,
}: Props) {
    const [page, setPage] = React.useState(1);

    const total = employees.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    React.useEffect(() => {
        // Se a lista for filtrada e a página atual ficar inválida, volta para 1
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = employees.slice(start, end);

    const fmtCompany = (companyId: number | null) =>
        companyId == null ? "-" : (companies.find((c) => Number(c.id) === companyId)?.corporateName ?? "-");

    const fmtDept = (departmentId: number | null) =>
        departmentId == null ? "-" : (departments.find((d) => Number(d.id) === departmentId)?.name ?? "-");

    const fmtSector = (sectorId: number | null) =>
        sectorId == null ? "-" : (sectors.find((s) => Number(s.id) === sectorId)?.name ?? "-");

    const fmtMoney = (v: number) => `R$ ${Number(v ?? 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left">Mat.</TableHead>
                            <TableHead className="text-left">Nome</TableHead>
                            <TableHead className="text-left">Empresa</TableHead>
                            <TableHead className="text-left">Admissão</TableHead>
                            <TableHead className="text-left">Cargo</TableHead>
                            <TableHead className="text-right">Salário</TableHead>
                            <TableHead className="text-center">Perc.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-left">Depto.</TableHead>
                            <TableHead className="text-left">Setor</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-center">Ações</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pageItems.map((e) => {
                            const totalSalary = e.dangerPay ? e.salary * 1.3 : e.salary;

                            return (
                                <TableRow key={e.id} className="hover:bg-gray-50">
                                    <TableCell className="p-2 text-xs font-mono">{e.matricula}</TableCell>
                                    <TableCell className="p-2 text-xs font-medium">{e.name}</TableCell>
                                    <TableCell className="p-2 text-xs truncate">{fmtCompany(e.companyId)}</TableCell>
                                    <TableCell className="p-2 text-xs">
                                        {new Date(e.admission).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                                    </TableCell>
                                    <TableCell className="p-2 text-xs">{e.position}</TableCell>
                                    <TableCell className="p-2 text-xs text-right">{fmtMoney(e.salary)}</TableCell>
                                    <TableCell className="p-2 text-center">
                                        {e.dangerPay ? (
                                            <Badge variant="secondary" className="text-xs">30%</Badge>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="p-2 text-right text-sm font-medium">{fmtMoney(totalSalary)}</TableCell>
                                    <TableCell className="p-2 text-sm">{fmtDept(e.departmentId)}</TableCell>
                                    <TableCell className="p-2 text-sm">{fmtSector(e.sectorId)}</TableCell>
                                    <TableCell className="p-2 text-center">
                                        <Badge className={e.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                            {e.status === "active" ? "Ativo" : "Inativo"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="p-2 text-center space-x-2">
                                        <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onEdit(e)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onDelete(e.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {pageItems.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={12} className="text-center py-8 text-sm text-muted-foreground">
                                    Nenhum registro encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Paginação */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            className="cursor-pointer"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                        />
                    </PaginationItem>

                    {/* Links de páginas (simples) */}
                    {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        if (totalPages > 7) {
                            // compactar quando há muitas páginas
                            if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1) {
                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            className="cursor-pointer"
                                            isActive={pageNum === page}
                                            onClick={() => setPage(pageNum)}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }
                            if (pageNum === 2 && page > 3) {
                                return (
                                    <PaginationItem key="start-ellipsis">
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            if (pageNum === totalPages - 1 && page < totalPages - 2) {
                                return (
                                    <PaginationItem key="end-ellipsis">
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                );
                            }
                            return null;
                        }

                        // poucas páginas → mostrar todas
                        return (
                            <PaginationItem key={pageNum}>
                                <PaginationLink
                                    className="cursor-pointer"
                                    isActive={pageNum === page}
                                    onClick={() => setPage(pageNum)}
                                >
                                    {pageNum}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}

                    <PaginationItem>
                        <PaginationNext
                            className="cursor-pointer"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}