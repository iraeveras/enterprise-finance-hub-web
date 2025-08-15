// FILE: src/app/(private)/budgetperiods/types/index.ts
export type BudgetPeriodStatus = "open" | "closed" | "pending" | "draft" | string;

export interface BudgetPeriod {
    id: number;
    year: number;
    companyId: number;
    startDate: string;      // ISO-8601 DateTime (ex.: 2025-01-01T00:00:00.000Z)
    endDate: string;        // ISO-8601 DateTime
    status?: BudgetPeriodStatus;
    description: string;
    closedBy?: string | null;
    closedAt?: string | null; // ISO-8601 DateTime
    createdAt: string;        // ISO-8601 DateTime
    updatedAt: string;        // ISO-8601 DateTime
}

export type CreateBudgetPeriodInput = Omit<BudgetPeriod, "id" | "createdAt" | "updatedAt" | "closedBy" | "closedAt"> & {
    closedBy?: string | null;
    closedAt?: string | null;
};

export type UpdateBudgetPeriodInput = Partial<CreateBudgetPeriodInput> & { id: string };