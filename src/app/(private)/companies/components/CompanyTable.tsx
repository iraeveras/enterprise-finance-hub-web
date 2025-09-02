// FILE: src/app/(private)/companies/components/CompanyTable.tsx
"use client"
import React from "react"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationPrevious,
    PaginationNext,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination"
import type { Company } from "../types"
import { formatCNPJ } from "@/lib/formatCnpj"

export interface CompanyTableProps {
    data: Company[]
    isLoading: boolean
    page: number
    pageCount: number
    onPageChange: (newPage: number) => void
    onEdit: (company: Company) => void
    onDelete: (id: string) => void
}

export function CompanyTable({
    data,
    isLoading,
    page,
    pageCount,
    onPageChange,
    onEdit,
    onDelete,
}: CompanyTableProps) {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Razão Social</TableHead>
                        <TableHead>Nome Fantasia</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Criado em</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading
                        ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">
                                    Carregando…
                                </TableCell>
                            </TableRow>
                        )
                        : data.map(company => (
                            <TableRow key={company.id}>
                                <TableCell className="py-1">{formatCNPJ(company.cnpj)}</TableCell>
                                <TableCell className="py-1">{company.corporateName}</TableCell>
                                <TableCell className="py-1">{company.tradeName}</TableCell>
                                <TableCell className="py-1">
                                    <span
                                        className={
                                            company.status === "active"
                                                ? "bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs"
                                                : "bg-red-100 text-red-800 px-2 py-0.5 rounded-full text-xs"
                                        }
                                    >
                                        {company.status === "active" ? "Ativo" : "Inativo"}
                                    </span>
                                </TableCell>
                                <TableCell className="py-1">
                                    {new Date(company.createdAt).toLocaleDateString("pt-BR")}
                                </TableCell>
                                <TableCell className="py-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(company)}
                                        className="cursor-pointer"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(company.id)}
                                        className="cursor-pointer"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>

            <div className="flex items-center justify-end mt-4">
                <Pagination>
                    <PaginationPrevious
                        onClick={() => onPageChange(page - 1)}
                        className={page <= 1 ? "opacity-50 cursor-not-allowed" : ""}
                        aria-disabled={page <= 1}
                    >
                        Anterior
                    </PaginationPrevious>
                    {[...Array(pageCount)].map((_, i) => {
                        const pageNumber = i + 1
                        const isCurrent = pageNumber === page
                        return (
                            <PaginationItem
                                key={i}
                                className={isCurrent ? "cursor-pointer list-none" : ""}
                            >
                                <PaginationLink
                                    onClick={() => onPageChange(pageNumber)}
                                    // para acessibilidade, informe qual é a página atual
                                    {...(isCurrent && { "aria-current": "page" })}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        )
                    })}
                    <PaginationNext
                        onClick={() => onPageChange(page + 1)}
                        className={page >= pageCount ? "opacity-50 cursor-not-allowed" : ""}
                        aria-disabled={page >= pageCount}
                    >
                        Próxima
                    </PaginationNext>
                </Pagination>
            </div>
        </>
    )
}