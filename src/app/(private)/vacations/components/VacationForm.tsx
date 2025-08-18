// FILE: src/app/(private)/vacations/components/VacationForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CreateVacationInput, Vacation, VacationStatus } from "../types";
import { BatchEditableTable, BatchTableField } from "./BatchEditableTable";

// hooks existentes nos módulos anteriores (troque se o caminho do seu projeto for outro)
import { useEmployees } from "../../employees/hooks/useEmployees";
import { useSectors } from "../../sectors/hooks/useSectors";
import { useAcquisitionPeriods } from "../hooks/useAcquisitionPeriods"; // do módulo que você moveu p/ vacations
import { useCurrentBudgetYear } from "../hooks/useCurrentBudgetYear";

interface VacationFormProps {
  vacation?: Vacation | null;
  onClose: () => void;
  onSave: (data: CreateVacationInput) => void;
}

// util para evitar “-1 dia” (meio-dia UTC)
const toMiddayISO = (yyyy_mm_dd: string) => `${yyyy_mm_dd}T12:00:00.000Z`;
const onlyDate = (iso: string) => new Date(iso).toISOString().slice(0, 10);

function calculateVacationValues(employee: any, {
  vacationDays,
  abonoDays,
  thirteenthAdvance,
}: { vacationDays: number; abonoDays: number; thirteenthAdvance: boolean }) {
  const sal = Number(employee?.salary ?? 0);
  const overtimeAvg = Number(employee?.overtimeAverage ?? 0);
  const dangerPay = Boolean(employee?.dangerPay);

  const baseSalary = dangerPay ? sal * 1.3 : sal;
  const totalBase = baseSalary + overtimeAvg;

  const vacationDailyValue = totalBase / 30;
  const vacationValue = vacationDailyValue * Number(vacationDays || 0);
  const onethirdValue = vacationValue / 3;

  const abonoDailyValue = totalBase / 30;
  const abonoValue = abonoDailyValue * Number(abonoDays || 0);
  const abonoOnethirdValue = abonoValue / 3;

  const thirteenthSalary = thirteenthAdvance ? baseSalary * 0.5 : 0;

  return {
    baseSalary,
    overtimeAverage: overtimeAvg,
    vacationValue,
    onethirdValue,
    abonoValue,
    abonoOnethirdValue,
    thirteenthSalary,
    totalVacationValue: vacationValue + onethirdValue + abonoValue + abonoOnethirdValue,
  };
}

