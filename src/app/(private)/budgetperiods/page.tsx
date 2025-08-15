// FILE: src/app/(private)/budgetperiods/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar } from "lucide-react";
import { BudgetPeriodForm } from "./components/BudgetPeriodForm";
import { BudgetPeriodTable } from "./components/BudgetPeriodTable";
import { useBudgetPeriods } from "./hooks/useBudgetPeriods";
import { useBudgetPeriodCreate } from "./hooks/useBudgetPeriodCreate";
import { useBudgetPeriodUpdate } from "./hooks/useBudgetPeriodUpdate";
import { useCompanies } from "../companies/hooks/useCompanies";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import { useAuth } from "@/context/AuthContext";
import type { BudgetPeriod, CreateBudgetPeriodInput, UpdateBudgetPeriodInput } from "./types";

function hasOpenPeriod(periods: BudgetPeriod[]) {
    return periods.some((p) => p.status === "open");
}

export default function BudgetPeriodManager() {
    const { user } = useAuth();
    const periodsQ = useBudgetPeriods();
    const createM = useBudgetPeriodCreate();
    const updateM = useBudgetPeriodUpdate();
    const companiesQ = useCompanies();

    const [selected, setSelected] = useState<BudgetPeriod | null>(null);
    const [openForm, setOpenForm] = useState(false);

    const periods = periodsQ.data ?? [];
    const companies = (companiesQ.data ?? []).map((c) => ({ id: c.id, corporateName: c.corporateName }));

    const openCurrent = useMemo(() => periods.find((p) => p.status === "open"), [periods]);

    const handleNew = () => {
        if (hasOpenPeriod(periods)) {
            alert("Existe um período em aberto. Feche o período atual antes de criar um novo.");
            return;
        }
        setSelected(null);
        setOpenForm(true);
    };

    const handleEdit = (p: BudgetPeriod) => {
        if (p.status === "closed") {
            alert("Não é possível editar um período fechado.");
            return;
        }
        setSelected(p);
        setOpenForm(true);
    };

    const handleClose = (id: string) => {
        if (!confirm("Tem certeza que deseja fechar este período? Esta ação não pode ser desfeita.")) return;
        updateM.mutate({
            id,
            status: "closed",
            closedBy: user?.name ?? "Sistema",
            closedAt: new Date().toISOString(),
        });
    };

    const handleReopen = (id: string) => {
        if (!confirm("Tem certeza que deseja reabrir este período?")) return;
        updateM.mutate({
            id,
            status: "open",
            closedBy: null,
            closedAt: null,
        });
    };

    const handleSave = (data: CreateBudgetPeriodInput | UpdateBudgetPeriodInput) => {
        if (selected) {
            updateM.mutate({ ...(data as any), id: selected.id });
        } else {
            // garante status "open" na criação
            createM.mutate({ ...(data as any), status: "open" });
        }
        setOpenForm(false);
        setSelected(null);
    };

    return (
        <ProtectedPage>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Períodos Orçamentários</h1>
                        <p className="text-gray-600">Gestão de períodos para controle orçamentário</p>
                    </div>
                    <Button onClick={handleNew} className="flex items-center gap-2 cursor-pointer">
                        <PlusCircle className="w-4 h-4" />
                        Novo Período
                    </Button>
                </div>

                {openCurrent && (
                    <Card className="border-green-200 bg-green-50 rounded-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-800">
                                <Calendar className="w-5 h-5" />
                                Período Atual Ativo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <span className="text-sm text-green-600">Período:</span>
                                    <p className="font-medium">{openCurrent.description}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-green-600">Ano:</span>
                                    <p className="font-medium">{openCurrent.year}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-green-600">Vigência:</span>
                                    <p className="font-medium">
                                        {new Date(openCurrent.startDate).toLocaleDateString("pt-BR")} até{" "}
                                        {new Date(openCurrent.endDate).toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-green-600">Status:</span>
                                    <div className="mt-1">
                                        <span className="inline-block rounded bg-green-100 text-green-800 px-2 py-1 text-xs">Aberto</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card className="rounded-none">
                    <CardHeader>
                        <CardTitle>
                            Histórico de Períodos ({periods.length})
                            {periodsQ.isLoading && <span className="ml-2 text-xs text-gray-400">Carregando...</span>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <BudgetPeriodTable
                                periods={periods}
                                onEdit={handleEdit}
                                onClose={handleClose}
                                onReopen={handleReopen}
                            />
                        </div>
                    </CardContent>
                </Card>

                {openForm && (
                    <BudgetPeriodForm
                        period={selected}
                        companies={companies}
                        onClose={() => setOpenForm(false)}
                        onSave={handleSave}
                    />
                )}
            </div>
        </ProtectedPage>
    );
}