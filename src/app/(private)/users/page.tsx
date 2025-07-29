"use client";
// FILE: src/app/(private)/users/page.tsx

import React, { useState, ChangeEvent } from "react";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { UserForm } from "./components/UserForm";
import { useUsers } from "./hooks/useUsers";
import { useUserCreate } from "./hooks/useUserCreate";
import { useUserUpdate } from "./hooks/useUserUpdate";
import { useUserDelete } from "./hooks/useUserDelete";
import { useRoles } from "../roles/hooks/useRoles";
import { useCompanies } from "../companies/hooks/useCompanies";
import type { User, Role, Company, CreateUserInput, FormDataUser, UpdateUserInput } from "@/types";
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Download, Filter, UserCheck } from "lucide-react";



export default function UserManager() {
    const usersQuery = useUsers();
    const rolesQuery = useRoles();
    const companiesQuery = useCompanies();
    const createUser = useUserCreate();
    const updateUser = useUserUpdate();
    const deleteUser = useUserDelete();



    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [search, setSearch] = useState("");

    if (usersQuery.isLoading || rolesQuery.isLoading || companiesQuery.isLoading) {
    return <p>Carregando...</p>;
    }
    if (usersQuery.error || rolesQuery.error || companiesQuery.error) {
        return <p>Erro ao carregar dados</p>;
    }

    const users = usersQuery.data!;
    const roles = rolesQuery.data!;
    const companies = companiesQuery.data!;

    
    const filtered = users.filter((u) =>
        [u.name, u.email, u.role.name]
            .some((f) => f.toLowerCase().includes(search.toLowerCase()))
    );

    const onSave = (data: CreateUserInput | UpdateUserInput) => {
        if (selectedUser && selectedUser.id) {
            updateUser.mutate({ id: selectedUser.id, ...data } as UpdateUserInput);
        } else {
            createUser.mutate(data as CreateUserInput);
        }
        setShowForm(false);
        setSelectedUser(null);
    };

    return (
        <ProtectedPage>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Usuários</h1>
                        <p className="text-gray-600">Gerencie seus usuários</p>
                    </div>
                    <Button
                        className="cursor-pointer"
                        onClick={() => { setSelectedUser(null); setShowForm(true) }}
                        disabled={createUser.isPending}
                    >
                        <Plus className="w-4 h-4 mr-2" /> Novo Usuário
                    </Button>
                </div>

                {/* Busca */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    placeholder="Busca por nome, e-mail ou role…"
                                    className="pl-10"
                                    value={search}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                />
                            </div>
                            <Button variant="outline" disabled><Filter/> Filtros</Button>
                            <Button variant="outline" disabled><Download/> Exportar</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabela */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <UserCheck className="w-5 h-5 mr-2"/> Total: {filtered.length}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b">
                                        <th className="p-3 text-left">Nome</th>
                                        <th className="p-3 text-left">E-mail</th>
                                        <th className="p-3 text-left">Role</th>
                                        <th className="p-3 text-left">Empresas</th>
                                        <th className="p-3 text-center">Status</th>
                                        <th className="p-3 text-left">Último Acesso</th>
                                        <th className="p-3 text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((u) => (
                                        <tr key={u.id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{u.name}</td>
                                            <td className="p-3">{u.email}</td>
                                            <td className="p-3">
                                                <Badge>{u.role.name}</Badge>
                                            </td>
                                            <td className="p-3">
                                                {u.companies.map((c) => c.tradeName).join(", ")}
                                            </td>
                                            <td className="p-3 text-center">
                                                <Badge variant={u.status==="active"?"default":"secondary"}>
                                                    {u.status==="active"?"Ativo":"Inativo"}
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                {u.lastLogin
                                                    ? new Date(u.lastLogin).toLocaleDateString("pt-BR")
                                                    : "—"}
                                            </td>
                                            <td className="p-3 text-center">
                                                <Button
                                                    className="cursor-pointer"
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setShowForm(true);
                                                    }}
                                                >
                                                    Editar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {showForm && (
                <UserForm
                    user={selectedUser}
                    roles={roles}
                    companies={companies}
                    onClose={() => setShowForm(false)}
                    onSave={onSave}
                />
            )}
        </ProtectedPage>
    );
}