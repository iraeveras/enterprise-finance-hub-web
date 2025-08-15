// src/app/(private)/departments/page.tsx
"use client";

import React, { useState, ChangeEvent } from "react";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { DepartmentForm } from "./components/DepartmentForm";
import { useDepartments } from "./hooks/useDepartments";
import { useDepartmentCreate } from "./hooks/useDepartmentCreate";
import { useDepartmentUpdate } from "./hooks/useDepartmentUpdate";
import { useDepartmentDelete } from "./hooks/useDepartmentDelete";
import { useCompanies } from "../companies/hooks/useCompanies";
import { DepartmentTable } from "./components/DepartmentTable";
import { companyName as getCompaniesName } from "@/lib/companies-utils";
import type { CreateDepartmentInput, Department, UpdateDepartmentInput } from "./types";
import {
    Card, CardHeader, CardTitle, CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search, Download, Filter } from "lucide-react";

export default function DepartmentManager() {
    const deptQ = useDepartments();
    const compQ = useCompanies();
    const createDept = useDepartmentCreate();
    const updateDept = useDepartmentUpdate();
    const deleteDept = useDepartmentDelete();

    const [showForm, setShowForm] = useState(false);
    const [selected, setSelected] = useState<Department | null>(null);
    const [search, setSearch] = useState("");

    const companyName = (id: number) => getCompaniesName(compQ.data ?? [], id);

    if (deptQ.isLoading || compQ.isLoading) return <p>Carregando...</p>;
    if (deptQ.error || compQ.error) return <p>Erro ao carregar dados</p>;

    const departments = deptQ.data!;
    const companies = compQ.data!;
    const filtered = departments.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    const openNew = () => {
        setSelected(null);
        setShowForm(true);
    };
    const openEdit = (d: Department) => {
        setSelected(d);
        setShowForm(true);
    };

    const onSave = (data: CreateDepartmentInput | UpdateDepartmentInput) => {
        if (selected && selected.id) {
            updateDept.mutate({ id: selected.id, ...data } as UpdateDepartmentInput)
        } else {
            createDept.mutate(data as CreateDepartmentInput);
        }
        setShowForm(false);
    };
    const onDelete = (id: string) => {
        if (confirm("Deseja realmente excluir este departamento?")) {
            deleteDept.mutate(id);
        }
    };

    return (
        <ProtectedPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Departamentos</h1>
                        <p className="text-gray-600">Gestão de departamentos por empresa</p>
                    </div>
                    <Button className="cursor-pointer" onClick={openNew} disabled={createDept.status === "pending"}>
                        <Plus className="w-4 h-4 mr-2" /> Novo Departamento
                    </Button>
                </div>

                {/* Busca */}
                <Card className="rounded-none">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar departamentos..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button className="cursor-pointer" variant="outline" disabled><Filter /> Filtros</Button>
                            <Button className="cursor-pointer" variant="outline" disabled><Download /> Exportar</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>Departamentos ({filtered.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <DepartmentTable
                                departments={departments}
                                companyName={companyName}
                                isLoading={deptQ.isLoading}
                                onEdit={openEdit}
                                onDelete={onDelete}
                            />
                            {/* <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="p-3 text-left">Nome</th>
                                        <th className="p-3 text-left">Empresa</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((d) => (
                                        <tr key={d.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{d.name}</td>
                                            <td className="p-3">
                                                {companies.find((c) => Number(c.id) === d.companyId)?.corporateName}
                                            </td>
                                            <td className="p-3 text-center">
                                                <Badge
                                                    className={d.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                                                >
                                                    {d.status === "active" ? "Ativo" : "Inativo"}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-center space-x-2">
                                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => openEdit(d)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onDelete(d.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}
                        </div>
                    </CardContent>
                </Card>

                {/* Modal */}
                {showForm && (
                    <DepartmentForm
                        department={selected}
                        companies={companies.map((c) => ({ id: c.id, corporateName: c.corporateName }))}
                        onClose={() => setShowForm(false)}
                        onSave={onSave}
                    />
                )}
            </div>
        </ProtectedPage>
    );
}