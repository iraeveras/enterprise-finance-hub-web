// FILE: src/app/(private)/companies/components/CostCenterTable.tsx
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
import { useDepartments } from "../../departments/hooks/useDepartments";
import { useSectors } from "../../sectors/hooks/useSectors";
import type { CostCenter } from "../types";

export interface CostCenterTableProps {
    costcenters: CostCenter[];
    companyName: (companyId: number) => string;
    departmentName: (departmentId: number) => string;
    sectorName: (sectorId: number) => string;
    isLoading: boolean;
    onEdit: (costcenter: CostCenter) => void;
    onDelete: (id: string) => void;
}

export function CostCenterTable({
    costcenters,
    companyName,
    departmentName,
    sectorName,
    isLoading,
    onEdit,
    onDelete,
}: CostCenterTableProps) {

        const [search, setSearch] = useState("");
    
        const [page, setPage] = useState(1);
        const pageSize = 10;
    
        const companiesQ = useCompanies();
        const companies = companiesQ.data ?? [];
    
        const departmentsQ = useDepartments();
        const departments = departmentsQ.data ?? [];

        const sectorsQ = useSectors();
        const sectors = sectorsQ.data ?? [];

        const filtered = useMemo(() => {
                return costcenters.filter((cc) => {
                    const matchesCompanyName = companyName(cc.companyId).toLowerCase().includes(search.toLowerCase());
                    const matchesDepartmentName = departmentName(cc.departmentId).toLowerCase().includes(search.toLowerCase());
                    const matchesSectorName = sectorName(cc.sectorId).toLowerCase().includes(search.toLowerCase());
                    
                    return matchesCompanyName && matchesDepartmentName && matchesSectorName;
                });
            }, [sectors, search, companyName, departmentName, sectorName]);
        
            const total = filtered.length;
            const pageCount = Math.max(1, Math.ceil(total / pageSize));
            const start = (page - 1) * pageSize;
            const items = filtered.slice(start, start + pageSize);
        
            const fmtCompany = (companyId: number | null) =>
                companyId == null ? "-" : (companies.find((company) => Number(company.id) === companyId)?.corporateName ?? "-");
        
            const fmtDepartment = (departmentId: number | null) =>
                departmentId == null ? "-" : (departments.find((department) => Number(department.id) === departmentId)?.name ?? "-");

            const fmtSector = (sectorId: number | null) =>
                sectorId == null ? "-" : (sectors.find((sector) => Number(sector.id) === sectorId)?.name ?? "-");
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead>Setor</TableHead>
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
                    ) : items.map(costcenter => (
                        <TableRow key={costcenter.id}>
                            <TableCell className="py-1">{costcenter.code}</TableCell>
                            <TableCell className="py-1">{costcenter.name}</TableCell>
                            <TableCell className="py-1">{fmtCompany(costcenter.companyId)}</TableCell>
                            <TableCell className="py-1">{fmtDepartment(costcenter.departmentId)}</TableCell>
                            <TableCell className="py-1">{fmtSector(costcenter.sectorId)}</TableCell>
                            <TableCell className="py-1">
                                <Badge className={costcenter.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                    {costcenter.status === "active" ? "Ativo" : "Inativo"}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-1">
                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onEdit(costcenter)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onDelete(costcenter.id)}>
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