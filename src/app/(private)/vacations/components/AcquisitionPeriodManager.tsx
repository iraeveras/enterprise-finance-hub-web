// FILE: src/app/(private)/acquisitionperiods/compoents/AcquisitionPeriodManager.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { useAcquisitionPeriods } from "../hooks/useAcquisitionPeriods";
import { useAcquisitionPeriodCreate } from "../hooks/useAcquisitionPeriodCreate";
import { useAcquisitionPeriodUpdate } from "../hooks/useAcquisitionPeriodUpdate";
import { useAcquisitionPeriodDelete } from "../hooks/useAcquisitionPeriodDelete";
import { useEmployees } from "../../employees/hooks/useEmployees"; // já existe nos módulos anteriores
import { AcquisitionPeriodForm } from "../components/AcquisitionPeriodForm";
import { AcquisitionPeriodTable } from "../components/AcquisitionPeriodTable";
import type {
  AcquisitionPeriod,
  CreateAcquisitionPeriodInput,
  UpdateAcquisitionPeriodInput,
} from "../types";
import { toast } from "sonner";

export default function AcquisitionPeriodManager() {
  const periodsQ = useAcquisitionPeriods();
  const createM = useAcquisitionPeriodCreate();
  const updateM = useAcquisitionPeriodUpdate();
  const delM    = useAcquisitionPeriodDelete();
  const employeesQ = useEmployees();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AcquisitionPeriod | null>(null);

  // paginação
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const periods = periodsQ.data ?? [];
  const total = periods.length;
  const start = (page - 1) * pageSize;
  const pageItems = useMemo(() => periods.slice(start, start + pageSize), [periods, start, pageSize]);

  const employees = (employeesQ.data ?? []).map((e: any) => ({
    id: String(e.id),
    name: e.name,
    admission: e.admission ? new Date(e.admission).toLocaleDateString("pt-BR") : undefined,
  }));

  const employeeName = (employeeId: number) => {
    const found = employees.find((e) => Number(e.id) === Number(employeeId));
    return found?.name ?? "Funcionário";
  };

  const onSave = (data: CreateAcquisitionPeriodInput | UpdateAcquisitionPeriodInput) => {
    if (editing) {
      updateM.mutate({ ...(data as any), id: editing.id });
    } else {
      // criação sempre inicia como "open"
      createM.mutate({ ...(data as any), status: "open" });
    }
    setShowForm(false);
    setEditing(null);
  };

  const onClose = (id: string) => {
    if (!confirm("Fechar este período aquisitivo?")) return;
    updateM.mutate({ id, status: "closed" });
  };

  const onReopen = (p: AcquisitionPeriod) => {
    // Regra: se está UTILIZADO (used), primeiro deve reabrir/cancelar a férias que o usa.
    if (p.status === "used" || (p.vacationsCount ?? 0) > 0) {
      toast.info("Este período está vinculado a férias programadas. Reabra/cancele a programação de férias que utiliza este período antes de reabrí-lo.");
      return;
    }
    updateM.mutate({ id: p.id, status: "open" });
  };

  return (
    <ProtectedPage>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Períodos Aquisitivos de Férias</h2>
            <p className="text-gray-600 text-sm md:text-base">Gerencie os períodos aquisitivos dos funcionários</p>
          </div>
          <Button onClick={() => { setEditing(null); setShowForm(true); }} className="gap-2 w-full md:w-auto">
            <Plus className="h-4 w-4" />
            Novo Período Aquisitivo
          </Button>
        </div>

        {/* Cards simples com contagens */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardHeader><CardTitle className="text-sm font-medium">Abertos</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{periods.filter(p => p.status==="open").length}</div></CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">Utilizados</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{periods.filter(p => p.status==="used").length}</div></CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="text-sm font-medium">Total</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{total}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Lista de Períodos Aquisitivos</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <AcquisitionPeriodTable
                periods={pageItems}
                total={total}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                employeeName={employeeName}
                onEdit={(p) => { setEditing(p); setShowForm(true); }}
                onClose={onClose}
                onReopen={onReopen}
              />
            </div>
          </CardContent>
        </Card>

        {showForm && (
          <AcquisitionPeriodForm
            period={editing}
            employees={employees}
            onClose={() => { setShowForm(false); setEditing(null); }}
            onSave={onSave}
          />
        )}
      </div>
    </ProtectedPage>
  );
}