// FILE: src/app/(private)/vacations/components/AcquisitionPeriodForm.tsx
"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  AcquisitionPeriod,
  CreateAcquisitionPeriodInput,
  UpdateAcquisitionPeriodInput,
} from "../types";

type EmployeeOpt = { id: string; name: string; admission?: string };

interface AcquisitionPeriodFormProps {
  period?: AcquisitionPeriod | null;
  employees: EmployeeOpt[];
  onClose: () => void;
  onSave: (data: CreateAcquisitionPeriodInput | UpdateAcquisitionPeriodInput) => void;
}

function toInputDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function toMiddayISO(dateStr: string) {
  // "YYYY-MM-DD" -> "YYYY-MM-DDT12:00:00.000Z"
  return `${dateStr}T12:00:00.000Z`;
}

// calcula o fim = início + 1 ano - 1 dia
function calcEndDateStr(start: string) {
  if (!start) return "";
  const d = new Date(`${start}T12:00:00.000Z`);
  d.setUTCFullYear(d.getUTCFullYear() + 1);
  d.setUTCDate(d.getUTCDate() - 1);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function AcquisitionPeriodForm({ period, employees, onClose, onSave }: AcquisitionPeriodFormProps) {
  const [form, setForm] = useState({
    employeeId: period?.employeeId ? String(period.employeeId) : "",
    startDate: toInputDate(period?.startDate),
    endDate: toInputDate(period?.endDate),
    year: period?.year ?? new Date().getFullYear(),
  });

  const selected = useMemo(
    () => employees.find((e) => String(e.id) === String(form.employeeId)),
    [employees, form.employeeId]
  );

  const onChangeStart = (value: string) => {
    setForm((f) => ({ ...f, startDate: value, endDate: calcEndDateStr(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: period?.id,
      employeeId: Number(form.employeeId),
      startDate: toMiddayISO(form.startDate),
      endDate: toMiddayISO(form.endDate || calcEndDateStr(form.startDate)),
      year: Number(form.year),
      status: period?.status ?? "open",
    };

    onSave(payload as any);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{period ? "Editar Período Aquisitivo" : "Novo Período Aquisitivo"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="employeeId">Funcionário</Label>
            <Select
              value={form.employeeId}
              onValueChange={(v) => setForm((f) => ({ ...f, employeeId: v }))}
            >
              <SelectTrigger><SelectValue placeholder="Selecione o funcionário" /></SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e.id} value={String(e.id)}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Dados do Funcionário</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Nome:</span><p className="font-medium">{selected.name}</p></div>
                {selected.admission && (
                  <div>
                    <span className="text-gray-500">Admissão:</span>
                    <p className="font-medium">{selected.admission}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="year">Ano do Período</Label>
              <Input
                id="year"
                type="number"
                value={form.year}
                onChange={(e) => setForm((f) => ({ ...f, year: parseInt(e.target.value || "0", 10) }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="startDate">Data Início</Label>
              <Input
                id="startDate"
                type="date"
                value={form.startDate}
                onChange={(e) => onChangeStart(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data Fim (automática)</Label>
              <Input id="endDate" type="date" value={form.endDate} readOnly className="bg-gray-100" />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-sm text-blue-700 space-y-1">
            <p>• O período aquisitivo é de 12 meses (fim = início + 1 ano − 1 dia).</p>
            <p>• Se este período for usado em uma programação de férias, ele será marcado como <b>Utilizado</b>.</p>
            <p>• Para <b>reabrir</b> um período utilizado, primeiro reabra/cancele a programação de férias que o está usando.</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancelar</Button>
            <Button type="submit" className="w-full sm:w-auto">{period ? "Atualizar" : "Cadastrar"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}