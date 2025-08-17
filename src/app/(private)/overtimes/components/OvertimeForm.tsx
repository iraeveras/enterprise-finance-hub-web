// FILE: src/app/(private)/overtimes/components/OvertimeForm.tsx
"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from "@/app/(private)/employees/hooks/useEmployees";
import { useCompanies } from "@/app/(private)/companies/hooks/useCompanies";
import { useCostCenters } from "@/app/(private)/costcenters/hooks/useCostCenters";
import { useBudgetPeriods } from "@/app/(private)/budgetperiods/hooks/useBudgetPeriods"; // supondo que exista
import type { Overtime } from "../types";

interface OvertimeFormProps {
    entry?: Overtime | null;
    onClose: () => void;
    onSave: (data: Overtime | Omit<Overtime, "id">) => void;
}

export function OvertimeForm({ entry, onClose, onSave }: OvertimeFormProps) {
    const empQ = useEmployees();
    const compQ = useCompanies();
    const ccQ = useCostCenters();
    const bpQ = useBudgetPeriods?.() as any; // se não existir, remova este select no seu projeto

    const employees = empQ.data ?? [];
    const companies = compQ.data ?? [];
    const costCenters = ccQ.data ?? [];
    const periods = bpQ?.data ?? [];

    const [formData, setFormData] = useState<Overtime>({
        id: entry?.id,
        year: entry?.year ?? new Date().getFullYear(),
        month: entry?.month ?? new Date().getMonth() + 1,
        companyId: entry?.companyId ?? Number(companies[0]?.id ?? 1),
        costcenterId: entry?.costcenterId ?? Number(costCenters[0]?.id ?? 1),
        employeeId: entry?.employeeId ?? Number(employees[0]?.id ?? 1),
        budgetPeriodId: entry?.budgetPeriodId ?? Number(periods?.[0]?.id ?? 1),
        function: entry?.function ?? "",
        overtime50: entry?.overtime50 ?? 0,
        overtime100: entry?.overtime100 ?? 0,
        holidayHours: entry?.holidayHours ?? 0,
        nightShiftHours: entry?.nightShiftHours ?? 0,
        budgetedAmount: entry?.budgetedAmount ?? 0,
        dsrValue: entry?.dsrValue ?? 0,
        dsrNightValue: entry?.dsrNightValue ?? 0,
        additionalValue: entry?.additionalValue ?? 0,
        totalValue: entry?.totalValue ?? 0,
        variance: entry?.variance ?? 0,
        variancePercentage: entry?.variancePercentage ?? 0,
        justification: entry?.justification ?? "",
        status: entry?.status ?? "open",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload: Overtime = {
            ...formData,
            year: Number(formData.year),
            month: Number(formData.month),
            companyId: Number(formData.companyId),
            costcenterId: Number(formData.costcenterId),
            employeeId: Number(formData.employeeId),
            budgetPeriodId: Number(formData.budgetPeriodId),
        };
        onSave(payload);
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{entry ? "Editar Lançamento de Horas Extras" : "Novo Lançamento de Horas Extras"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <Label htmlFor="year">Ano</Label>
                            <Input id="year" type="number" value={formData.year} onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })} />
                        </div>
                        <div>
                            <Label htmlFor="month">Mês</Label>
                            <Select value={String(formData.month)} onValueChange={(v) => setFormData({ ...formData, month: Number(v) })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>
                                            {new Date(formData.year, i).toLocaleDateString("pt-BR", { month: "long" })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Empresa</Label>
                            <Select value={String(formData.companyId)} onValueChange={(v) => setFormData({ ...formData, companyId: Number(v) })}>
                                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                <SelectContent>
                                    {companies.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.corporateName}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Centro de Custo</Label>
                            <Select value={String(formData.costcenterId)} onValueChange={(v) => setFormData({ ...formData, costcenterId: Number(v) })}>
                                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                <SelectContent>
                                    {costCenters.map((cc) => <SelectItem key={cc.id} value={String(cc.id)}>{cc.code} - {cc.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Funcionário</Label>
                            <Select value={String(formData.employeeId)} onValueChange={(v) => {
                                const emp = employees.find((e) => String(e.id) === v);
                                setFormData({ ...formData, employeeId: Number(v), function: emp?.position ?? "" });
                            }}>
                                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                                <SelectContent>
                                    {employees.map((e) => <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Função</Label>
                            <Input value={formData.function} onChange={(e) => setFormData({ ...formData, function: e.target.value })} />
                        </div>
                    </div>

                    <Card>
                        <CardHeader><CardTitle className="text-lg">Horas</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <Label>HE 50%</Label>
                                <Input type="number" step="0.5" value={formData.overtime50 ?? 0}
                                    onChange={(e) => setFormData({ ...formData, overtime50: Number(e.target.value || 0) })} />
                            </div>
                            <div>
                                <Label>HE 100%</Label>
                                <Input type="number" step="0.5" value={formData.overtime100 ?? 0}
                                    onChange={(e) => setFormData({ ...formData, overtime100: Number(e.target.value || 0) })} />
                            </div>
                            <div>
                                <Label>Feriados (h)</Label>
                                <Input type="number" step="0.5" value={formData.holidayHours ?? 0}
                                    onChange={(e) => setFormData({ ...formData, holidayHours: Number(e.target.value || 0) })} />
                            </div>
                            <div>
                                <Label>Noturno (h)</Label>
                                <Input type="number" step="0.5" value={formData.nightShiftHours ?? 0}
                                    onChange={(e) => setFormData({ ...formData, nightShiftHours: Number(e.target.value || 0) })} />
                            </div>
                        </CardContent>
                    </Card>

                    <div>
                        <Label>Justificativa</Label>
                        <Textarea value={formData.justification ?? ""} onChange={(e) => setFormData({ ...formData, justification: e.target.value })} />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                        <Button type="submit">{entry ? "Atualizar" : "Salvar"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}