// FILE: src/app/(private)/roles/page.tsx
"use client";

import React, { useState, ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Filter, Shield, Trash2, Edit } from "lucide-react";
import { RoleForm } from "./components/RoleForm";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import type { Role, RoleLevel, FormDataRole } from "./types";
import { useRoles } from "./hooks/useRoles";
import { useRoleCreate } from "./hooks/useRoleCreate";
import { useRoleUpdate } from "./hooks/useRoleUpdate";
import { useRoleDelete } from "./hooks/useRoleDelete";

export default function RoleManager() {
    const rolesQuery = useRoles();
    const createMutation = useRoleCreate();
    const updateMutation = useRoleUpdate();
    const deleteMutation = useRoleDelete();

    const [showForm, setShowForm] = useState(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const roles: Role[] = rolesQuery.data ?? [];

    const filtered: Role[] = roles.filter((role: Role) =>
        [role.name, role.description].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Mapas para facilitar label + classes
    const levelLabels: Record<RoleLevel, string> = {
        admin: "Administrador",
        manager: "Gerente",
        coordinator: "Coordenador",
        supervisor: "Supervisor",
    };
    const levelClasses: Record<RoleLevel, string> = {
        admin: "bg-red-100 text-red-800",
        manager: "bg-blue-100 text-blue-800",
        coordinator: "bg-green-100 text-green-800",
        supervisor: "bg-yellow-100 text-yellow-800",
    };

    const openNew = () => {
        setSelectedRole(null);
        setShowForm(true);
    };

    const openEdit = (role: Role) => {
        setSelectedRole(role);
        setShowForm(true);
    };

    const onSave = (data: FormDataRole) => {
        if (selectedRole) {
            updateMutation.mutate({ id: selectedRole.id, ...data });
        } else {
            createMutation.mutate(data);
        }
        setShowForm(false);
    };

    const onDelete = (id: string) => {
        if (confirm("Deseja realmente excuir este registro?")) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <ProtectedPage>
            <div className="space-y-6">
                {/* Cabeçalho */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Roles/Permissões</h1>
                        <p className="text-gray-600">
                            Gestão de perfis de acesso e permissões do sistema
                        </p>
                    </div>
                    <Button className="cursor-pointer" onClick={openNew} disabled={createMutation.status === "pending"}>
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Role
                    </Button>
                </div>

                {/* Filtros e Busca */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    placeholder="Buscar por nome ou descrição..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-10"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" disabled>
                                    <Filter className="w-4 h-4 mr-2" />
                                    Filtros
                                </Button>
                                <Button variant="outline" disabled>
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportar
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lista de Roles */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Shield className="w-5 h-5 mr-2" />
                            Roles Cadastrados ({filtered.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {rolesQuery.status === "pending" ? (
                            <p>Carregando...</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-gray-50">
                                            <th className="text-left p-3 font-medium">Nome</th>
                                            <th className="text-left p-3 font-medium">Nível</th>
                                            <th className="text-left p-3 font-medium">Descrição</th>
                                            <th className="text-center p-3 font-medium">Permissões</th>
                                            <th className="text-center p-3 font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.map((role) => (
                                            <tr key={role.id} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium">{role.name}</td>
                                                <td className="p-3">
                                                    <Badge className={levelClasses[role.level]}>
                                                        {levelLabels[role.level]}
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-sm">{role.description}</td>
                                                <td className="p-3 text-center">
                                                    <Badge variant="outline">
                                                        {role.permissions.length} módulos
                                                    </Badge>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <Button
                                                        className="cursor-pointer"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => { openEdit(role) }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button className="cursor-pointer" size="sm" variant="ghost" onClick={() => onDelete(role.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </CardContent>
                </Card>

                {/* Modal de Cadastro/Edição */}
                {showForm && (
                    <RoleForm
                        role={selectedRole}
                        onClose={() => setShowForm(false)}
                        onSave={onSave}
                    />
                )}
            </div>
        </ProtectedPage>
    );
}