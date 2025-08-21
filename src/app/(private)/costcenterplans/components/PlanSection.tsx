// FILE: src/app/(private)/costcenterplans/components/PlanSection.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, ChevronRight } from "lucide-react";
import type { CostCenterPlan, CostCenterPlanItem, ExpenseType, ExpenseSubtype } from "../types";

interface PlanSectionProps {
    plan: CostCenterPlan;
    planItems: CostCenterPlanItem[];
    expenseTypes: ExpenseType[];
    expenseSubtypes: ExpenseSubtype[];

    onEditPlan: (plan: CostCenterPlan) => void;
    onNewItem: (planId: string | number) => void;
    onEditItem: (item: CostCenterPlanItem) => void;
    onNewExpenseType: (itemId: string | number) => void;
    onEditExpenseType: (type: ExpenseType) => void;
    onNewExpenseSubtype: (typeId: string | number) => void;
    onEditExpenseSubtype: (subtype: ExpenseSubtype) => void;

    getTypesForItem: (itemId: string | number) => ExpenseType[];
    getSubtypesForType: (typeId: string | number) => ExpenseSubtype[];
}

export default function PlanSection({
    plan,
    planItems,
    onEditPlan,
    onNewItem,
    onEditItem,
    onNewExpenseType,
    onEditExpenseType,
    onNewExpenseSubtype,
    onEditExpenseSubtype,
    getTypesForItem,
    getSubtypesForType,
}: PlanSectionProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {plan.codPlanoCentroCusto} - {plan.nomePlanoCentroCusto}
                        <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                            {plan.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onNewItem(plan.id)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Item
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onEditPlan(plan)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {planItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nenhum item cadastrado para este plano</p>
                ) : (
                    <Accordion type="multiple" className="space-y-2">
                        {planItems.map((item) => (
                            <AccordionItem key={String(item.id)} value={String(item.id)} className="border rounded-lg">
                                <AccordionTrigger className="px-4 hover:no-underline">
                                    <div className="flex items-center justify-between w-full mr-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">{item.codPlanoCentroCustoItem}</span>
                                            <span>{item.nomePlanoCentroCustoItem}</span>
                                            <Badge variant={item.status === "active" ? "default" : "secondary"} className="text-xs">
                                                {item.status === "active" ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onNewExpenseType(item.id);
                                                }}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Tipo Despesa
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEditItem(item);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="px-4 pb-4">
                                    <div className="space-y-4">
                                        {getTypesForItem(item.id).length === 0 ? (
                                            <p className="text-muted-foreground text-sm">Nenhum tipo de despesa cadastrado para este item</p>
                                        ) : (
                                            <Accordion type="multiple" className="space-y-2">
                                                {getTypesForItem(item.id).map((type) => (
                                                    <AccordionItem key={String(type.id)} value={String(type.id)} className="border rounded-md bg-muted/30">
                                                        <AccordionTrigger className="px-3 text-sm hover:no-underline">
                                                            <div className="flex items-center justify-between w-full mr-4">
                                                                <div className="flex items-center gap-2">
                                                                    <ChevronRight className="h-3 w-3" />
                                                                    <span className="font-medium">{type.codTipoDespesa}</span>
                                                                    <span>{type.nomeTipoDespesa}</span>
                                                                    <Badge variant={type.status === "active" ? "default" : "secondary"} className="text-xs">
                                                                        {type.status === "active" ? "Ativo" : "Inativo"}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onNewExpenseSubtype(type.id);
                                                                        }}
                                                                    >
                                                                        <Plus className="h-4 w-4 mr-2" />
                                                                        Subtipo
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            onEditExpenseType(type);
                                                                        }}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </AccordionTrigger>

                                                        <AccordionContent className="px-3 pb-3">
                                                            <div className="space-y-1">
                                                                {getSubtypesForType(type.id).length === 0 ? (
                                                                    <p className="text-muted-foreground text-sm">Nenhum subtipo de despesa cadastrado</p>
                                                                ) : (
                                                                    getSubtypesForType(type.id).map((subtype) => (
                                                                        <div key={String(subtype.id)} className="flex items-center justify-between p-2 bg-background rounded border">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="font-medium text-sm">{subtype.codSubtipoDespesa}</span>
                                                                                <span className="text-sm">{subtype.nomeSubtipoDespesa}</span>
                                                                                <Badge variant={subtype.status === "active" ? "default" : "secondary"} className="text-xs">
                                                                                    {subtype.status === "active" ? "Ativo" : "Inativo"}
                                                                                </Badge>
                                                                            </div>
                                                                            <Button variant="outline" size="sm" onClick={() => onEditExpenseSubtype(subtype)}>
                                                                                <Edit className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>
                                                                    ))
                                                                )}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        )}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </CardContent>
        </Card>
    );
}