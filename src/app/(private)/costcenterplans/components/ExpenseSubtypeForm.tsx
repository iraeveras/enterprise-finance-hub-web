// FILE: src/app/(private)/costcenterplans/components/ExpenseSubtypeForm.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ExpenseSubtype } from "../types";

interface ExpenseSubtypeFormProps {
    expenseSubtype?: ExpenseSubtype | null;
    tipoDespesaId?: string | number;
    availableTypes: Array<{ id: string | number; name: string; code: string }>;
    onClose: () => void;
    onSave: (data: any) => void;
}

export const ExpenseSubtypeForm = ({
    expenseSubtype,
    tipoDespesaId,
    availableTypes,
    onClose,
    onSave,
}: ExpenseSubtypeFormProps) => {
    const [formData, setFormData] = useState({
        tipoDespesaId: String(expenseSubtype?.tipoDespesaId ?? tipoDespesaId ?? ""),
        codSubtipoDespesa: expenseSubtype?.codSubtipoDespesa ?? "",
        nomeSubtipoDespesa: expenseSubtype?.nomeSubtipoDespesa ?? "",
        status: (expenseSubtype?.status ?? "active") as "active" | "inactive",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            tipoDespesaId: Number(formData.tipoDespesaId),
        };
        onSave(payload);
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{expenseSubtype ? "Editar Subtipo de Despesa" : "Novo Subtipo de Despesa"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Tipo de Despesa</Label>
                        <Select value={formData.tipoDespesaId} onValueChange={(value) => setFormData({ ...formData, tipoDespesaId: value })}>
                            <SelectTrigger><SelectValue placeholder="Selecione o tipo de despesa" /></SelectTrigger>
                            <SelectContent>
                                {availableTypes.map((type) => (
                                    <SelectItem key={String(type.id)} value={String(type.id)}>
                                        {type.code} - {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Código do Subtipo</Label>
                            <Input
                                value={formData.codSubtipoDespesa}
                                onChange={(e) => setFormData({ ...formData, codSubtipoDespesa: e.target.value })}
                                placeholder="4.01.01"
                                required
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData({ ...formData, status: value as "active" | "inactive" })}
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
                        <Label>Nome do Subtipo de Despesa</Label>
                        <Input
                            value={formData.nomeSubtipoDespesa}
                            onChange={(e) => setFormData({ ...formData, nomeSubtipoDespesa: e.target.value })}
                            placeholder="SALÁRIOS"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">{expenseSubtype ? "Atualizar" : "Cadastrar"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};