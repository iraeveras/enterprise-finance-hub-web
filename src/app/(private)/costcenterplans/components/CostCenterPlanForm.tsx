// FILE: src/app/(private)/costcenterplans/components/CostCenterPlanForm.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CostCenterPlan } from "@/app/(private)/costcenterplans/types";
import { useCompanies } from "@/app/(private)/companies/hooks/useCompanies";
import type { Company } from "@/app/(private)/companies/types";

interface CostCenterPlanFormProps {
    plan?: CostCenterPlan | null;
    onClose: () => void;
    onSave: (data: {
        codPlanoCentroCusto: string;
        nomePlanoCentroCusto: string;
        companyId: number;
        status: "active" | "inactive";
    }) => void;
}

export const CostCenterPlanForm = ({ plan, onClose, onSave }: CostCenterPlanFormProps) => {
    const [formData, setFormData] = useState<{
        codPlanoCentroCusto: string;
        nomePlanoCentroCusto: string;
        companyId: number | null;
        status: "active" | "inactive";
    }>({
        codPlanoCentroCusto: plan?.codPlanoCentroCusto ?? "",
        nomePlanoCentroCusto: plan?.nomePlanoCentroCusto ?? "",
        companyId: typeof plan?.companyId === "number" ? plan!.companyId : null,
        status: (plan?.status ?? "active") as "active" | "inactive",
    });

    const companiesQ = useCompanies();
    // usa corporateName e normaliza id -> number
    const companies: { id: number; label: string }[] = ((companiesQ.data ?? []) as Company[])
        .map((c) => ({
            id: typeof c.id === "string" ? Number(c.id) : (c.id as unknown as number),
            label: c.corporateName, // <<< usa corporateName
        }))
        .filter((c) => Number.isFinite(c.id));

    // auto-seleciona se houver exatamente 1 empresa
    useEffect(() => {
        if (formData.companyId == null && companies.length === 1) {
            setFormData((p) => ({ ...p, companyId: companies[0].id }));
        }
    }, [companies, formData.companyId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.companyId == null) return;
        onSave({
            codPlanoCentroCusto: formData.codPlanoCentroCusto,
            nomePlanoCentroCusto: formData.nomePlanoCentroCusto,
            companyId: formData.companyId,
            status: formData.status,
        });
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{plan ? "Editar Plano de Centro de Custo" : "Novo Plano de Centro de Custo"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="codPlanoCentroCusto">Código do Plano</Label>
                            <Input
                                id="codPlanoCentroCusto"
                                value={formData.codPlanoCentroCusto}
                                onChange={(e) => setFormData({ ...formData, codPlanoCentroCusto: e.target.value })}
                                placeholder="1"
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
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
                        <Label htmlFor="nomePlanoCentroCusto">Nome do Plano de Centro de Custo</Label>
                        <Input
                            id="nomePlanoCentroCusto"
                            value={formData.nomePlanoCentroCusto}
                            onChange={(e) => setFormData({ ...formData, nomePlanoCentroCusto: e.target.value })}
                            placeholder="DESPESAS COMUNS"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="companyId">Empresa</Label>
                        <Select
                            value={formData.companyId != null ? String(formData.companyId) : ""}
                            onValueChange={(value) => setFormData({ ...formData, companyId: Number(value) })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a empresa" />
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((c) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        {c.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit" disabled={formData.companyId == null}>
                            {plan ? "Atualizar" : "Cadastrar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};