// FILE: src/app/(private)/overtimes/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Clock, TrendingUp, DollarSign, AlertTriangle } from "lucide-react";
import { useOvertimes } from "./hooks/useOvertimes";
import { useOvertimeCreate } from "./hooks/useOvertimeCreate";
import { useOvertimeUpdate } from "./hooks/useOvertimeUpdate";
import { useOvertimeDelete } from "./hooks/useOvertimeDelete";
import { OvertimeFormNew } from "./components/OvertimeFormNew";
import { OvertimeTableNew } from "./components/OvertimeTableNew";
import { OvertimeSectorAnalysis } from "./components/OvertimeSectorAnalysis";
import { useEmployees } from "../employees/hooks/useEmployees";
import { useCostCenters } from "../costcenters/hooks/useCostCenters";

export default function OvertimeManager() {
    const overQ = useOvertimes();
    const create = useOvertimeCreate();
    const update = useOvertimeUpdate();
    const del = useOvertimeDelete();

    const empQ = useEmployees();
    const ccQ = useCostCenters();

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);

    if (overQ.isLoading || empQ.isLoading || ccQ.isLoading) return <p>Carregando...</p>;
    if (overQ.error || empQ.error || ccQ.error) return <p>Erro ao carregar dados</p>;

    const entries = overQ.data ?? [];
    const employees = empQ.data ?? [];
    const costCenters = ccQ.data?.map(cc => ({ id: Number(cc.id), name: `${cc.code} — ${cc.name}` })) ?? [];

    const employeeName = (id: number) => employees.find(e => Number(e.id) === Number(id))?.name ?? "—";
    const costCenterName = (id: number) => ccQ.data?.find(c => Number(c.id) === Number(id))?.name ?? "—";

    const onSave = (payload: any) => {
        if (editing?.id) update.mutate({ id: editing.id, ...payload });
        else create.mutate(payload);
        setShowForm(false);
        setEditing(null);
    };

    const onDelete = (id: number | string) => {
        if (confirm("Deseja realmente excluir este lançamento?")) del.mutate(id);
    };

    const totalBudgeted = entries.reduce((a, e) => a + (e.budgetedAmount ?? 0), 0);
    const totalActual = entries.reduce((a, e) => a + (e.totalValue ?? 0), 0);
    const totalVariance = totalActual - totalBudgeted;
    const variancePercentage = totalBudgeted > 0 ? (totalVariance / totalBudgeted) * 100 : 0;
    const openCount = entries.filter(e => e.status === "open").length;
    const closedCount = entries.filter(e => e.status === "closed").length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestão de Horas Extras</h1>
                    <p className="text-muted-foreground">Controle de horas extras e DSR com análise orçamentária</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus className="h-4 w-4" /> Novo Lançamento
                </Button>
            </div>

            {/* cards resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lançamentos Abertos</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{openCount}</div>
                        <p className="text-xs text-muted-foreground">{closedCount} fechados</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orçado vs Realizado</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">R$ {totalActual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground">Orçado: R$ {totalBudgeted.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Variação Orçamentária</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${totalVariance >= 0 ? "text-red-600" : "text-green-600"}`}>
                            {(totalVariance >= 0 ? "+" : "")}R$ {totalVariance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {(variancePercentage >= 0 ? "+" : "")}{variancePercentage.toFixed(1)}% do orçado
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-600">
                            {entries.filter(e => (e.variancePercentage ?? 0) > 15).length}
                        </div>
                        <p className="text-xs text-muted-foreground">Variação acima de 15%</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="entries" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="entries">Lançamentos</TabsTrigger>
                    <TabsTrigger value="analysis">Análise por Centro de Custo</TabsTrigger>
                </TabsList>

                <TabsContent value="entries">
                    <OvertimeTableNew
                        entries={entries}
                        onEdit={(e) => { setEditing(e); setShowForm(true); }}
                        onDelete={onDelete}
                        employeeName={employeeName}
                    />
                </TabsContent>

                <TabsContent value="analysis">
                    <OvertimeSectorAnalysis
                        entries={entries}
                        sectorOptions={costCenters}
                        employeeName={employeeName}
                    />
                </TabsContent>
            </Tabs>

            {showForm && (
                <OvertimeFormNew
                    entry={editing}
                    onClose={() => { setShowForm(false); setEditing(null); }}
                    onSave={onSave}
                />
            )}
        </div>
    );
}