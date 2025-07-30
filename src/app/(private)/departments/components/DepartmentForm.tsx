// src/app/(private)/departments/components/DepartmentForm.tsx
"use client";

import React, { useState } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import type {
    Department, CreateDepartmentInput, UpdateDepartmentInput,
} from "@/types";

interface Props {
    department?: Department | null;
    companies: { id: string; corporateName: string }[];
    onClose: () => void;
    onSave: (data: CreateDepartmentInput | UpdateDepartmentInput) => void;
}

export function DepartmentForm({ department, companies, onClose, onSave }: Props) {
    const [form, setForm] = useState<Partial<Department> & CreateDepartmentInput>({
        id: department?.id,
        name: department?.name || "",
        companyId: department ? Number(department?.companyId) : companies[0] ? Number(companies[0]?.id) : 0,
        status: department?.status || "active",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form,
            companyId: Number(form.companyId),
        }
        onSave(payload as any);
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{department ? "Editar Departamento" : "Novo Departamento"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Empresa */}
                    <div>
                        <Label htmlFor="companyId">Empresa</Label>
                        <Select
                            value={String(form.companyId)}
                            onValueChange={(v) => setForm({ ...form, companyId: Number(v) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.corporateName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nome */}
                    <div>
                        <Label htmlFor="name">Nome do Departamento</Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            required
                        />
                    </div>

                {/* Status */}
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(v) => 
                                setForm((f) => ({ ...f, status: v as "active" | "inactive" }))}
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

                {/* Botões */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button className="cursor-pointer" variant="outline" type="button" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className="cursor-pointer" type="submit">
                            {department ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}