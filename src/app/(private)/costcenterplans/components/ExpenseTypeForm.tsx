// FILE: src/app/(private)/costcenterplans/components/ExpenseTypeForm.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ExpenseType } from "../types";

interface ExpenseTypeFormProps {
    expenseType?: ExpenseType | null;
    planoCentroCustoItemId?: string | number;
    availableItems: Array<{ id: string | number; name: string; code: string }>;
    onClose: () => void;
    onSave: (data: any) => void;
}

export const ExpenseTypeForm = ({
    expenseType,
    planoCentroCustoItemId,
    availableItems,
    onClose,
    onSave,
}: ExpenseTypeFormProps) => {
    const [formData, setFormData] = useState({
        planoCentroCustoItemId: String(expenseType?.planoCentroCustoItemId ?? planoCentroCustoItemId ?? ""),
        codTipoDespesa: expenseType?.codTipoDespesa ?? "",
        nomeTipoDespesa: expenseType?.nomeTipoDespesa ?? "",
        status: (expenseType?.status ?? "active") as "active" | "inactive",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            planoCentroCustoItemId: Number(formData.planoCentroCustoItemId),
        };
        onSave(payload);
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{expenseType ? "Editar Tipo de Despesa" : "Novo Tipo de Despesa"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Item do Plano de Centro de Custo</Label>
                        <Select
                            value={formData.planoCentroCustoItemId}
                            onValueChange={(value) => setFormData({ ...formData, planoCentroCustoItemId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o item" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableItems.map((item) => (
                                    <SelectItem key={String(item.id)} value={String(item.id)}>
                                        {item.code} - {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Código do Tipo de Despesa</Label>
                            <Input
                                value={formData.codTipoDespesa}
                                onChange={(e) => setFormData({ ...formData, codTipoDespesa: e.target.value })}
                                placeholder="4.01"
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
                        <Label>Nome do Tipo de Despesa</Label>
                        <Input
                            value={formData.nomeTipoDespesa}
                            onChange={(e) => setFormData({ ...formData, nomeTipoDespesa: e.target.value })}
                            placeholder="DESPESAS COM PESSOAL"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">{expenseType ? "Atualizar" : "Cadastrar"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};