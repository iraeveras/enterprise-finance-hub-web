// FILE: src/app/(private)/costcenters/components/CostCenterForm.tsx
"use client"

import React, { useState } from "react"
import {
    Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import type {
    CostCenter, CreateCostCenterInput, UpdateCostCenterInput
} from "../types";

interface CostCenterFormProps {
    costCenter?: CostCenter | null
    companies: { id: string; corporateName: string }[]
    departments: { id: string; name: string }[]
    sectors: { id: string; name: string }[]
    onClose: () => void
    onSave: (data: CreateCostCenterInput | UpdateCostCenterInput) => void
}

export function CostCenterForm({
    costCenter, companies, departments, sectors, onClose, onSave
}: CostCenterFormProps) {
    const [form, setForm] = useState({
        id: costCenter?.id,
        code: costCenter?.code || "",
        name: costCenter?.name || "",
        companyId: costCenter ? Number(costCenter?.companyId) : companies[0] ? Number(companies[0]?.id) : 0,
        departmentId: costCenter ? Number(costCenter?.departmentId) : departments[0] ? Number(departments[0]?.id) : 0,
        sectorId: costCenter ? Number(costCenter?.sectorId) : sectors[0] ? Number(sectors[0]?.id) : 0,
        status: costCenter?.status || "active",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            ...form,
            companyId: Number(form.companyId),
            departmentId: Number(form.departmentId),
            sectorId: Number(form.sectorId),
        }
        onSave(payload as any)
    }

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{costCenter ? "Editar Centro de Custo" : "Novo Centro de Custo"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="code">Código</Label>
                            <Input
                                id="code"
                                value={form.code}
                                onChange={e => setForm(f => ({ ...f, code: e.target.value }))}
                                placeholder="CC001"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={form.status}
                                onValueChange={v => setForm(f => ({ ...f, status: v as "active" | "inactive" }))}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Ativo</SelectItem>
                                    <SelectItem value="inactive">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="companyId">Empresa</Label>
                        <Select
                            value={String(form.companyId)}
                            onValueChange={(value) => setForm({ ...form, companyId: Number(value) })}
                        >
                            <SelectTrigger><SelectValue placeholder="Selecione a empresa" /></SelectTrigger>
                            <SelectContent>
                                {companies.map(c => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.corporateName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="departmentId">Departamento</Label>
                        <Select
                            value={String(form.departmentId)}
                            onValueChange={(value) => setForm({ ...form, departmentId: Number(value) })}
                        >
                            <SelectTrigger><SelectValue placeholder="Selecione o departamento" /></SelectTrigger>
                            <SelectContent>
                                {departments.map(d => (
                                    <SelectItem key={d.id} value={String(d.id)}>
                                        {d.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="sectorId">Setor</Label>
                        <Select
                            value={String(form.sectorId)}
                            onValueChange={value => setForm({ ...form, sectorId: Number(value) })}
                        >
                            <SelectTrigger><SelectValue placeholder="Selecione o setor" /></SelectTrigger>
                            <SelectContent>
                                {sectors.map(s => (
                                    <SelectItem key={s.id} value={String(s.id)}>
                                        {s.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Button className="cursor-pointer" variant="outline" type="button" onClick={onClose}>Cancelar</Button>
                        <Button className="cursor-pointer" type="submit">{costCenter ? "Atualizar" : "Cadastrar"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}