export type OvertimeStatus = "open" | "closed" | "pending";

export interface Overtime {
    id?: number;
    year: number;
    month: number;
    companyId: number;
    costCenterId: number;
    employeeId: number;
    budgetPeriodId: number;

    function: string;

    he50Qty?: number;
    he100Qty?: number;
    holidayDaysQty?: number;
    nightHoursQty?: number;

    normalHours?: number;
    overtime50?: number;
    overtime100?: number;
    holidayHours?: number;
    nightShiftHours?: number;

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
    createdAt?: string | Date;
    updatedAt?: string | Date;
}