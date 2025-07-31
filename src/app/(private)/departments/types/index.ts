export interface Department {
    id: string;
    name: string;
    companyId: number;
    status: 'active' | 'inactive';
    createdAt: string;
    updatedAt: string;
}

export type CreateDepartmentInput = Omit<Department, "id" | "createdAt" | "updatedAt">;
export type UpdateDepartmentInput = Department;