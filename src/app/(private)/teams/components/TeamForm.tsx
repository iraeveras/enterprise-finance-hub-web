// File: src/app/(private)/teams/components/TeamForm.tsx
"use client"

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { Team, CreateTeamInput, UpdateTeamInput } from "../types";

interface TeamFormProps {
    team?: Team | null
    companies: { id: string; corporateName: string }[]
    sectors: { id: string; name: string }[]
    users: { id: string; name: string }[]
    onClose: () => void
    onSave: (data: {
        id?: string;
        name: string;
        companyId: number;
        sectorId: number;
        leaderId?: number;
        status: "active" | "inactive";
    }) => void;
}

export function TeamForm({ team, companies, sectors, users, onClose, onSave }: TeamFormProps) {
    const [form, setForm] = useState({
        id: team?.id,
        name: team?.name || "",
        companyId: team && team.companyId ? Number(team?.companyId) : null,
        sectorId: team && team.sectorId ? Number(team?.sectorId) : null,
        leaderId: team && team.leaderId ? Number(team.leaderId) : null,
        status: team?.status || "active",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            ...form,
            companyId: String(form.companyId) === "null" || form.companyId === null ? null : Number(form.companyId),
            sectorId: String(form.sectorId) === "null" || form.sectorId === null ? null : Number(form.sectorId),
            leaderId: String(form.leaderId) === "null" || form.leaderId === null ? null : Number(form.leaderId)
        }
        onSave(payload as any)
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{team ? "Editar Equipe" : "Nova Equipe"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                {/* Empresa */}
                    <div>
                        <Label htmlFor="company">Empresa</Label>
                        <Select
                            value={String(form.companyId)}
                            onValueChange={(value) => setForm({ ...form, companyId: Number(value) })}
                        >
                            <SelectTrigger><SelectValue placeholder="Selecione a empresa" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">— Selecionar empresa —</SelectItem>
                                {companies.map(company => (
                                    <SelectItem key={company.id} value={String(company.id)}>{company.corporateName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Setor */}
                    <div>
                        <Label htmlFor="sector">Setor</Label>
                        <Select
                            value={form.sectorId !== null ? String(form.sectorId) : "null"}
                            onValueChange={(value) => setForm({ ...form, sectorId: value === "null" ? null : Number(value) })}
                        >
                            <SelectTrigger><SelectValue placeholder="Selecione o setor" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">— Selecionar setor —</SelectItem>
                                {sectors.map((sector) => (
                                    <SelectItem key={sector.id} value={String(sector.id)}>{sector.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Nome da Equipe */}
                    <div>
                        <Label htmlFor="name">Nome da Equipe</Label>
                        <Input
                            id="name"
                            value={form.name}
                            placeholder="Nome da equipe"
                            onChange={e => setForm((form) => ({ ...form, name: e.target.value }))}
                            required
                        />
                    </div>

                    {/* Líder */}
                    <div>
                        <Label htmlFor="leaderId">Líder da Equipe</Label>
                        <Select
                            value={form.leaderId !== null ? String(form.leaderId) : "null"}
                            onValueChange={(value) => setForm({ ...form, leaderId: value === "null" ? null : Number(value) })}
                        >
                            <SelectTrigger><SelectValue placeholder="Selecione o líder (opcional)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="null">— Nenhum —</SelectItem>
                                {users.map((user) => (
                                    <SelectItem key={user.id} value={String(user.id)}>{user.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={form.status}
                            onValueChange={(value) => setForm({ ...form, status: value as "active" | "inactive" })}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                {/* Botões */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button  className="cursor-pointer" variant="outline" type="button" onClick={onClose}>Cancelar</Button>
                        <Button  className="cursor-pointer" type="submit">{team ? "Atualizar" : "Cadastrar"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}