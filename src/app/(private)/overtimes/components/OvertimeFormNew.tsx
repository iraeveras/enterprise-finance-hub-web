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
import { useCostCenters } from "../../costcenters/hooks/useCostCenters";
import { useBudgetPeriods } from "../../budgetperiods/hooks/useBudgetPeriods";
import { AlertTriangle } from "lucide-react";

function num(v: any): number {
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") return v;
    if (typeof v === "string") return Number(v);
    if (typeof v === "object") {
        // tenta extrair um id de objetos comuns
        return num(v.id ?? v.value ?? v.key ?? v.code);
    }
    return 0;
}
function getEmpCompanyId(emp: any): number {
    // cobre os formatos mais comuns do projeto
    return num(
        emp?.companyId ??
            emp?.company_id ??
            emp?.company?.id ??
            emp?.company?.companyId ??
            emp?.empresaId ??
            emp?.empresa?.id
    );
}
function getEmpCostCenterId(emp: any): number {
    // no projeto já vi costCenterId, cost_center_id, costCenter.id, departmentId…
    return num(
        emp?.costcenterId ??
            emp?.cost_center_id ??
            emp?.costcenter?.id ??
            emp?.departmentId ?? // fallback comum quando CC = departamento
            emp?.setorId ?? // caso usem "setor"
            emp?.sectorId ??
            emp?.teamId // último fallback (quando time mapeia CC)
    );
}

interface OvertimeFormNewProps {
    entry?: Overtime | null;
    onClose: () => void;
    onSave: (data: Overtime) => void;
}

function isOpenStatus(s?: string | null) {
    if (!s) return false;
    return String(s).toLowerCase() === "open" || String(s).toLowerCase() === "aberto";
}

