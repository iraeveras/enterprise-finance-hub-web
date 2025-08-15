// FILE: src/app/(private)/companies/components/DepartmentTable.tsx
"use client"
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Pagination,
    PaginationPrevious,
    PaginationNext,
    PaginationItem,
    PaginationLink,
    PaginationContent,
} from "@/components/ui/pagination";
import { useCompanies } from "../../companies/hooks/useCompanies";
import type { Department } from "../types";
import type { Company } from "@/app/(private)/companies/types";

export interface DepartmentTableProps {
    departments: Department[];
    companyName: (companyId: number) => string;
    isLoading: boolean;
    onEdit: (department: Department) => void;
    onDelete: (id: string) => void;
}

export function DepartmentTable({
    departments,
    companyName,
    isLoading,
    onEdit,
    onDelete,
}: DepartmentTableProps) {
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const companiesQ = useCompanies();
    const companies = companiesQ.data ?? [];

    const filtered = useMemo(() => {
        return departments.filter((d) => {
            const matchesName = companyName(d.companyId).toLowerCase().includes(search.toLowerCase());
            // const matchesStatus = status === "all" || d.status === status;
            return matchesName;
        });
    }, [departments, search, companyName]);

    const total = filtered.length;
    const pageCount = Math.max(1, Math.ceil(total / pageSize));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);


    const fmtCompany = (companyId: number | null) =>
        companyId == null ? "-" : (companies.find((company) => Number(company.id) === companyId)?.corporateName ?? "-");

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                Carregando...
                            </TableCell>
                        </TableRow>
                    ) : items.map(department => (
                        <TableRow key={department.id}>
                            <TableCell className="py-1">{department.name}</TableCell>
                            <TableCell className="py-1">{fmtCompany(department.companyId)}</TableCell>
                            <TableCell className="py-1">
                                <Badge className={department.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {department.status === "active" ? "Ativo" : "Inativo"}
                                </Badge>

                            </TableCell>
                            <TableCell className="py-1">
                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onEdit(department)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onDelete(department.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
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
    )
}