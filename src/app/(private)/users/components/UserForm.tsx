// FILE: src/app/(private)/users/components/UserForm.tsx
"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import type { Role, Company, User, CreateUserInput, UpdateUserInput } from "@/types";
import { MultiSelect } from "@/components/ui/multi-select";



interface UserFormProps {
    user?: User | null;
    roles: Role[];
    companies: Company[];
    onClose: () => void;
    onSave: (data: CreateUserInput | UpdateUserInput) => void;
}

export const UserForm: React.FC<UserFormProps> = ({
    user,
    roles,
    companies,
    onClose,
    onSave,
}) => {
    const [form, setForm] = useState<
    CreateUserInput & Partial<Pick<UpdateUserInput, "id">>
    >({
        id: user?.id,
        name: user?.name || "",
        email: user?.email || "",
        password: "",
        roleId: user ? Number(user.role.id) : roles[0] ? Number(roles[0].id) : 0,
        companyIds: user ? user.companies.map(c => Number(c.id)) : [],
        status: user?.status || "active",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ao editar, se password vazio, removemos
        const payload = { ...form } as any;
        if (user && !form.password) delete payload.password;
        onSave(payload);
    };

    // Prepara as opções pro MultiSelect:
    const companyOptions = companies.map((c) => ({
        value: c.id,
        label: c.tradeName,
    }));

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{user ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    {!user && (
                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({ ...form, password: e.target.value })
                                }
                                required
                            />
                        </div>
                    )}

                    <div>
                        <Label htmlFor="roleId">Role/Permissão</Label>
                        <Select
                            value={String(form.roleId)}
                            onValueChange={(v) => setForm({ ...form, roleId: Number(v) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o role" />
                            </SelectTrigger>
                            <SelectContent>
                                {roles.map((r) => (
                                    <SelectItem key={r.id} value={String(r.id)}>
                                        {r.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* MultiSelect de Empresas */}
                    <div>
                        <Label>Empresas Vinculadas</Label>
                        <MultiSelect
                            options={companyOptions}
                            defaultValue={form.companyIds.map(String)}
                            onValueChange={(vals) =>
                                setForm({ ...form, companyIds: vals.map((v) => Number(v)) })
                            }
                            placeholder="Selecione as empresas"
                            variant="default"
                            animation={0}
                            maxCount={5}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Selecione as empresas que este usuário pode acessar
                        </p>
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(v) =>
                                setForm({ ...form, status: v as "active" | "inactive" })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button className="cursor-pointer" variant="outline" type="button" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className="cursor-pointer" type="submit">{user ? "Atualizar" : "Cadastrar"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};