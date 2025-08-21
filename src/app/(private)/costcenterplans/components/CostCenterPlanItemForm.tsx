// FILE: src/app/(private)/costcenterplans/components/CostCenterPlanItemForm.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CostCenterPlanItem } from "../types";

interface CostCenterPlanItemFormProps {
    item?: CostCenterPlanItem | null;
    planoCentroCustoId?: string | number;
    availablePlans: Array<{ id: number | string; name: string; code: string }>;
    onClose: () => void;
    onSave: (data: any) => void;
}

export const CostCenterPlanItemForm = ({
    item,
    planoCentroCustoId,
    availablePlans,
    onClose,
    onSave,
}: CostCenterPlanItemFormProps) => {
    const [formData, setFormData] = useState({
        planoCentroCustoId: String(item?.planoCentroCustoId ?? planoCentroCustoId ?? ""),
        codPlanoCentroCustoItem: item?.codPlanoCentroCustoItem ?? "",
        nomePlanoCentroCustoItem: item?.nomePlanoCentroCustoItem ?? "",
        status: (item?.status ?? "active") as "active" | "inactive",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            planoCentroCustoId: Number(formData.planoCentroCustoId),
        };
        onSave(payload);
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{item ? "Editar Item do Plano" : "Novo Item do Plano"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Plano de Centro de Custo</Label>
                        <Select
                            value={formData.planoCentroCustoId}
                            onValueChange={(value) => setFormData({ ...formData, planoCentroCustoId: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o plano" />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePlans.map((plan) => (
                                    <SelectItem key={String(plan.id)} value={String(plan.id)}>
                                        {plan.code} - {plan.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Código do Item</Label>
                            <Input
                                value={formData.codPlanoCentroCustoItem}
                                onChange={(e) => setFormData({ ...formData, codPlanoCentroCustoItem: e.target.value })}
                                placeholder="1.1.1.1"
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
                        <Label>Nome do Item</Label>
                        <Input
                            value={formData.nomePlanoCentroCustoItem}
                            onChange={(e) => setFormData({ ...formData, nomePlanoCentroCustoItem: e.target.value })}
                            placeholder="AR CONDICIONADO"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">{item ? "Atualizar" : "Cadastrar"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};