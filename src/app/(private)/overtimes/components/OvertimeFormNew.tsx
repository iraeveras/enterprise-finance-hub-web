// FILE: src/app/(private)/overtimes/components/OvertimeFormNew.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OvertimeFormNewTable, { MonthlyRow } from "./OvertimeFormNewTable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Overtime } from "../types";
import { useEmployees } from "@/app/(private)/employees/hooks/useEmployees";
import { useCompanies } from "@/app/(private)/companies/hooks/useCompanies";
import { useBudgetPeriods } from "../../budgetperiods/hooks/useBudgetPeriods";
import { useCostCenters } from "../../costcenters/hooks/useCostCenters";

interface OvertimeFormNewProps {
    entry?: Overtime | null;
    onClose: () => void;
    onSave: (data: Overtime) => void;
}

export const OvertimeFormNew = ({ entry, onClose, onSave }: OvertimeFormNewProps) => {
    const compQ = useCompanies();
    const empQ = useEmployees();
    const bpQ = useBudgetPeriods();
    const ccQ = useCostCenters();

    const companies = compQ.data ?? [];
    const employees = empQ.data ?? [];
    const budgetPeriods = bpQ.data ?? [];
    const costCenters = ccQ.data ?? [];

    const currentYear = new Date().getFullYear();

    const [isCollective, setIsCollective] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

    const [formData, setFormData] = useState({
        year: currentYear,
        companyId: entry?.companyId ?? (companies[0] ? Number(companies[0].id) : 0),
        costCenterId: entry?.costCenterId ?? 0,
        budgetPeriodId: entry?.budgetPeriodId ?? 0,
        employeeId: entry?.employeeId ?? 0,
        position: "",
    });

    // Seleciona automaticamente o período pelo ano (ou status=active, ou o primeiro)
    useEffect(() => {
        if (!formData.budgetPeriodId && budgetPeriods.length) {
            const byYear = budgetPeriods.find((bp) => Number(bp.year) === formData.year);
            const byActive = budgetPeriods.find((bp) => (bp.status ?? "").toLowerCase() === "active");
            setFormData((prev) => ({
                ...prev,
                budgetPeriodId: byYear?.id ?? byActive?.id ?? budgetPeriods[0].id,
            }));
        }
    }, [budgetPeriods]); // eslint-disable-line

    // Ao escolher funcionário (modo individual), herdamos empresa/CC/função e desabilitamos os campos
    useEffect(() => {
        if (!isCollective && formData.employeeId) {
            const emp = employees.find((e) => Number(e.id) === Number(formData.employeeId));
            if (emp) {
                setFormData((prev) => ({
                    ...prev,
                    companyId: Number((emp as any).companyId ?? prev.companyId),
                    costCenterId: Number((emp as any).costCenterId ?? prev.costCenterId),
                    position: (emp as any).position ?? prev.position,
                }));
            }
        }
    }, [formData.employeeId, isCollective, employees]);

    // Grade mensal
    const [monthlyData, setMonthlyData] = useState<MonthlyRow[]>(
        Array.from({ length: 12 }, (_, index) => ({
            month: index + 1,
            he50Qty: 0,
            he100Qty: 0,
            holidayDaysQty: 0,
            nightHoursQty: 0,
            he50Value: 0,
            he100Value: 0,
            holidayValue: 0,
            nightValue: 0,
            dsrValue: 0,
            dsrNightValue: 0,
            totalValue: 0,
            previousYearTotal: 0,
            variance: 0,
        })),
    );

    const selectedEmployee = employees.find((e) => Number(e.id) === Number(formData.employeeId));

    const hourlyRate = (salary: number, dangerPay: boolean, monthlyHours?: number) => {
        const hours = monthlyHours && monthlyHours > 0 ? monthlyHours : 220;
        const base = dangerPay ? salary * 1.3 : salary;
        return base / hours;
    };

    const recalc = useMemo(() => {
        const emp = selectedEmployee;
        if (!emp) return monthlyData;
        const rate = hourlyRate(Number((emp as any).salary ?? 0), !!(emp as any).dangerPay, (emp as any).monthlyHours);

        return monthlyData.map((m) => {
            const he50Value = m.he50Qty * rate * 1.5;
            const he100Value = m.he100Qty * rate * 2;
            const holidayValue = m.holidayDaysQty * rate * 2 * 8;
            const nightValue = m.nightHoursQty * rate * 0.2;
            const dsrValue = ((m.he50Qty + m.he100Qty + m.holidayDaysQty * 8) / 25) * 5 * rate;
            const dsrNightValue = (m.nightHoursQty / 25) * 5 * rate * 0.2;
            const totalValue = he50Value + he100Value + holidayValue + nightValue + dsrValue + dsrNightValue;
            const previousYearTotal = 0;
            const variance = totalValue - previousYearTotal;

            return {
                ...m,
                he50Value,
                he100Value,
                holidayValue,
                nightValue,
                dsrValue,
                dsrNightValue,
                totalValue,
                previousYearTotal,
                variance,
            };
        });
    }, [monthlyData, selectedEmployee]);

    const updateMonthlyData = (index: number, field: keyof MonthlyRow, value: number) => {
        setMonthlyData((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: Math.max(0, value) } : m)));
    };

    const getMonthName = (m: number) =>
        new Date(formData.year, m - 1).toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

    function ensureRequired(): string | null {
        if (!formData.companyId) return "Selecione a empresa.";
        if (!formData.costCenterId) return "Selecione o Centro de Custo.";
        if (!formData.budgetPeriodId) return "Selecione o Período Orçamentário.";
        if (!isCollective && !formData.employeeId) return "Selecione o funcionário.";
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const err = ensureRequired();
        if (err) {
            alert(err);
            return;
        }

        const monthsToSave = recalc.filter((m) => m.totalValue > 0);

        const makePayload = (employeeId: number, m: MonthlyRow): Overtime => ({
            year: formData.year,
            month: m.month,
            companyId: Number(formData.companyId),
            costCenterId: Number(formData.costCenterId),
            employeeId: Number(employeeId),
            budgetPeriodId: Number(formData.budgetPeriodId),
            function: formData.position ?? "",
            he50Qty: m.he50Qty,
            he100Qty: m.he100Qty,
            holidayDaysQty: m.holidayDaysQty,
            nightHoursQty: m.nightHoursQty,
            he50Value: m.he50Value,
            he100Value: m.he100Value,
            holidayValue: m.holidayValue,
            nightValue: m.nightValue,
            dsrValue: m.dsrValue,
            dsrNightValue: m.dsrNightValue,
            totalValue: m.totalValue,
            previousYearTotal: m.previousYearTotal,
            budgetedAmount: m.previousYearTotal,
            variance: m.variance,
            variancePercentage: m.previousYearTotal > 0 ? (m.variance / m.previousYearTotal) * 100 : 0,
            status: "open",
        });

        if (isCollective) {
            selectedEmployees.forEach((empId) => monthsToSave.forEach((m) => onSave(makePayload(empId, m))));
        } else if (formData.employeeId) {
            monthsToSave.forEach((m) => onSave(makePayload(Number(formData.employeeId), m)));
        }
    };

    // Filtros
    const filteredCostCenters = costCenters.filter(
        (cc) => !formData.companyId || Number(cc.companyId ?? formData.companyId) === Number(formData.companyId),
    );

    const filteredEmployeesByCompany = employees.filter(
        (e) => !formData.companyId || Number((e as any).companyId ?? formData.companyId) === Number(formData.companyId),
    );

    const filteredEmployeesByCompanyAndCC = filteredEmployeesByCompany.filter(
        (e) => !formData.costCenterId || Number((e as any).costCenterId ?? formData.costCenterId) === Number(formData.costCenterId),
    );

    // Desabilitar campos conforme regra:
    const disableCompanyAndCC =
        !isCollective && !!formData.employeeId; // individual: após escolher funcionário, trava empresa/CC
    const disableBudgetPeriod = true; // sempre desabilitado (preenchido automático)

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-[1000px] sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                <div className="px-4 sm:px-6 py-4">
                    <DialogHeader>
                        <DialogTitle>{entry ? "Editar Lançamento de Horas Extras" : "Novo Lançamento"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tipo de lançamento */}
                        <div className="flex items-center space-x-2">
                            <Switch checked={isCollective} onCheckedChange={setIsCollective} />
                            <Label>Lançamento Coletivo (por Equipe/Setor)</Label>
                        </div>

                        {/* Linha de seleção */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                                <Label htmlFor="year">Ano</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input id="year" type="number" value={formData.year} disabled className="bg-gray-100 cursor-not-allowed" />
                                        </TooltipTrigger>
                                        <TooltipContent>Ano do período orçamentário</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <div>
                                <Label>Empresa</Label>
                                <Select
                                    value={String(formData.companyId || "")}
                                    onValueChange={(v) => setFormData((prev) => ({ ...prev, companyId: Number(v), costCenterId: 0 }))}
                                    disabled={disableCompanyAndCC}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((c) => (
                                            <SelectItem key={String(c.id)} value={String(c.id)}>
                                                {c.corporateName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Centro de Custo</Label>
                                <Select
                                    value={String(formData.costCenterId || "")}
                                    onValueChange={(v) => setFormData((prev) => ({ ...prev, costCenterId: Number(v) }))}
                                    disabled={disableCompanyAndCC || !formData.companyId}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredCostCenters.map((cc) => (
                                            <SelectItem key={String(cc.id)} value={String(cc.id)}>
                                                {cc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label>Período Orçamentário</Label>
                                <Select
                                    value={String(formData.budgetPeriodId || "")}
                                    onValueChange={(v) => setFormData((prev) => ({ ...prev, budgetPeriodId: Number(v) }))}
                                    disabled={disableBudgetPeriod}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {budgetPeriods.map((bp) => (
                                            <SelectItem key={bp.id} value={String(bp.id)}>
                                                {bp.year}
                                                {bp.status ? ` — ${bp.status}` : ""}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Individual: campo Funcionário e Função */}
                            {!isCollective && (
                                <>
                                    <div className="sm:col-span-2 lg:col-span-2">
                                        <Label>Funcionário</Label>
                                        <Select
                                            value={String(formData.employeeId || "")}
                                            onValueChange={(v) => setFormData((prev) => ({ ...prev, employeeId: Number(v) }))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o funcionário" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* filtra por empresa e CC SE já selecionados antes do colaborador */}
                                                {(formData.costCenterId ? filteredEmployeesByCompanyAndCC : filteredEmployeesByCompany).map((e) => (
                                                    <SelectItem key={String(e.id)} value={String(e.id)}>
                                                        {e.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label>Função</Label>
                                        <Input value={formData.position} disabled className="bg-gray-100" />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* INDIVIDUAL */}
                        {!isCollective && selectedEmployee && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Grade Mensal — {formData.year}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        Funcionário: {selectedEmployee.name} | Jornada: {(selectedEmployee as any).monthlyHours ?? 220}h |{" "}
                                        {(selectedEmployee as any).workSchedule ?? "ADM"}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <OvertimeFormNewTable rows={recalc} onChange={updateMonthlyData} getMonthName={getMonthName} />
                                </CardContent>
                            </Card>
                        )}

                        {/* COLETIVO */}
                        {isCollective && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Selecionar Funcionários</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {/* Só mostra a lista depois de empresa e CC */}
                                    {!formData.companyId || !formData.costCenterId ? (
                                        <div className="text-sm text-muted-foreground">
                                            Selecione <strong>Empresa</strong> e <strong>Centro de Custo</strong> para listar os funcionários.
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {filteredEmployeesByCompanyAndCC.map((e) => {
                                                    const checked = selectedEmployees.includes(Number(e.id));
                                                    return (
                                                        <label key={String(e.id)} className="flex items-center gap-2 text-sm">
                                                            <input
                                                                type="checkbox"
                                                                className="h-4 w-4"
                                                                checked={checked}
                                                                onChange={(ev) => {
                                                                    const on = ev.target.checked;
                                                                    setSelectedEmployees((old) =>
                                                                        on ? [...old, Number(e.id)] : old.filter((id) => id !== Number(e.id)),
                                                                    );
                                                                }}
                                                            />
                                                            <span className="truncate">{e.name}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>

                                            {selectedEmployees.length > 0 && (
                                                <Card className="border-dashed">
                                                    <CardHeader>
                                                        <CardTitle className="text-base">Grade Mensal — {formData.year}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <OvertimeFormNewTable
                                                            rows={recalc}
                                                            onChange={updateMonthlyData}
                                                            getMonthName={getMonthName}
                                                            showReadonlyTotals
                                                        />
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Ações */}
                        <div className="flex flex-col sm:flex-row justify-end gap-2">
                            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:w-auto"
                                disabled={(!isCollective && !formData.employeeId) || (isCollective && selectedEmployees.length === 0)}
                            >
                                {entry ? "Atualizar" : "Salvar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};