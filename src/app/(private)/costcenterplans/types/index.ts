// FILE: src/app/(private)/costcenterplans/types/index.ts
export interface CostCenterPlan {
    id: number | string;
    codPlanoCentroCusto: string;
    nomePlanoCentroCusto: string;
    companyId: number | string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface CostCenterPlanItem {
    id: number | string;
    planoCentroCustoId: number | string;
    codPlanoCentroCustoItem: string;
    nomePlanoCentroCustoItem: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface ExpenseType {
    id: number | string;
    planoCentroCustoItemId: number | string;
    codTipoDespesa: string;
    nomeTipoDespesa: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface ExpenseSubtype {
    id: number | string;
    tipoDespesaId: number | string;
    codSubtipoDespesa: string;
    nomeSubtipoDespesa: string;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}