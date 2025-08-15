// FILE: src/app/(private)/companies/components/TeamTable.tsx
"use client"
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, UsersIcon } from "lucide-react";
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
import { useSectors } from "../../sectors/hooks/useSectors";
import { useUsers } from "../../users/hooks/useUsers";
import type { Team } from "../types";

export interface TeamTableProps {
    teams: Team[];
    companyName: (companyId: number) => string;
    sectorName: (sectorId: number) => string;
    userName: (leaderId?: number | null) => string;
    isLoading: boolean;
    onEdit: (team: Team) => void;
    onDelete: (id: string) => void;
}

export function TeamTable({
    teams,
    companyName,
    sectorName,
    userName,
    isLoading,
    onEdit,
    onDelete,
}: TeamTableProps) {

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const companiesQ = useCompanies();
    const companies = companiesQ.data ?? [];

    const sectorsQ = useSectors();
    const sectors = sectorsQ.data ?? [];

    const usersQ = useUsers();
    const users = usersQ.data ?? [];

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return teams.filter((team) => {
            const matchesCompanyName = (companyName(team.companyId) ?? "").toLowerCase().includes(q);
            const matchesSectorName = (sectorName(team.sectorId) ?? "").toLowerCase().includes(q);
            const matchesUserName = (userName(team.leaderId) ?? "").toLowerCase().includes(q);
            
            return matchesCompanyName && matchesUserName && matchesSectorName;
        });
    }, [teams, search, companyName, userName, sectorName]);

    const total = filtered.length;
            const pageCount = Math.max(1, Math.ceil(total / pageSize));
            const start = (page - 1) * pageSize;
            const items = filtered.slice(start, start + pageSize);
        
            const fmtCompany = (companyId: number | null) =>
                companyId == null ? "-" : (companies.find((company) => Number(company.id) === companyId)?.corporateName ?? "-");

            const fmtSector = (sectorId: number | null) =>
                sectorId == null ? "-" : (sectors.find((sector) => Number(sector.id) === sectorId)?.name ?? "-");
            
            const fmtUser = (leaderId?: number | null) =>
                leaderId == null ? "-" : (users.find((user) => Number(user.id) === leaderId)?.name ?? "-");

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Setor</TableHead>
                        <TableHead>Lider</TableHead>
                        <TableHead>Membros</TableHead>
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
                    ) : items.map(team => (
                        <TableRow key={team.id}>
                            <TableCell className="py-1">{team.name}</TableCell>
                            <TableCell className="py-1">{fmtCompany(team.companyId)}</TableCell>
                            <TableCell className="py-1">{fmtSector(team.sectorId)}</TableCell>
                            <TableCell className="py-1">{fmtUser(team.leaderId)}</TableCell>
                            <TableCell className="py-1">
                                <div className="flex items-center justify-center">
                                    <UsersIcon className="w-4 h-4 mr-1"/> 
                                    {team.members?.length ?? "-"}
                                </div>
                            </TableCell>
                            <TableCell className="py-1">
                                <Badge 
                                    className={team.status==="active"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}
                                >
                                    {team.status==="active"?"Ativo":"Inativo"}
                                </Badge>
                            </TableCell>
                            <TableCell className="py-1">
                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onEdit(team)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onDelete(team.id)}>
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