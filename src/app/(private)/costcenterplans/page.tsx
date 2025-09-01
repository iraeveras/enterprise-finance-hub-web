// FILE: src/app/(private)/costcenterplans/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, FileDown, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import PlanSection from "./components/PlanSection";
import GenericTable from "./components/GenericTable";
import { CostCenterPlanForm } from "./components/CostCenterPlanForm";
import { CostCenterPlanItemForm } from "./components/CostCenterPlanItemForm";
import { ExpenseTypeForm } from "./components/ExpenseTypeForm";
import { ExpenseSubtypeForm } from "./components/ExpenseSubtypeForm";

import type { CostCenterPlan, CostCenterPlanItem, ExpenseType, ExpenseSubtype } from "./types";

import { useCostCenterPlans } from "./hooks/useCostCenterPlans";
import { useCostCenterPlanCreate } from "./hooks/useCostCenterPlanCreate";
import { useCostCenterPlanUpdate } from "./hooks/useCostCenterPlanUpdate";
import { useCostCenterPlanDelete } from "./hooks/useCostCenterPlanDelete";

import { useCostCenterPlanItems } from "./hooks/useCostCenterPlanItems";
import { useCostCenterPlanItemCreate } from "./hooks/useCostCenterPlanItemCreate";
import { useCostCenterPlanItemUpdate } from "./hooks/useCostCenterPlanItemUpdate";
import { useCostCenterPlanItemDelete } from "./hooks/useCostCenterPlanItemDelete";

import { useExpenseTypes } from "./hooks/useExpenseTypes";
import { useExpenseTypeCreate } from "./hooks/useExpenseTypeCreate";
import { useExpenseTypeUpdate } from "./hooks/useExpenseTypeUpdate";
import { useExpenseTypeDelete } from "./hooks/useExpenseTypeDelete";

import { useExpenseSubtypes } from "./hooks/useExpenseSubtypes";
import { useExpenseSubtypeCreate } from "./hooks/useExpenseSubtypeCreate";
import { useExpenseSubtypeUpdate } from "./hooks/useExpenseSubtypeUpdate";
import { useExpenseSubtypeDelete } from "./hooks/useExpenseSubtypeDelete";

import { useCompanies } from "@/app/(private)/companies/hooks/useCompanies";
import type { Company } from "@/app/(private)/companies/types";

