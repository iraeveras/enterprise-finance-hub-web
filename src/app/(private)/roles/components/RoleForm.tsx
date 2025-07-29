// FILE: src/app/(private)/roles/components/RoleForm.tsx
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
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role, RoleLevel, ModuleID, Action, Scope, FormData } from "@/types";

const modules: {id: ModuleID; name: string }[] = [
    { id: "companies", name: "Empresas" },
    { id: "employees", name: "Funcionários" },
    { id: "departments", name: "Departamentos" },
    { id: "sectors", name: "Setores" },
    { id: "teams", name: "Equipes" },
    { id: "costcenters", name: "Centros de Custo" },
    { id: "budget", name: "Orçamento" },
    { id: "reports", name: "Relatórios" },
    { id: "schedule", name: "Escalas" },
    { id: "users", name: "Usuários" },
];

const actions: { id: Action; name: string }[] = [
    { id: "read", name: "Visualizar" },
    { id: "write", name: "Criar/Editar" },
    { id: "delete", name: "Excluir" },
    { id: "export", name: "Exportar" },
];

interface RoleFormProps {
    role?: Role | null;
    onClose: () => void;
    onSave: (data: FormData) => void;
}

export function RoleForm({ role, onClose, onSave }: RoleFormProps) {
    const [formData, setFormData] = useState<FormData>({
        name: role?.name || "",
        level: (role?.level as RoleLevel) || "supervisor",
        description: role?.description || "",
        permissions:
            role?.permissions.map((p) => ({
                module: p.module as ModuleID,
                actions: [...p.actions] as Action[],
                scope: p.scope as Scope,
            })) || [],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave(formData);
    }

    function handlePermissionChange(
        moduleId: ModuleID,
        action: Action,
        scope: Scope,
        checked: boolean
    ) {
        setFormData((prev) => {
            const perms = [...prev.permissions];
            const idx = perms.findIndex((p) => p.module === moduleId);

            if (idx >= 0) {
                if (checked) {
                    if (!perms[idx].actions.includes(action)) {
                        perms[idx].actions.push(action);
                    }
                } else {
                    perms[idx].actions = perms[idx].actions.filter(
                        (a) => a !== action
                    );
                }
                if (perms[idx].actions.length === 0) {
                    perms.splice(idx, 1);
                }
            } else if (checked) {
                perms.push({ module: moduleId, actions: [action], scope });
            }

            return { ...prev, permissions: perms };
        });
    }

    function isPermissionChecked(moduleId: ModuleID, action: Action) {
        const p = formData.permissions.find((p) => p.module === moduleId);
        return p ? p.actions.includes(action) : false;
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-sm md:max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{role ? "Editar Role" : "Novo Role"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Nome do Role</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((f) => ({ ...f, name: e.target.value }))
                                }
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="level">Nível Hierárquico</Label>
                            <Select
                                value={formData.level}
                                onValueChange={(value) => 
                                    setFormData((f) => ({
                                        ...f,
                                        level: value as RoleLevel
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Administrador</SelectItem>
                                    <SelectItem value="manager">Gerente</SelectItem>
                                    <SelectItem value="coordinator">Coordenador</SelectItem>
                                    <SelectItem value="supervisor">Supervisor</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((f) => ({ ...f, description: e.target.value }))
                            }
                            placeholder="Descreva as responsabilidades deste role"
                            required
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Permissões por Módulo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {modules.map((mod) => (
                                    <div key={mod.id} className="border rounded-lg p-4">
                                        <h4 className="font-medium mb-3">{mod.name}</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {actions.map((act) => (
                                                <div
                                                    key={act.id}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <Checkbox
                                                        id={`${mod.id}-${act.id}`}
                                                        checked={isPermissionChecked(mod.id, act.id)}
                                                        onCheckedChange={(checked) =>
                                                            handlePermissionChange(
                                                                mod.id,
                                                                act.id,
                                                                "company",
                                                                Boolean(checked)
                                                            )
                                                        }
                                                    />
                                                    <Label
                                                        htmlFor={`${mod.id}-${act.id}`}
                                                        className="text-sm"
                                                    >
                                                        {act.name}
                                                    </Label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className="cursor-pointer" type="submit">{role ? "Atualizar" : "Cadastrar"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}