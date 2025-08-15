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

import EmployeeTable from "./components/EmployeeTable";

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
                <Card className="rounded-none">
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
                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Funcionários Cadastrados ({filtered.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmployeeTable
                            employees={filtered}
                            companies={companies}
                            departments={departments}
                            sectors={sectors}
                            onEdit={openEdit}
                            onDelete={onDelete}
                            pageSize={10}
                        />
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