export default function CostCenterPlanManager() {
    const [search, setSearch] = useState("");

    // ---- PLANS
    const plansQ = useCostCenterPlans({ search });
    const createPlan = useCostCenterPlanCreate();
    const updatePlan = useCostCenterPlanUpdate();
    const deletePlan = useCostCenterPlanDelete();

    // ---- ITEMS
    const itemsQ = useCostCenterPlanItems({});
    const createItem = useCostCenterPlanItemCreate();
    const updateItem = useCostCenterPlanItemUpdate();
    const deleteItem = useCostCenterPlanItemDelete();

    // ---- TYPES
    const typesQ = useExpenseTypes({});
    const createType = useExpenseTypeCreate();
    const updateType = useExpenseTypeUpdate();
    const deleteType = useExpenseTypeDelete();

    // ---- SUBTYPES
    const subtypesQ = useExpenseSubtypes({});
    const createSubtype = useExpenseSubtypeCreate();
    const updateSubtype = useExpenseSubtypeUpdate();
    const deleteSubtype = useExpenseSubtypeDelete();

    // ---- COMPANIES (para exibir corporateName)
    const companiesQ = useCompanies();
    const companyNameById = useMemo(() => {
        const map = new Map<number, string>();
        (companiesQ.data ?? []).forEach((c: Company) => {
            const idNum = typeof c.id === "string" ? Number(c.id) : (c.id as unknown as number);
            map.set(idNum, c.corporateName);
        });
        return map;
    }, [companiesQ.data]);

    const [showPlanForm, setShowPlanForm] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [showTypeForm, setShowTypeForm] = useState(false);
    const [showSubtypeForm, setShowSubtypeForm] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState<CostCenterPlan | null>(null);
    const [selectedItem, setSelectedItem] = useState<CostCenterPlanItem | null>(null);
    const [selectedType, setSelectedType] = useState<ExpenseType | null>(null);
    const [selectedSubtype, setSelectedSubtype] = useState<ExpenseSubtype | null>(null);

    const [prefillPlanId, setPrefillPlanId] = useState<string | number | undefined>(undefined);
    const [prefillItemId, setPrefillItemId] = useState<string | number | undefined>(undefined);
    const [prefillTypeId, setPrefillTypeId] = useState<string | number | undefined>(undefined);

    const plans = plansQ.data ?? [];
    const items = itemsQ.data ?? [];
    const types = typesQ.data ?? [];
    const subtypes = subtypesQ.data ?? [];

    const filteredPlans = useMemo(() => {
        if (!search) return plans;
        const s = search.toLowerCase();
        return plans.filter(
            (p) =>
                p.nomePlanoCentroCusto.toLowerCase().includes(s) ||
                p.codPlanoCentroCusto.toLowerCase().includes(s)
        );
    }, [plans, search]);

    // Helpers to map relations
    const itemsForPlan = (planId: string | number) =>
        items.filter((i) => Number(i.planoCentroCustoId) === Number(planId));
    const typesForItem = (itemId: string | number) =>
        types.filter((t) => Number(t.planoCentroCustoItemId) === Number(itemId));
    const subtypesForType = (typeId: string | number) =>
        subtypes.filter((s) => Number(s.tipoDespesaId) === Number(typeId));

    // Available options for forms
    const availablePlans = plans.map((p) => ({
        id: p.id,
        name: p.nomePlanoCentroCusto,
        code: p.codPlanoCentroCusto,
    }));
    const availableItems = items.map((i) => ({
        id: i.id,
        name: i.nomePlanoCentroCustoItem,
        code: i.codPlanoCentroCustoItem,
    }));
    const availableTypes = types.map((t) => ({
        id: t.id,
        name: t.nomeTipoDespesa,
        code: t.codTipoDespesa,
    }));

    // Handlers (CRUD)
    const handleNewPlan = () => {
        setSelectedPlan(null);
        setShowPlanForm(true);
    };
    const handleEditPlan = (plan: CostCenterPlan) => {
        setSelectedPlan(plan);
        setShowPlanForm(true);
    };
    const handleDeletePlan = (plan: CostCenterPlan) => {
        if (confirm("Excluir este plano de centro de custo?"))
            deletePlan.mutate(Number(plan.id));
    };

    const handleSavePlan = (data: any) => {
        if (selectedPlan) updatePlan.mutate({ id: Number(selectedPlan.id), data });
        else createPlan.mutate(data);
        setShowPlanForm(false);
        setSelectedPlan(null);
    };

    const handleNewItem = (planId?: string | number) => {
        setSelectedItem(null);
        setPrefillPlanId(planId);
        setShowItemForm(true);
    };
    const handleEditItem = (item: CostCenterPlanItem) => {
        setSelectedItem(item);
        setPrefillPlanId(undefined);
        setShowItemForm(true);
    };
    const handleDeleteItem = (item: CostCenterPlanItem) => {
        if (confirm("Excluir este item de plano?")) deleteItem.mutate(Number(item.id));
    };
    const handleSaveItem = (data: any) => {
        if (selectedItem) updateItem.mutate({ id: Number(selectedItem.id), data });
        else createItem.mutate(data);
        setShowItemForm(false);
        setSelectedItem(null);
        setPrefillPlanId(undefined);
    };

    const handleNewExpenseType = (itemId?: string | number) => {
        setSelectedType(null);
        setPrefillItemId(itemId);
        setShowTypeForm(true);
    };
    const handleEditExpenseType = (type: ExpenseType) => {
        setSelectedType(type);
        setPrefillItemId(undefined);
        setShowTypeForm(true);
    };
    const handleDeleteExpenseType = (type: ExpenseType) => {
        if (confirm("Excluir este tipo de despesa?")) deleteType.mutate(Number(type.id));
    };
    const handleSaveExpenseType = (data: any) => {
        if (selectedType) updateType.mutate({ id: Number(selectedType.id), data });
        else createType.mutate(data);
        setShowTypeForm(false);
        setSelectedType(null);
        setPrefillItemId(undefined);
    };

    const handleNewExpenseSubtype = (typeId?: string | number) => {
        setSelectedSubtype(null);
        setPrefillTypeId(typeId);
        setShowSubtypeForm(true);
    };
    const handleEditExpenseSubtype = (subtype: ExpenseSubtype) => {
        setSelectedSubtype(subtype);
        setPrefillTypeId(undefined);
        setShowSubtypeForm(true);
    };
    const handleDeleteExpenseSubtype = (subtype: ExpenseSubtype) => {
        if (confirm("Excluir este subtipo de despesa?"))
            deleteSubtype.mutate(Number(subtype.id));
    };
    const handleSaveExpenseSubtype = (data: any) => {
        if (selectedSubtype) updateSubtype.mutate({ id: Number(selectedSubtype.id), data });
        else createSubtype.mutate(data);
        setShowSubtypeForm(false);
        setSelectedSubtype(null);
        setPrefillTypeId(undefined);
    };

    const loading =
        plansQ.isLoading ||
        itemsQ.isLoading ||
        typesQ.isLoading ||
        subtypesQ.isLoading ||
        companiesQ.isLoading;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Plano de Centro de Custo</h1>
                    <p className="text-muted-foreground">
                        Gerencie planos, itens e (sub)tipos de despesa
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleNewPlan} className="bg-gradient-to-br from-primary to-primary/60 cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Plano
                    </Button>
                    <Button onClick={() => handleNewItem()} className="bg-gradient-to-br from-primary to-primary/60 cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Item
                    </Button>
                </div>
            </div>

            <Card className="rounded-none">
                {/* <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader> */}
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Buscar por nome ou código..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtros
                            </Button>
                            <Button variant="outline" size="sm">
                                <FileDown className="h-4 w-4 mr-2" />
                                Exportar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Abas por plano */}
            <Tabs
                defaultValue={
                    filteredPlans[0] ? String(filteredPlans[0].codPlanoCentroCusto) : "all"
                }
                className="space-y-0 rounded-none"
            >
                <TabsList className="flex flex-wrap rounded-none">
                    {filteredPlans.map((p) => (
                        <TabsTrigger
                            key={String(p.id)}
                            value={String(p.codPlanoCentroCusto)}
                            className="cursor-pointer rounded-none"
                        >
                            {p.codPlanoCentroCusto} - {p.nomePlanoCentroCusto}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {filteredPlans.map((plan) => (
                    <TabsContent key={String(plan.id)} value={String(plan.codPlanoCentroCusto)} className="rounded-none">
                        <PlanSection
                            plan={plan}
                            planItems={itemsForPlan(plan.id)}
                            expenseTypes={types}
                            expenseSubtypes={subtypes}
                            onEditPlan={handleEditPlan}
                            onNewItem={handleNewItem}
                            onEditItem={handleEditItem}
                            onNewExpenseType={handleNewExpenseType}
                            onEditExpenseType={handleEditExpenseType}
                            onNewExpenseSubtype={handleNewExpenseSubtype}
                            onEditExpenseSubtype={handleEditExpenseSubtype}
                            getTypesForItem={typesForItem}
                            getSubtypesForType={subtypesForType}
                        />
                    </TabsContent>
                ))}
            </Tabs>

            {/* Lista plana (tabela) */}
            {/* <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            Todos os Planos <Badge variant="secondary">{plans.length}</Badge>
                        </CardTitle>
                        <Button variant="outline" size="sm" onClick={handleNewPlan}>
                            <Plus className="h-4 w-4 mr-2" />
                            Novo
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <GenericTable<CostCenterPlan>
                        rows={plans}
                        columns={[
                            { header: "Código", render: (r) => r.codPlanoCentroCusto, className: "w-28" },
                            { header: "Nome", render: (r) => r.nomePlanoCentroCusto },
                            {
                                header: "Empresa",
                                className: "w-64",
                                render: (r) => {
                                    const idNum =
                                        typeof (r as any).companyId === "string"
                                            ? Number((r as any).companyId)
                                            : ((r as any).companyId as number);
                                    return companyNameById.get(idNum) ?? String(idNum ?? "");
                                },
                            },
                            {
                                header: "Status",
                                render: (r) => (
                                    <Badge variant={r.status === "active" ? "default" : "secondary"}>
                                        {r.status === "active" ? "Ativo" : "Inativo"}
                                    </Badge>
                                ),
                                className: "w-28",
                            },
                        ]}
                        onEdit={(r) => handleEditPlan(r)}
                        onDelete={(r) => handleDeletePlan(r)}
                    />
                </CardContent>
            </Card> */}

            {/* Forms */}
            {showPlanForm && (
                <CostCenterPlanForm
                    plan={selectedPlan}
                    onClose={() => {
                        setShowPlanForm(false);
                        setSelectedPlan(null);
                    }}
                    onSave={handleSavePlan}
                />
            )}

            {showItemForm && (
                <CostCenterPlanItemForm
                    item={selectedItem}
                    planoCentroCustoId={prefillPlanId}
                    availablePlans={availablePlans}
                    onClose={() => {
                        setShowItemForm(false);
                        setSelectedItem(null);
                        setPrefillPlanId(undefined);
                    }}
                    onSave={handleSaveItem}
                />
            )}

            {showTypeForm && (
                <ExpenseTypeForm
                    expenseType={selectedType}
                    planoCentroCustoItemId={prefillItemId}
                    availableItems={availableItems}
                    onClose={() => {
                        setShowTypeForm(false);
                        setSelectedType(null);
                        setPrefillItemId(undefined);
                    }}
                    onSave={handleSaveExpenseType}
                />
            )}

            {showSubtypeForm && (
                <ExpenseSubtypeForm
                    expenseSubtype={selectedSubtype}
                    tipoDespesaId={prefillTypeId}
                    availableTypes={availableTypes}
                    onClose={() => {
                        setShowSubtypeForm(false);
                        setSelectedSubtype(null);
                        setPrefillTypeId(undefined);
                    }}
                    onSave={handleSaveExpenseSubtype}
                />
            )}

            {loading && <p className="text-sm text-muted-foreground">Carregando…</p>}
        </div>
    );
}
