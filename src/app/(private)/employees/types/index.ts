// FILE: src/app/(private)/employees/types/index.ts
export interface Employee {
    id: string;
    matricula: string;
    name: string;
    admission: string;
    position: string;
    salary: number;
    dangerPay: boolean; // Adicional de periculosidade
    companyId: number;
    departmentId: number;
    sectorId: number;
    costCenterId: number;
    teams: number[];
    status: 'active' | 'inactive' | 'vacation' | 'leave';
}

export type CreateEmployeeInput = Omit<Employee, "id" | "createdAt" | "updatedAt" >;
export type UpdateEmployeeInput = Employee