// FILE: src/app/(private)/budgetperiods/components/BudgetPeriodForm.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BudgetPeriod, CreateBudgetPeriodInput, UpdateBudgetPeriodInput } from "../types";

type CompanyOpt = { id: string; corporateName: string };

interface BudgetPeriodFormProps {
  period?: BudgetPeriod | null;
  companies: CompanyOpt[];
  onClose: () => void;
  onSave: (data: CreateBudgetPeriodInput | UpdateBudgetPeriodInput) => void;
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

export const BudgetPeriodForm = ({ period, companies, onClose, onSave }: BudgetPeriodFormProps) => {
  const [formData, setFormData] = useState({
    year: period?.year ?? new Date().getFullYear() + 1,
    companyId: period?.companyId ? String(period.companyId) : "",
    startDate: toInputDate(period?.startDate),
    endDate: toInputDate(period?.endDate),
    description: period?.description ?? "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDate = formData.startDate || `${formData.year}-01-01`;
    const endDate = formData.endDate || `${formData.year}-12-31`;

    const payload = {
      id: period?.id,
      year: Number(formData.year),
      companyId: Number(formData.companyId),
      startDate: toMiddayISO(startDate),
      endDate: toMiddayISO(endDate),
      description: formData.description || `Período Orçamentário ${formData.year}`,
      status: period?.status ?? "open",
    };

    onSave(payload as any);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{period ? "Editar Período Orçamentário" : "Novo Período Orçamentário"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Ano do Período</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value || "0", 10) })}
                // sem min/max (liberado p/ qualquer ano)
                required
              />
            </div>

            <div>
              <Label htmlFor="companyId">Empresa</Label>
              <Select
                value={formData.companyId}
                onValueChange={(value) => setFormData({ ...formData, companyId: value })}
              >
                <SelectTrigger><SelectValue placeholder="Selecione a empresa" /></SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>{c.corporateName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição do Período</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={`Período Orçamentário ${formData.year}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Deixe em branco para usar 01/01/{formData.year}</p>
            </div>

            <div>
              <Label htmlFor="endDate">Data de Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">Deixe em branco para usar 31/12/{formData.year}</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Informações Importantes</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Só é possível ter um período aberto por vez</li>
              <li>• Todos os lançamentos orçamentários serão vinculados ao período ativo</li>
              <li>• Após fechar um período, não será possível editá-lo</li>
              <li>• Um novo período só pode ser criado após fechar o anterior</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{period ? "Atualizar" : "Criar Período"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};