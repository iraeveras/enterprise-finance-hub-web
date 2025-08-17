// FILE: src/app/(private)/overtimes/types/index.ts
export type OvertimeStatus = "open" | "closed" | "pending";

export interface Overtime {
    id?: number;
    year: number;
    month: number;
    companyId: number;
    costcenterId: number;
    employeeId: number;
    budgetPeriodId: number;
    function: string;
    // quantidades
    he50Qty?: number;
    he100Qty?: number;
    holidayDaysQty?: number;
    nightHoursQty?: number;
    // horas (legado/compatibilidade)
    normalHours?: number;
    overtime50?: number;
    overtime100?: number;
    holidayHours?: number;
    nightShiftHours?: number;
    // valores
    overtime50Value?: number;
    overtime100Value?: number;
    he50Value?: number;
    he100Value?: number;
    holidayValue?: number;
    nightShiftValue?: number;
    nightValue?: number;
    dsrValue?: number;
    dsrNightValue?: number;
    additionalValue?: number;
    totalValue?: number;
    budgetedAmount?: number;
    previousYearTotal?: number;
    variance?: number;
    variancePercentage?: number;
    justification?: string | null;
    status?: OvertimeStatus;
    createdAt?: string;  // ISO-8601
    updatedAt?: string;  // ISO-8601
}

export type CreateOvertimeInput = Omit<Overtime, "id" | "createdAt" | "updatedAt">;
export type UpdateOvertimeInput = Overtime;