export function VacationForm({ vacation, onClose, onSave }: VacationFormProps) {
  const employeesQ = useEmployees();
  const sectorsQ = useSectors();

  const [employeeId, setEmployeeId] = useState<string>(vacation ? String(vacation.employeeId) : "");
  const [sectorId, setSectorId] = useState<string>(vacation ? String(vacation.sectorId) : "");
  const [month, setMonth] = useState<number>(vacation?.month ?? 0);
  const [vacationDays, setVacationDays] = useState<number>(vacation?.vacationDays ?? 30);
  const [abonoDays, setAbonoDays] = useState<number>(vacation?.abonoDays ?? 0);
  const [thirteenthAdvance, setThirteenthAdvance] = useState<boolean>(vacation?.thirteenthAdvance ?? false);
  const [status, setStatus] = useState<VacationStatus>(vacation?.status ?? "scheduled");
  const [acqId, setAcqId] = useState<string>("");

  const [isCollective, setIsCollective] = useState(false);
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employeeData, setEmployeeData] = useState<Record<string, Record<string, any>>>({});

  const employees = employeesQ.data ?? [];
  const sectors = sectorsQ.data ?? [];

  const selectedEmployee = useMemo(
    () => employees.find((e: any) => String(e.id) === employeeId),
    [employees, employeeId]
  );

  // >>> COMPUTE os valores sempre que algo relevante mudar
  const computed = useMemo(() => {
    return calculateVacationValues(selectedEmployee, {
      vacationDays,
      abonoDays,
      thirteenthAdvance,
    });
  }, [selectedEmployee, vacationDays, abonoDays, thirteenthAdvance]);

  // === Período orçamentário (id e ano) da empresa do funcionário ===
  const companyId = selectedEmployee ? Number(selectedEmployee.companyId) : undefined;
  const budgetPeriodQ = useCurrentBudgetYear(companyId);
  const year = budgetPeriodQ.data?.year ?? new Date().getFullYear();
  const budgetPeriodId = budgetPeriodQ.data?.id ?? null;

  const acqQ = useAcquisitionPeriods({
    employeeId: employeeId ? Number(employeeId) : undefined,
    status: "open",
  });

  const availableAcq = useMemo(() => {
    const list = acqQ.data ?? [];
    const empIdNum = employeeId ? Number(employeeId) : undefined;
    return list.filter((p: any) => p.status === "open" && (!empIdNum || Number(p.employeeId) === empIdNum));
  }, [acqQ.data, employeeId]);

  // períodos abertos (todos) — para a grade coletiva
  const allOpenAcqQ = useAcquisitionPeriods({ status: "open" });

  // validação simples
  const validDays = vacationDays + abonoDays <= 30;

  // se selecionar funcionário, limpamos o período previamente escolhido
  useEffect(() => {
    setAcqId("")
  }, [employeeId]);

  // sugere setor do funcionário
  useEffect(() => {
    if (selectedEmployee && !sectorId && selectedEmployee.sectorId) {
      setSectorId(String(selectedEmployee.sectorId));
    }
  }, [selectedEmployee, sectorId]);

  // EDIÇÃO: pré-seleciona o período salvo (se ainda estiver aberto)
  useEffect(() => {
    if (!vacation || !availableAcq.length) return;

    const vStart = new Date(vacation.acquisitionPeriodStart).toISOString().slice(0, 10);
    const vEnd = new Date(vacation.acquisitionPeriodEnd).toISOString().slice(0, 10);

    const found = availableAcq.find((p: any) => {
      const pStart = new Date(p.startDate).toISOString().slice(0, 10);
      const pEnd = new Date(p.endDate).toISOString().slice(0, 10);
      return pStart === vStart && pEnd === vEnd && String(p.employeeId) === String(vacation.employeeId);
    });

    if (found) setAcqId(String(found.id));
  }, [vacation, availableAcq]);

  // funcionários exibidos na grade (filtra por setor se selecionado)
  const batchEmployees = useMemo(() => {
    const list = (employees ?? []) as any[];
    const filtered = sectorId ? list.filter((e) => String(e.sectorId ?? "") === String(sectorId)) : list;
    return filtered.map((e) => ({
      id: String(e.id),
      name: e.name,
      salary: Number(e.salary ?? 0),
      dangerPay: !!e.dangerPay,
      overtimeAverage: Number(e.overtimeAverage ?? 0),
      // preserva company/sector para o payload
      _companyId: e.companyId,
      _sectorId: e.sectorId,
    }));
  }, [employees, sectorId]);

  // campos da tabela em lote
  const batchFields: BatchTableField[] = useMemo(
    () => [
      {
        key: "acquisitionPeriodId", label: "Período Aquisitivo", type: "select",
      },
      {
        key: "scheduledMonth",
        label: "Mês Programação",
        type: "select",
        options: Array.from({ length: 12 }, (_, i) => ({
          value: String(i + 1),
          label: new Date(year, i).toLocaleDateString("pt-BR", { month: "long" }),
        })),
      },
      { key: "vacationDays", label: "Dias de Férias", type: "number", defaultValue: 30, min: 1, max: 30 },
      { key: "abonoDays", label: "Abono (dias)", type: "number", defaultValue: 0, min: 0, max: 10 },
      { key: "thirteenthAdvance", label: "13º Adiantado", type: "switch", defaultValue: false },
    ],
    [year]
  );

  // submissão (usa valores calculados pelo backend; aqui apenas enviamos dados)
  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isCollective) {
      if (!employeeId || !sectorId || !year || !month || !acqId) return;
      if (!validDays) return;

      const acq = availableAcq.find((a: any) => String(a.id) === acqId);
      const payload: CreateVacationInput = {
        employeeId: Number(employeeId),
        companyId: Number(selectedEmployee?.companyId ?? 0),
        sectorId: Number(sectorId),
        budgetPeriodId: Number(budgetPeriodId ?? 0),
        month: Number(month),
        year: Number(year),
        vacationDays,
        abonoDays,
        thirteenthAdvance,
        status,
        acquisitionPeriodStart: acq?.startDate ?? `${year}-01-01T12:00:00.000Z`,
        acquisitionPeriodEnd: acq?.endDate ?? `${year}-12-31T12:00:00.000Z`,
        baseSalary: computed.baseSalary,
        overtimeAverage: computed.overtimeAverage,
        vacationValue: computed.vacationValue,
        onethirdValue: computed.onethirdValue,
        abonoValue: computed.abonoValue,
        abonoOnethirdValue: computed.abonoOnethirdValue,
      };

      onSave(payload);
      return;
    }

    // === coletivo ===
    if (selectedEmployees.length === 0) return;

    // valida: todos selecionados precisam ter período
    const missing = selectedEmployees.filter((id) => !employeeData[id]?.acquisitionPeriodId);
    if (missing.length) {
      alert("Selecione o período aquisitivo para todos os funcionários selecionados.");
      return;
    }

    const allOpen = (allOpenAcqQ.data ?? []) as any[];

    selectedEmployees.forEach((id) => {
      const row = batchEmployees.find((e: any) => e.id === id);
      if (!row) return;

      const data = employeeData[id] || {};
      const vDays = Number(data.vacationDays ?? 30);
      const aDays = Number(data.abonoDays ?? 0);
      const thirteenth = Boolean(data.thirteenthAdvance);

      if (vDays + aDays > 30) return;

      const acq = allOpen.find((p) => String(p.id) === String(data.acquisitionPeriodId));

      const values = calculateVacationValues(
        { salary: row.salary, dangerPay: row.dangerPay, overtimeAverage: row.overtimeAverage },
        { vacationDays: vDays, abonoDays: aDays, thirteenthAdvance: thirteenth }
      );

      const payload: CreateVacationInput = {
        employeeId: Number(id),
        companyId: Number(row._companyId ?? selectedEmployee?.companyId ?? 0),
        sectorId: Number(row._sectorId ?? sectorId ?? 0),
        budgetPeriodId: Number(budgetPeriodId ?? 0),
        month: Number(data.scheduledMonth || 1),
        year: Number(year),
        vacationDays: vDays,
        abonoDays: aDays,
        thirteenthAdvance: thirteenth,
        status,
        acquisitionPeriodStart: acq?.startDate ?? toMiddayISO(`${year}-01-01`),
        acquisitionPeriodEnd: acq?.endDate ?? toMiddayISO(`${year}-12-31`),
        baseSalary: values.baseSalary,
        overtimeAverage: values.overtimeAverage,
        vacationValue: values.vacationValue,
        onethirdValue: values.onethirdValue,
        abonoValue: values.abonoValue,
        abonoOnethirdValue: values.abonoOnethirdValue,
      };

      onSave(payload);
    });

  };

  // sugere setor do funcionário ao selecioná-lo
  // useEffect(() => {
  //   if (selectedEmployee && !sectorId && selectedEmployee.sectorId) {
  //     setSectorId(String(selectedEmployee.sectorId));
  //   }
  // }, [selectedEmployee, sectorId]);

  // desabilitar selects quando estiver editando
  const isEditing = !!vacation;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={`${isCollective ? "min-w-4/5" : "max-w-5xl"} w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-auto`}>
        <DialogHeader>
          <DialogTitle>{vacation ? "Editar Programação de Férias" : "Nova Programação de Férias"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-6">
          {/* Toggle Coletivo */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={isCollective}
              onCheckedChange={setIsCollective}
              className="cursor-pointer"
              disabled={!!vacation}
            />
            <Label>Lançamento Coletivo (por Equipe/Setor)</Label>
          </div>

          {/* Cabeçalho de seleção */}
          {!isCollective ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Funcionário */}
              <div>
                <Label>Funcionário</Label>
                <Select value={employeeId} onValueChange={setEmployeeId} disabled={isEditing}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o funcionário" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-[--radix-select-trigger-width] max-w-[95vw] max-h-60 overflow-auto"
                  >
                    {(employees ?? []).map((e: any) => (
                      <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Setor */}
              <div>
                <Label>Setor</Label>
                <Select value={sectorId} onValueChange={setSectorId} disabled={isEditing}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-[--radix-select-trigger-width] max-w-[95vw] max-h-60 overflow-auto"
                  >
                    {(sectors ?? []).map((s: any) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl">
              {/* Setor (opcional p/ filtrar a grade) */}
              <div >
                <Label>Setor (opcional para filtrar)</Label>
                <Select value={sectorId} onValueChange={setSectorId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o setor" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-[--radix-select-trigger-width] max-w-[95vw] max-h-60 overflow-auto"
                  >
                    {(sectors ?? []).map((s: any) => (
                      <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div >
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as VacationStatus)}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-[--radix-select-trigger-width] max-w-[95vw] max-h-60 overflow-auto"
                  >
                    <SelectItem value="scheduled">Programado</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="taken">Realizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Período / Mês / Config — Individual */}
          {!isCollective && (
            <>
              {/* Período aquisitivo */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Período Aquisitivo</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Ano (orçamentário)</Label>
                      <Input type="number" value={year} disabled className="bg-gray-100" />
                    </div>
                    <div>
                      <Label>Mês das Férias</Label>
                      <Select value={String(month || "")} onValueChange={(v) => setMonth(parseInt(v, 10))}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o mês" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="w-[--radix-select-trigger-width] max-w-[95vw] max-h-60 overflow-auto"
                        >
                          {Array.from({ length: 12 }).map((_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {new Date(year, i).toLocaleDateString("pt-BR", { month: "long" })}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Período (aberto)</Label>
                      <Select value={acqId} onValueChange={setAcqId} disabled={!employeeId}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={employeeId ? "Selecione um período" : "Selecione o funcionário primeiro"} />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          className="w-[--radix-select-trigger-width] max-w-[95vw] max-h-60 overflow-auto"
                        >
                          {(availableAcq ?? []).map((p: any) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {new Date(p.startDate).toLocaleDateString("pt-BR")} — {new Date(p.endDate).toLocaleDateString("pt-BR")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Configuração */}
              <Card>
                <CardHeader><CardTitle className="text-lg">Configuração das Férias</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Dias de Férias</Label>
                      <Input type="number" min={0} max={30} value={vacationDays} onChange={(e) => setVacationDays(parseInt(e.target.value || "0", 10))} />
                    </div>
                    <div>
                      <Label>Abono (dias)</Label>
                      <Input type="number" min={0} max={10} value={abonoDays} onChange={(e) => setAbonoDays(parseInt(e.target.value || "0", 10))} />
                    </div>
                    <div className="flex items-center gap-2 pt-6">
                      <Switch checked={thirteenthAdvance} onCheckedChange={setThirteenthAdvance} />
                      <Label>Adiantamento de 13º (50%)</Label>
                    </div>
                  </div>

                  {!validDays && (
                    <div className="bg-red-50 border border-red-200 p-3 rounded text-sm text-red-700">
                      ⚠️ O total de dias de férias + abono não pode ultrapassar 30.
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {isCollective && (
            <BatchEditableTable
              employees={batchEmployees}
              fields={batchFields}
              selectedEmployees={selectedEmployees}
              employeeData={employeeData}
              onSelectionChange={setSelectedEmployees}
              onDataChange={(empId, field, value) =>
                setEmployeeData((prev) => ({
                  ...prev,
                  [empId]: { ...(prev[empId] || {}), [field]: value },
                }))
              }
              // períodos por funcionário (somente os do funcionário da linha)
              perRowOptions={{
                acquisitionPeriodId: (emp) =>
                  (allOpenAcqQ.data ?? [])
                    .filter((p: any) => String(p.employeeId) === String(emp.id))
                    .map((p: any) => ({
                      value: String(p.id),
                      label: `${p.year} - ${new Date(p.startDate).toLocaleDateString("pt-BR")} até ${new Date(
                        p.endDate
                      ).toLocaleDateString("pt-BR")}`,
                    })),
              }}
              calculateValues={(emp: any, data: any) =>
                calculateVacationValues(
                  { salary: emp.salary, dangerPay: emp.dangerPay, overtimeAverage: emp.overtimeAverage },
                  {
                    vacationDays: Number(data.vacationDays ?? 30),
                    abonoDays: Number(data.abonoDays ?? 0),
                    thirteenthAdvance: Boolean(data.thirteenthAdvance),
                  }
                )
              }
            />
          )}



          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto cursor-pointer">Cancelar</Button>
            <Button
              type="submit"
              className="w-full sm:w-auto cursor-pointer"
              disabled={
                !isCollective
                  ? (!employeeId || !sectorId || !month || !acqId || !validDays)
                  : selectedEmployees.length === 0
              }
            >
              {vacation ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}