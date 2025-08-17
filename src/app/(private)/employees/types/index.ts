// FILE: src/app/(private)/employees/types/index.ts
export interface Employee {
    id: string;
    matricula: string;
    name: string;
    admission: string;
    position: string;
    salary: number;
    dangerPay: boolean; // Adicional de periculosidade
    monthlyHours: number | null;    // horas mensais (ex.: 220)
    workSchedule: string | null;    // jornada de trabalho (ex.: "44h/semana")
    companyId: number;
    departmentId: number;
    sectorId: number;
    costcenterId: number;
    teams: number[];
    status: 'active' | 'inactive' | 'vacation' | 'leave';
}

export type CreateEmployeeInput = Omit<Employee, "id" | "createdAt" | "updatedAt">;
export type UpdateEmployeeInput = Employee