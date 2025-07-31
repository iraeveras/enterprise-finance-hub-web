// src/app/(private)/sectors/components/SectorForm.tsx
"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Sector, CreateSectorInput, UpdateSectorInput } from "../types";

interface SectorFormProps {
    sector?: Sector | null;
    companies: {id: string; corporateName: string}[];
    departments: {id: string; name: string}[];
    onClose: () => void;
    onSave: (data: CreateSectorInput | UpdateSectorInput) => void;
}

export function SectorForm({ sector, companies, departments, onClose, onSave }: SectorFormProps) {
    const [formData, setFormData] = useState({
        id: sector?.id,
        name: sector?.name || "",
        companyId: sector ? Number(sector?.companyId) : companies[0] ? Number(companies[0]?.id) : 0,
        departmentId: sector ? Number(sector?.departmentId) : departments[0] ? Number(departments[0]?.id) : 0,
        status: sector?.status || "active",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            companyId: Number(formData.companyId),
            departmentId: Number(formData.departmentId)
        };

        onSave(payload as any);
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {sector ? "Editar Setor" : "Novo Setor"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="companyId">Empresa</Label>
                        <Select value={String(formData.companyId)} onValueChange={(value) => setFormData({ ...formData, companyId: Number(value) })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((company) => (
                                    <SelectItem key={company.id} value={String(company.id)}>
                                        {company.corporateName}
                                    </SelectItem>
                                ))}                                
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="departmentId">Departamento</Label>
                        <Select value={String(formData.departmentId)} onValueChange={(value) => setFormData({ ...formData, departmentId: Number(value) })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o departamento" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((department) => (
                                    <SelectItem key={department.id} value={String(department.id)}>
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="name">Nome do Setor</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData((form) => ({ ...form, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}>
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
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button className="cursor-pointer" type="submit">
                            {sector ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};