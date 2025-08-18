// FILE: src/app/(private)/vacations/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, DollarSign, Gift } from "lucide-react";

import { useVacations } from "./hooks/useVacations";
import { useVacationCreate } from "./hooks/useVacationCreate";
import { useVacationUpdate } from "./hooks/useVacationUpdate";
import { useVacationDelete } from "./hooks/useVacationDelete";
import { useEmployees } from "../employees/hooks/useEmployees";
import { useSectors } from "../sectors/hooks/useSectors";

import { VacationForm } from "./components/VacationForm";
import { VacationPlanningTable } from "./components/VacationPlanningTable";
import { VacationPaymentTable } from "./components/VacationPaymentTable";
import { VacationSectorView } from "./components/VacationSectorView";
import type { CreateVacationInput, Vacation } from "./types";
import AcquisitionPeriodManager from "./components/AcquisitionPeriodManager";
import { employeeName as getEmployeeName } from "@/lib/employees-utils";
import { useBudgetPeriods } from "../budgetperiods/hooks/useBudgetPeriods";

export function VacationManager() {
  const vacationsQ = useVacations();
  const createM = useVacationCreate();
  const updateM = useVacationUpdate();
  const deleteM = useVacationDelete();

  const employeesQ = useEmployees();
  const sectorsQ = useSectors();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Vacation | null>(null);

  const vacations = vacationsQ.data ?? [];

  // Período em exercício (status open)
  const bpQ = useBudgetPeriods();
  const active = useMemo(() => {
    const list = (bpQ.data ?? []) as any[];
    return list.find((b) => String(b.status).toLowerCase() === "open") ?? null;
  }, [bpQ.data]);

  // Filtra os lançamentos pelo período ativo
  const periodVacations = useMemo(() => {
    if (!active) return [] as Vacation[];
    return vacations.filter((v) => Number(v.budgetPeriodId) === Number(active.id));
  }, [vacations, active]);

  const periodIsClosed = !active || String(active.status).toLowerCase() !== "open";

  const employeeName = (id: number) => getEmployeeName(employeesQ.data ?? [], id);

  const sectors = useMemo(
    () => ((sectorsQ.data ?? []) as any[]).map((s) => ({ id: s.id as number, name: s.name as string })),
    [sectorsQ.data]
  );

  // Cards: calculados APENAS com o período ativo
  const totals = useMemo(() => {
    const list = periodVacations;
    return {
      scheduled: list.filter((v) => v.status === "scheduled").length,
      approved: list.filter((v) => v.status === "approved").length,
      thirteenth: list.filter((v) => v.thirteenthAdvance).length,
      totalValue: list.reduce(
        (acc, v) => acc + (v.vacationValue || 0) + (v.onethirdValue || 0) + (v.abonoValue || 0) + (v.abonoOnethirdValue || 0),
        0
      ),
    };
  }, [periodVacations]);

  const onSave = (data: CreateVacationInput) => {
    if (editing) {
      updateM.mutate({ id: editing.id, ...data });
    } else {
      createM.mutate(data);
    }
    setShowForm(false);
    setEditing(null);
  };

  const onEdit = (v: Vacation) => {
    setEditing(v);
    setShowForm(true);
  };

  const onDelete = (id: string) => {
    if (!confirm("Excluir esta programação de férias?")) return;
    deleteM.mutate(id);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Lançamento de Férias</h1>
          <p className="text-gray-600 text-sm md:text-base">
            {active ? `Período em exercício: ${active.year}` : "Nenhum período em exercício"}
          </p>
        </div>
        <Button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="gap-2 w-full md:w-auto cursor-pointer"
          disabled={periodIsClosed}
          title={periodIsClosed ? "Período fechado: cadastros desabilitados" : "Novo lançamento"}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Programação de Férias</span>
          <span className="sm:hidden">Nova Programação</span>
        </Button>
      </div>

      {/* Cards resumidos — sempre do período ativo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">Férias Programadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totals.scheduled}</div>
            <p className="text-xs text-muted-foreground">Funcionários com férias agendadas</p>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">Férias Aprovadas</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totals.approved}</div>
            <p className="text-xs text-muted-foreground">Férias aprovadas para pagamento</p>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">13º Adiantado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">{totals.thirteenth}</div>
            <p className="text-xs text-muted-foreground">Com adiantamento de 13º</p>
          </CardContent>
        </Card>

        <Card className="rounded-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-sm font-medium">Total Valores</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">
              R$ {totals.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">Somente do período em exercício</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="planning" className="space-y-0">
        <TabsList className="grid w-full grid-cols-5 rounded-none">
          <TabsTrigger value="planning" className="text-xs md:text-sm cursor-pointer rounded-none">Programação</TabsTrigger>
          <TabsTrigger value="acquisition" className="text-xs md:text-sm cursor-pointer rounded-none">Períodos</TabsTrigger>
          <TabsTrigger value="thirteenth" className="text-xs md:text-sm cursor-pointer rounded-none">13º Salário</TabsTrigger>
          <TabsTrigger value="abono" className="text-xs md:text-sm cursor-pointer rounded-none">Abono</TabsTrigger>
          <TabsTrigger value="sectors" className="text-xs md:text-sm cursor-pointer rounded-none">Por Setor</TabsTrigger>
        </TabsList>

        <TabsContent value="planning" className="rounded-none">
          <VacationPlanningTable
            vacations={periodVacations}
            onEdit={onEdit}
            onDelete={onDelete}
            employeeName={employeeName}
            periodIsClosed={periodIsClosed}
          />
        </TabsContent>

        <TabsContent value="acquisition">
          <AcquisitionPeriodManager />
        </TabsContent>

        <TabsContent value="thirteenth">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                13º Salário nas Férias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VacationPaymentTable
                vacations={periodVacations.filter((v) => v.thirteenthAdvance)}
                type="thirteenth"
                employeeName={employeeName}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abono">
          <Card className="rounded-none">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Abono de Férias (1/3) + Dias Vendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VacationPaymentTable
                vacations={periodVacations.filter((v) => (v.abonoDays || 0) > 0)}
                type="abono"
                employeeName={employeeName}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sectors">
          <VacationSectorView
            vacations={periodVacations}
            onEdit={onEdit}
            onDelete={onDelete}
            employeeName={employeeName}
            sectors={sectors}
            periodIsClosed={periodIsClosed}
          />
        </TabsContent>
      </Tabs>

      {showForm && (
        <VacationForm
          vacation={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSave={onSave}
        />
      )}
    </div>
  );
}