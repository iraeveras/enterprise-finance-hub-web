// FILE: src/app/(private)/employees/page.tsx
"use client";

import React, { useState, ChangeEvent } from "react";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Filter, Edit, Trash2 } from "lucide-react";

import { EmployeeForm } from "./components/EmployeeForm";
import { useEmployees } from "./hooks/useEmployees";
import { useEmployeeCreate } from "./hooks/useEmployeeCreate";
import { useEmployeeUpdate } from "./hooks/useEmployeeUpdate";
import { useEmployeeDelete } from "./hooks/useEmployeeDelete";

import { useCompanies } from "../companies/hooks/useCompanies";
import { useDepartments } from "../departments/hooks/useDepartments";
import { useSectors } from "../sectors/hooks/useSectors";
import { useCostCenters } from "../costcenters/hooks/useCostCenters";
import { useTeams } from "../teams/hooks/useTeams";

import type {
    Employee,
    CreateEmployeeInput,
    UpdateEmployeeInput,
} from "./types";

export default function EmployeeManager() {
    const empQ = useEmployees();
    const create = useEmployeeCreate();
    const update = useEmployeeUpdate();
    const del = useEmployeeDelete();

    const compQ = useCompanies();
    const deptQ = useDepartments();
    const sectQ = useSectors();
    const ccQ = useCostCenters();
    const teamQ = useTeams();

    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<Employee | null>(null);
    const [search, setSearch] = useState("");

    if (
        empQ.isLoading ||
        compQ.isLoading ||
        deptQ.isLoading ||
        sectQ.isLoading ||
        ccQ.isLoading ||
        teamQ.isLoading
    ) {
        return <p>Carregando...</p>;
    }
    if (
        empQ.error ||
        compQ.error ||
        deptQ.error ||
        sectQ.error ||
        ccQ.error ||
        teamQ.error
    ) {
        return <p>Erro ao carregar dados</p>;
    }

    const employees = empQ.data!;
    const companies = compQ.data!;
    const departments = deptQ.data!;
    const sectors = sectQ.data!;
    const costCenters = ccQ.data!;
    const teams = teamQ.data!;

    const filtered = employees.filter((e) =>
            [e.name, e.matricula, e.position]
            .some((f) => f.toLowerCase().includes(search.toLowerCase()))
    );

    const onSave = (data: CreateEmployeeInput | UpdateEmployeeInput) => {
        const formatedData = {
            ...data,
            teams: Array.isArray(data.teams) ? data.teams : []
        }
        if (selected && selected.id) {
            update.mutate({ id: selected.id, ...formatedData } as UpdateEmployeeInput);
        } else {
            create.mutate(formatedData);
        }
        setShowForm(false);
        setSelected(null);
    };

    const openEdit = (employee: Employee) => {
        setSelected(employee);
        setShowForm(true);
    }
    const onDelete = (id: string) => {
        if (confirm("Deseja realmente excluir este funcionário?")) {
            del.mutate(id);
        }
    };

    return (
        <ProtectedPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Funcionários</h1>
                        <p className="text-gray-600">Gerencie seus funcionários</p>
                    </div>
                    <Button
                        className="cursor-pointer"
                        onClick={() => {
                            setSelected(null);
                            setShowForm(true);
                        }}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Novo Funcionário
                    </Button>
                </div>

                {/* Busca */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por nome, matrícula, cargo…"
                                    className="pl-10"
                                    value={search}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setSearch(e.target.value)
                                    }
                                />
                            </div>
                            <Button variant="outline" disabled>
                                <Filter className="w-4 h-4 mr-2" /> Filtros
                            </Button>
                            <Button variant="outline" disabled>
                                <Download className="w-4 h-4 mr-2" /> Exportar
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card>
                    <CardHeader>
                        <CardTitle>Funcionários Cadastrados ({filtered.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="p-3 text-sm font-semibold text-left">Mat.</th>
                                        <th className="p-3 text-sm font-semibold text-left">Nome</th>
                                        <th className="p-3 text-sm font-semibold text-left">Empresa</th>
                                        <th className="p-3 text-sm font-semibold text-left">Admissão</th>
                                        <th className="p-3 text-sm font-semibold text-left">Cargo</th>
                                        <th className="p-3 text-sm font-semibold text-right">Salário</th>
                                        <th className="p-3 text-sm font-semibold text-center">Perc.</th>
                                        <th className="p-3 text-sm font-semibold text-right">Total</th>
                                        <th className="p-3 text-sm font-semibold text-left">Depto.</th>
                                        <th className="p-3 text-sm font-semibold text-left">Setor</th>
                                        <th className="p-3 text-sm font-semibold text-center">Status</th>
                                        <th className="p-3 text-sm font-semibold text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((e) => (
                                        <tr key={e.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2 text-xs font-mono">{e.matricula}</td>
                                            <td className="p-2 text-xs font-medium">{e.name}</td>
                                            <td className="p-2 text-xs truncate">{ companies.find((c) => Number(c.id) === e.companyId)?.corporateName }</td>
                                            <td className="p-2 text-xs">{new Date(e.admission).toLocaleDateString('pt-BR', { timeZone: 'UTC'})}</td>
                                            <td className="p-2 text-xs">{e.position}</td>
                                            <td className="p-2 text-xs text-right">
                                                R$ {e.salary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-2 text-center">
                                                {e.dangerPay ? (
                                                    <Badge variant="secondary" className="text-xs">
                                                        30%
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="p-2 text-right text-sm font-medium">
                                                R$
                                                {(
                                                e.dangerPay ? e.salary * 1.3 : e.salary
                                                ).toLocaleString("pt-BR", {
                                                    minimumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="p-2 text-sm">{ departments.find((d) => Number(d.id) === e.departmentId)?.name }</td>
                                            <td className="p-2 text-sm">{ sectors.find((s) => Number(s.id) === e.sectorId)?.name }</td>
                                            <td className="p-2 text-center">
                                                <Badge 
                                                    className={e.status==="active"?"bg-green-100 text-green-800":"bg-red-100 text-red-800"}
                                                >
                                                    {e.status === "active" ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </td>
                                            <td className="p-2 text-center space-x-2">
                                                <Button
                                                    className="cursor-pointer"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => openEdit(e)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    className="cursor-pointer"
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => onDelete(e.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {showForm && (
                    <EmployeeForm
                        employee={selected}
                        companies={companies}
                        departments={departments}
                        sectors={sectors}
                        costCenters={costCenters}
                        teams={teams}
                        onClose={() => setShowForm(false)}
                        onSave={onSave}
                    />
                )}
            </div>
        </ProtectedPage>
    );
}