export const OvertimeFormNew = ({ entry, onClose, onSave }: OvertimeFormNewProps) => {
    // dados reais
    const compQ = useCompanies();
    const empQ = useEmployees();
    const ccQ = useCostCenters();
    const bpQ = useBudgetPeriods();

    const companies = compQ.data ?? [];
    const employees = empQ.data ?? [];
    const costCenters = ccQ.data ?? [];
    const budgetPeriods = bpQ.data ?? [];

    // período orçamentário em exercício (status open)
    const activeBudget = useMemo(() => {
        // 1) tenta por status open
        const byOpen = budgetPeriods.find((bp: any) => isOpenStatus(bp.status));
        if (byOpen) return byOpen;
        // 2) tenta pelo ano corrente E open (fallback)
        const currentYear = new Date().getFullYear();
        const byYearOpen = budgetPeriods.find((bp: any) => Number(bp.year) === currentYear && isOpenStatus(bp.status));
        return byYearOpen ?? null;
    }, [budgetPeriods]);

    // se não existir ativo, bloqueia o formulário
    const noActiveBudget = !activeBudget;

    // form state
    const [isCollective, setIsCollective] = useState<boolean>(false);
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);

    // inicializa com entry (editar) OU com defaults do período ativo
    const [formData, setFormData] = useState({
        // ano deve vir do orçamento em exercício
        year: entry?.year ?? (activeBudget ? Number(activeBudget.year) : new Date().getFullYear()),
        budgetPeriodId: entry?.budgetPeriodId ?? (activeBudget ? Number(activeBudget.id) : 0),
        companyId: entry?.companyId ?? 0,
        costcenterId: entry?.costcenterId ?? 0,
        employeeId: entry?.employeeId ?? 0,
        position: entry?.function ?? "",
    });

    // employees filtrados (empresa + centro de custo)
    const employeesFilteredByCompany = useMemo(() => {
        if (!formData.companyId) return employees;
        return employees.filter((e: any) => getEmpCompanyId(e) === num(formData.companyId));
    }, [employees, formData.companyId]);

    const employeesFiltered = useMemo(() => {
        if (!formData.costcenterId) return employeesFilteredByCompany;
        return employeesFilteredByCompany.filter(
            (e: any) => getEmpCostCenterId(e) === num(formData.costcenterId)
    );
    }, [employeesFilteredByCompany, formData.costcenterId]);

    // cost centers filtrados por empresa
    const costCentersFiltered = useMemo(
        () => costCenters.filter((cc: any) => !formData.companyId || num(cc.companyId ?? cc.company?.id) === num(formData.companyId)),
        [costCenters, formData.companyId]
    );

    // se selecionar funcionário (individual), herdamos empresa/CC/função e travamos esses campos
    const selectedEmployee = useMemo(
        () => employees.find((e: any) => Number(e.id) === Number(formData.employeeId)),
        [employees, formData.employeeId]
    );

    useEffect(() => {
        if (!isCollective && selectedEmployee) {
            setFormData((prev) => ({
                ...prev,
                companyId: Number(selectedEmployee.companyId ?? prev.companyId),
                costcenterId: Number(selectedEmployee.costcenterId ?? prev.costcenterId),
                position: selectedEmployee.position ?? prev.position,
            }));
        }
    }, [selectedEmployee, isCollective]);

    // montar a grade (para editar, pré-preenche o mês do entry)
    const emptyRows: MonthlyRow[] = Array.from({ length: 12 }, (_, index) => ({
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
    }));

    const [monthlyData, setMonthlyData] = useState<MonthlyRow[]>(
        entry
            ? emptyRows.map((r) =>
                    r.month === entry.month
                        ? {
                            ...r,
                            he50Qty: entry.he50Qty ?? entry.overtime50 ?? 0,
                            he100Qty: entry.he100Qty ?? entry.overtime100 ?? 0,
                            holidayDaysQty: entry.holidayDaysQty ?? (entry.holidayHours ? Math.round(entry.holidayHours / 8) : 0),
                            nightHoursQty: entry.nightHoursQty ?? entry.nightShiftHours ?? 0,
                            he50Value: entry.he50Value ?? entry.overtime50Value ?? 0,
                            he100Value: entry.he100Value ?? entry.overtime100Value ?? 0,
                            holidayValue: entry.holidayValue ?? 0,
                            nightValue: entry.nightValue ?? entry.nightShiftValue ?? 0,
                            dsrValue: entry.dsrValue ?? 0,
                            dsrNightValue: entry.dsrNightValue ?? 0,
                            totalValue: entry.totalValue ?? 0,
                            previousYearTotal: entry.previousYearTotal ?? entry.budgetedAmount ?? 0,
                            variance: entry.variance ?? 0,
                        }
                    : r
                )
            : emptyRows
    );

    // cálculo de valores
    const hourlyRate = (salary: number, dangerPay: boolean, monthlyHours?: number) => {
        const hours = monthlyHours && monthlyHours > 0 ? monthlyHours : 220;
        const base = dangerPay ? salary * 1.3 : salary;
        return base / hours;
    };

    const recalc = useMemo(() => {
        const emp: any = selectedEmployee;
        if (!emp) return monthlyData;
        const rate = hourlyRate(Number(emp.salary ?? 0), !!emp.dangerPay, emp.monthlyHours);

        return monthlyData.map((m) => {
            const he50Value = m.he50Qty * rate * 1.5;
            const he100Value = m.he100Qty * rate * 2;
            const holidayValue = m.holidayDaysQty * rate * 2 * 8;
            const nightValue = m.nightHoursQty * rate * 0.2;
            const dsrValue = ((m.he50Qty + m.he100Qty + m.holidayDaysQty * 8) / 25) * 5 * rate;
            const dsrNightValue = (m.nightHoursQty / 25) * 5 * rate * 0.2;
            const totalValue = he50Value + he100Value + holidayValue + nightValue + dsrValue + dsrNightValue;
            const previousYearTotal = m.previousYearTotal ?? 0;
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
        if (noActiveBudget) return "Não há Período Orçamentário em aberto. Cadastre/abra um período antes de lançar horas.";
        if (!formData.companyId) return "Selecione a empresa.";
        if (!formData.costcenterId) return "Selecione o centro de custo.";
        if (!formData.budgetPeriodId) return "Período orçamentário inválido.";
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
            costcenterId: Number(formData.costcenterId),
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

    // travas de campos
    const disableCompanyAndCC = !isCollective && !!formData.employeeId; // individual: após escolher funcionário, trava empresa/CC
    const disableBudgetPeriod = true; // sempre readonly (vem do orçamento em exercício)
    const disableCollectiveToggle = !!entry; // editar: não permite alternar para coletivo

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-[1000px] sm:max-w-3xl lg:max-w-5xl xl:max-w-6xl max-h-[90vh] overflow-y-auto p-0">
                <div className="px-4 sm:px-6 py-4">
                    <DialogHeader>
                        <DialogTitle>{entry ? "Editar Lançamento de Horas Extras" : "Novo Lançamento"}</DialogTitle>
                    </DialogHeader>

                    {/* AVISO quando não há orçamento em aberto */}
                    {noActiveBudget && (
                        <div className="mb-4 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-800">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                            <div className="text-sm">
                                <strong>Não há período orçamentário em aberto.</strong> Cadastre um período de orçamento com status
                                <em> open</em> para lançar horas extras.
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Tipo de lançamento */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={isCollective}
                                onCheckedChange={setIsCollective}
                                disabled={disableCollectiveToggle || noActiveBudget}
                            />
                            <Label>
                                Lançamento Coletivo (por Equipe/Setor){disableCollectiveToggle ? " — indisponível na edição" : ""}
                            </Label>
                        </div>

                        {/* Linha de seleção */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                                <Label htmlFor="year">Ano</Label>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Input
                                                id="year"
                                                type="number"
                                                value={formData.year}
                                                disabled
                                                className="bg-gray-100 cursor-not-allowed"
                                            />
                                        </TooltipTrigger>
                                        <TooltipContent>Ano do orçamento em exercício (status open)</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <div>
                                <Label>Período Orçamentário</Label>
                                <Input
                                    value={activeBudget ? `${activeBudget.year} — ${activeBudget.status ?? "open"}` : "—"}
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>

                            <div>
                                <Label>Empresa</Label>
                                <Select
                                    value={String(formData.companyId || "")}
                                    onValueChange={(v) =>
                                        setFormData((prev) => ({
                                        ...prev,
                                        companyId: Number(v),
                                        costcenterId: 0,   // ⬅️ aqui (antes estava costCenterId)
                                        employeeId: 0,
                                        }))
                                    }
                                    disabled={disableCompanyAndCC || noActiveBudget}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companies.map((c: any) => (
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
                                    value={String(formData.costcenterId || "")}
                                    onValueChange={(v) => setFormData((prev) => ({ ...prev, costcenterId: Number(v), employeeId: 0 }))}
                                    disabled={disableCompanyAndCC || !formData.companyId || noActiveBudget}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {costCentersFiltered.map((cc: any) => (
                                            <SelectItem key={String(cc.id)} value={String(cc.id)}>
                                                {cc.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Individual */}
                            {!isCollective && (
                                <>
                                    <div className="sm:col-span-2 lg:col-span-2">
                                        <Label>Funcionário</Label>
                                        <Select
                                            value={String(formData.employeeId || "")}
                                            onValueChange={(v) => setFormData((prev) => ({ ...prev, employeeId: Number(v) }))}
                                            disabled={!num(formData.companyId) || !num(formData.costcenterId) || noActiveBudget}
                                            >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={employeesFiltered.length ? "Selecione o funcionário" : "Sem funcionários para filtros"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {employeesFiltered.map((e: any) => (
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
                                        Funcionário: {selectedEmployee.name} | Jornada: {selectedEmployee.monthlyHours ?? 220}h |{" "}
                                        {selectedEmployee.workSchedule ?? "ADM"}
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
                                    {!formData.companyId || !formData.costcenterId ? (
                                        <div className="text-sm text-muted-foreground">
                                            Selecione <strong>Empresa</strong> e <strong>Centro de Custo</strong> para listar os funcionários.
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                {employeesFiltered.map((e: any) => {
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
                                                                        on ? [...old, Number(e.id)] : old.filter((id) => id !== Number(e.id))
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
                                disabled={
                                    noActiveBudget ||
                                    (!isCollective && !formData.employeeId) ||
                                    (isCollective && selectedEmployees.length === 0)
                                }
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