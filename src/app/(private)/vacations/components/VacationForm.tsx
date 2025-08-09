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

// hooks existentes nos módulos anteriores (troque se o caminho do seu projeto for outro)
import { useEmployees } from "../../employees/hooks/useEmployees";
import { useSectors } from "../../sectors/hooks/useSectors";
import { useAcquisitionPeriods } from "../hooks/useAcquisitionPeriods"; // do módulo que você moveu p/ vacations

interface Props {
  vacation?: Vacation | null;
  onClose: () => void;
  onSave: (data: CreateVacationInput) => void;
}

// util para evitar “-1 dia” (meio-dia UTC)
const toMiddayISO = (yyyy_mm_dd: string) => `${yyyy_mm_dd}T12:00:00.000Z`;

export function VacationForm({ vacation, onClose, onSave }: Props) {
  const employeesQ = useEmployees();
  const sectorsQ = useSectors();

  const [employeeId, setEmployeeId] = useState<string>(vacation ? String(vacation.employeeId) : "");
  const [sectorId, setSectorId] = useState<string>(vacation ? String(vacation.sectorId) : "");
  const [year, setYear] = useState<number>(vacation?.year ?? new Date().getFullYear());
  const [month, setMonth] = useState<number>(vacation?.month ?? 0);
  const [vacationDays, setVacationDays] = useState<number>(vacation?.vacationDays ?? 30);
  const [abonoDays, setAbonoDays] = useState<number>(vacation?.abonoDays ?? 0);
  const [thirteenthAdvance, setThirteenthAdvance] = useState<boolean>(vacation?.thirteenthAdvance ?? false);
  const [status, setStatus] = useState<VacationStatus>(vacation?.status ?? "scheduled");
  const [acqId, setAcqId] = useState<string>("");

  // períodos aquisitivos reais do funcionário selecionado
  const acqQ = useAcquisitionPeriods({ employeeId: employeeId ? Number(employeeId) : undefined });

  const employees = employeesQ.data ?? [];
  const sectors = sectorsQ.data ?? [];

  const selectedEmployee = useMemo(
    () => employees.find((e: any) => String(e.id) === employeeId),
    [employees, employeeId]
  );

  const availableAcq = useMemo(() => {
    const list = acqQ.data ?? [];
    return list.filter((p: any) => p.status === "open");
  }, [acqQ.data]);

  // validação simples
  const validDays = vacationDays + abonoDays <= 30;

  // submissão (usa valores calculados pelo backend; aqui apenas enviamos dados)
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId || !sectorId || !year || !month || !acqId) return;
    if (!validDays) return;

    const acq = availableAcq.find((a: any) => String(a.id) === acqId);
    const payload: CreateVacationInput = {
      employeeId: Number(employeeId),
      companyId: Number(selectedEmployee?.companyId ?? 0),
      sectorId: Number(sectorId),
      month: Number(month),
      year: Number(year),
      vacationDays,
      abonoDays,
      thirteenthAdvance,
      status,

      // datas (ISO completas)
      acquisitionPeriodStart: acq?.startDate
        ? acq.startDate
        : toMiddayISO(`${year}-01-01`),
      acquisitionPeriodEnd: acq?.endDate
        ? acq.endDate
        : toMiddayISO(`${year}-12-31`),

      // numéricos (backend pode recalcular)
      baseSalary: Number(vacation?.baseSalary ?? 0),
      overtimeAverage: Number(vacation?.overtimeAverage ?? 0),
      vacationValue: Number(vacation?.vacationValue ?? 0),
      onethirdValue: Number(vacation?.onethirdValue ?? 0),
      abonoValue: Number(vacation?.abonoValue ?? 0),
      abonoOnethirdValue: Number(vacation?.abonoOnethirdValue ?? 0),

      createdAt: new Date().toISOString(), // ignorado pelo backend se ele setar
      updatedAt: new Date().toISOString(),
    };

    onSave(payload);
  };

  // sugere setor do funcionário ao selecioná-lo
  useEffect(() => {
    if (selectedEmployee && !sectorId && selectedEmployee.sectorId) {
      setSectorId(String(selectedEmployee.sectorId));
    }
  }, [selectedEmployee, sectorId]);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>{vacation ? "Editar Programação de Férias" : "Nova Programação de Férias"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Funcionário */}
            <div>
              <Label>Funcionário</Label>
              <Select value={employeeId} onValueChange={setEmployeeId}>
                <SelectTrigger><SelectValue placeholder="Selecione o funcionário" /></SelectTrigger>
                <SelectContent>
                  {employees.map((e: any) => (
                    <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Setor */}
            <div>
              <Label>Setor</Label>
              <Select value={sectorId} onValueChange={setSectorId}>
                <SelectTrigger><SelectValue placeholder="Selecione o setor" /></SelectTrigger>
                <SelectContent>
                  {sectors.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Período aquisitivo */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Período Aquisitivo</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Ano (orçamentário)</Label>
                  <Input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value || "0", 10))} />
                </div>
                <div>
                  <Label>Mês das Férias</Label>
                  <Select value={String(month || "")} onValueChange={(v) => setMonth(parseInt(v, 10))}>
                    <SelectTrigger><SelectValue placeholder="Selecione o mês" /></SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {new Date(year, i).toLocaleDateString("pt-BR", { month: "long" })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Período Aquisitivo (aberto)</Label>
                  <Select value={acqId} onValueChange={setAcqId} disabled={!employeeId}>
                    <SelectTrigger><SelectValue placeholder={employeeId ? "Selecione um período" : "Selecione o funcionário primeiro"} /></SelectTrigger>
                    <SelectContent>
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

          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as VacationStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="scheduled">Programado</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="taken">Realizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancelar</Button>
            <Button type="submit" className="w-full sm:w-auto" disabled={!employeeId || !sectorId || !month || !acqId || !validDays}>
              {vacation ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}