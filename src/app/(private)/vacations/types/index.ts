// FILE: src/app/(private)/vacations/types/index.ts
export type AcquisitionPeriodStatus = "open" | "used" | "closed";

export type AcquisitionPeriodsParams = {
  employeeId?: number;
  status?: "open" | "used" | "closed";
  page?: number;
  pageSize?: number;
};

export interface AcquisitionPeriod {
  id: string;
  employeeId: number;
  startDate: string;  // ISO-8601
  endDate: string;    // ISO-8601
  year: number;
  status: AcquisitionPeriodStatus;
  createdAt: string;  // ISO
  updatedAt: string;  // ISO
  // opcionais que o backend pode devolver
  employee?: { id: string; name: string } | null;
  vacationsCount?: number; // nº de férias que usam este período (se o backend retornar)
}

export type CreateAcquisitionPeriodInput = Omit<
  AcquisitionPeriod,
  "id" | "createdAt" | "updatedAt" | "employee" | "vacationsCount"
>;

export type UpdateAcquisitionPeriodInput = Partial<CreateAcquisitionPeriodInput> & {
  id: string;
};

export type VacationStatus = "scheduled" | "approved" | "taken";

export interface Vacation {
  id: string;
  employeeId: number;
  companyId: number;
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
  sectorId?: number;
  sectorName?: string | null;

  // Legacy properties for compatibility
  vacationStart?: string;
  vacationEnd?: string;
  days?: number;
  thirteenthSalary?: number;
  abono?: number;
  
  // Campos opcionais úteis em listagens
  employeeName?: string | null;
}

export type CreateVacationInput = Omit<
  Vacation,
  "id" | "createdAt" | "updatedAt" | "employeeName" | "sectorName"
>;

export type UpdateVacationInput = Partial<CreateVacationInput> & { id: string };