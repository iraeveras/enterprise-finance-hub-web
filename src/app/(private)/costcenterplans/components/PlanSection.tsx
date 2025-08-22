// FILE: src/app/(private)/costcenterplans/components/PlanSection.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, ChevronRight } from "lucide-react";
import type {
    CostCenterPlan,
    CostCenterPlanItem,
    ExpenseType,
    ExpenseSubtype,
} from "../types";

interface PlanSectionProps {
    plan: CostCenterPlan;
    planItems: CostCenterPlanItem[];
    expenseTypes: ExpenseType[];
    expenseSubtypes: ExpenseSubtype[];
    onEditPlan: (plan: CostCenterPlan) => void;
    onNewItem: (planId: string) => void;
    onEditItem: (item: CostCenterPlanItem) => void;
    onNewExpenseType: (itemId: string) => void;
    onEditExpenseType: (type: ExpenseType) => void;
    onNewExpenseSubtype: (typeId: string) => void;
    onEditExpenseSubtype: (subtype: ExpenseSubtype) => void;
    getTypesForItem: (itemId: string) => ExpenseType[];
    getSubtypesForType: (typeId: string) => ExpenseSubtype[];
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
        <Card className="rounded-none">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        {plan.codPlanoCentroCusto} - {plan.nomePlanoCentroCusto}
                        <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                            {plan.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                    </CardTitle>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onNewItem(String(plan.id))}>
                            <Plus className="h-4 w-4 mr-2" /> Adicionar Item
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onEditPlan(plan)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {planItems.length === 0 ? (
                    <p className="py-8 text-center text-muted-foreground">
                        Nenhum item cadastrado para este plano
                    </p>
                ) : (
                    <AccordionPrimitive.Root type="multiple" className="space-y-2">
                        {planItems.map((item) => (
                            <AccordionPrimitive.Item
                                key={item.id}
                                value={String(item.id)}
                                className="rounded-lg border"
                            >
                                <AccordionPrimitive.Header className="flex items-center justify-between px-4 py-3">
                                    {/* Trigger como DIV (evita button dentro de button) */}
                                    <AccordionPrimitive.Trigger asChild>
                                        <div className="group/item flex cursor-pointer items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                            <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/item:rotate-90" />
                                            <span className="font-medium">{item.codPlanoCentroCustoItem}</span>
                                            <span>{item.nomePlanoCentroCustoItem}</span>
                                            <Badge
                                                variant={item.status === "active" ? "default" : "secondary"}
                                                className="text-xs"
                                            >
                                                {item.status === "active" ? "Ativo" : "Inativo"}
                                            </Badge>
                                        </div>
                                    </AccordionPrimitive.Trigger>

                                    {/* Ações */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onNewExpenseType(String(item.id));
                                            }}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
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
                                </AccordionPrimitive.Header>

                                <AccordionPrimitive.Content className="px-4 pb-4">
                                    <div className="space-y-4">
                                        {getTypesForItem(String(item.id)).length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                Nenhum tipo de despesa cadastrado para este item
                                            </p>
                                        ) : (
                                            <AccordionPrimitive.Root type="multiple" className="space-y-2">
                                                {getTypesForItem(String(item.id)).map((type) => (
                                                    <AccordionPrimitive.Item
                                                        key={type.id}
                                                        value={String(type.id)}
                                                        className="rounded-md border bg-muted/30"
                                                    >
                                                        <AccordionPrimitive.Header className="flex items-center justify-between px-3 py-2">
                                                            <AccordionPrimitive.Trigger asChild>
                                                                <div className="group/type flex cursor-pointer items-center gap-2 text-sm">
                                                                    <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]/type:rotate-90" />
                                                                    <span className="font-medium">{type.codTipoDespesa}</span>
                                                                    <span>{type.nomeTipoDespesa}</span>
                                                                    <Badge
                                                                        variant={type.status === "active" ? "default" : "secondary"}
                                                                        className="text-xs"
                                                                    >
                                                                        {type.status === "active" ? "Ativo" : "Inativo"}
                                                                    </Badge>
                                                                </div>
                                                            </AccordionPrimitive.Trigger>

                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onNewExpenseSubtype(String(type.id));
                                                                    }}
                                                                >
                                                                    <Plus className="mr-2 h-4 w-4" />
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
                                                        </AccordionPrimitive.Header>

                                                        {/* + indentação dos subtipos */}
                                                        <AccordionPrimitive.Content className="px-6 pb-3">
                                                            <div className="space-y-2">
                                                                {getSubtypesForType(String(type.id)).length === 0 ? (
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Nenhum subtipo de despesa cadastrado
                                                                    </p>
                                                                ) : (
                                                                    <div className="space-y-1">
                                                                        {getSubtypesForType(String(type.id)).map((subtype) => (
                                                                            <div
                                                                                key={subtype.id}
                                                                                className="ml-8 flex items-center justify-between rounded border bg-background p-2"
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-sm font-medium">
                                                                                        {subtype.codSubtipoDespesa}
                                                                                    </span>
                                                                                    <span className="text-sm">
                                                                                        {subtype.nomeSubtipoDespesa}
                                                                                    </span>
                                                                                    <Badge
                                                                                        variant={
                                                                                            subtype.status === "active"
                                                                                                ? "default"
                                                                                                : "secondary"
                                                                                        }
                                                                                        className="text-xs"
                                                                                    >
                                                                                        {subtype.status === "active" ? "Ativo" : "Inativo"}
                                                                                    </Badge>
                                                                                </div>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() => onEditExpenseSubtype(subtype)}
                                                                                >
                                                                                    <Edit className="h-4 w-4" />
                                                                                </Button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </AccordionPrimitive.Content>
                                                    </AccordionPrimitive.Item>
                                                ))}
                                            </AccordionPrimitive.Root>
                                        )}
                                    </div>
                                </AccordionPrimitive.Content>
                            </AccordionPrimitive.Item>
                        ))}
                    </AccordionPrimitive.Root>
                )}
            </CardContent>
        </Card>
    );
}