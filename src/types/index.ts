export interface Sector {
    id: string;
    name: string;
    companyId: string;
    departmentId: string;
    status: 'active' | 'inactive';
}

export interface CostCenter {
    id: string;
    name: string;
    code: string;
    companyId: string;
    departmentId: string;
    sectorId: string;
    status: 'active' | 'inactive';
}

export interface Team {
    id: string;
    name: string;
    companyId: string;
    sectorId: string;
    leaderId?: string;
    status: 'active' | 'inactive';
}

export interface Employee {
    id: string;
    matricula: string;
    name: string;
    admission: string;
    position: string;
    salary: number;
    dangerPay: boolean; // Adicional de periculosidade
    companyId: string;
    departmentId: string;
    sectorId: string;
    costCenterId: string;
    teamId: string;
    status: 'active' | 'inactive' | 'vacation' | 'leave';
}

export interface Premise {
    id: string;
    year: number;
    companyId: string;
    minimumWage: number;
    fapIndex: number;
    dissidio: number;
    healthPlan: number;
    foodVoucher: number;
    transportVoucher: number;
    lifeInsurance: number;
    childcareAid: number;
    readjustmentIndices: {
        january: number;
        february: number;
        march: number;
        april: number;
        may: number;
        june: number;
        july: number;
        august: number;
        september: number;
        october: number;
        november: number;
        december: number;
    };
    holidays: string[];
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface BudgetEntry {
    id: string;
    periodId: string;
    year: number;
    month: number;
    companyId: string;
    costCenterId: string;
    sectorId: string;
    teamId: string;
    employeeId: string;
    category: 'salary' | 'benefits' | 'overtime' | 'vacation' | 'taxes' | 'others';
    description: string;
    budgetedAmount: number;
    actualAmount?: number;
    variance?: number;
    variancePercentage?: number;
    justification?: string;
    status: 'open' | 'closed' | 'pending';
    createdAt: string;
    updatedAt: string;
}

export interface VacationEntry {
    id: string;
    employeeId: string;
    companyId: string;
    acquisitionPeriodStart: string;
    acquisitionPeriodEnd: string;
    month: number;
    year: number;
    vacationDays: number;
    abonoDays: number;
    thirteenthAdvance: boolean;
    baseSalary: number;
    overtimeAverage: number;
    vacationValue: number;
    onethirdValue: number;
    abonoValue: number;
    abonoOnethirdValue: number;
    status: 'scheduled' | 'approved' | 'taken';
    createdAt: string;
    updatedAt: string;
    // Sector information
    sectorId?: string;
    sectorName?: string;
    // Legacy properties for compatibility
    vacationStart?: string;
    vacationEnd?: string;
    days?: number;
    thirteenthSalary?: number;
    abono?: number;
}

export interface OvertimeEntry {
    id: string;
    year: number;
    month: number;
    companyId: string;
    costCenterId: string;
    employeeId: string;
    function: string;
    normalHours: number;
    overtime50: number;
    overtime100: number;
    holidayHours: number;
    nightShiftHours: number;
    overtime50Value: number;
    overtime100Value: number;
    holidayValue: number;
    nightShiftValue: number;
    dsrValue: number;
    dsrNightValue?: number;
    additionalValue: number;
    totalValue: number;
    budgetedAmount: number;
    variance: number;
    variancePercentage: number;
    justification?: string;
    status: 'open' | 'closed';
    createdAt: string;
    updatedAt: string;
}

export interface BenefitEntry {
    id: string;
    year: number;
    month: number;
    companyId: string;
    costCenterId: string;
    employeeId: string;
    benefitType: 'food_voucher' | 'health_plan' | 'life_insurance' | 'transport_voucher' | 'childcare_aid' | 'others';
    description: string;
    quantity: number;
    unitValue: number;
    totalValue: number;
    discount: number;
    finalValue: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export interface MonthlyBudgetEntry {
    id: string;
    costCenterId: string;
    costCenterName: string;
    category: string;
    monthlyBudget: number;
    annualBudget: number;
    actualAmount?: number;
    variance: number;
    variancePercentage: number;
    justification?: string;
    month: number;
    year: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface BudgetPeriod {
    id: string;
    year: number;
    companyId: string;
    startDate: string;
    endDate: string;
    status: 'open' | 'closed' | 'pending';
    description: string;
    createdAt: string;
    updatedAt: string;
    closedBy?: string;
    closedAt?: string;
}

export interface Schedule {
    id: string;
    name: string;
    companyId: string;
    sectorId: string;
    type: 'weekend' | 'holiday' | 'special';
    startDate: string;
    endDate: string;
    employees: ScheduleEmployee[];
    status: 'draft' | 'published' | 'completed';
    createdAt: string;
    updatedAt: string;
}

export interface ScheduleEmployee {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    shift: 'morning' | 'afternoon' | 'night' | 'full';
    startTime: string;
    endTime: string;
    position: string;
    observations?: string;
}

export interface ShiftTemplate {
    id: string;
    name: string;
    companyId: string;
    sectorId: string;
    shifts: ShiftTime[];
    isActive: boolean;
    createdAt: string;
}

export interface ShiftTime {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    duration: number; // em horas
    type: 'morning' | 'afternoon' | 'night' | 'full';
}

export interface Simulation {
    id: string;
    name: string;
    description: string;
    baseScenario: 'current' | 'budget';
    adjustments: SimulationAdjustment[];
    results: SimulationResult[];
    createdAt: string;
    createdBy: string;
    status: 'draft' | 'running' | 'completed' | 'error';
}

export interface SimulationAdjustment {
    id: string;
    type: 'salary' | 'headcount' | 'benefits' | 'overtime' | 'vacation';
    targetId: string; // employee, department, etc.
    adjustmentType: 'percentage' | 'absolute' | 'multiplier';
    value: number;
    description: string;
}

export interface SimulationResult {
    id: string;
    category: string;
    currentValue: number;
    simulatedValue: number;
    variance: number;
    variancePercentage: number;
    period: string;
}

export interface Report {
    id: string;
    name: string;
    type: 'budget-execution' | 'cost-center-analysis' | 'headcount-report' | 'benefits-summary' | 'custom';
    parameters: ReportParameters;
    format: 'pdf' | 'xlsx' | 'csv';
    schedule?: ReportSchedule;
    createdAt: string;
    lastGenerated?: string;
    status: 'draft' | 'active' | 'archived';
}

export interface ReportParameters {
    dateRange: {
        start: string;
        end: string;
    };
    departments?: string[];
    costCenters?: string[];
    employees?: string[];
    includeSubTotals: boolean;
    groupBy: 'department' | 'cost-center' | 'employee' | 'month';
    metrics: string[];
}

export interface ReportSchedule {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    recipients: string[];
    enabled: boolean;
}

export interface Holiday {
    id: string;
    name: string;
    date: string;
    year: number;
    isNational: boolean;
    companyId: string;
    createdAt: string;
    updatedAt: string;
}