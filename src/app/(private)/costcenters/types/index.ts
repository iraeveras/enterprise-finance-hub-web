export interface CostCenter {
    id: string;
    name: string;
    code: string;
    companyId: number;
    departmentId: number;
    sectorId: number;
    status: 'active' | 'inactive';
}

export type CreateCostCenterInput = Omit<CostCenter, "id" | "createdAt" | "updatedAt">;
export type UpdateCostCenterInput = CostCenter;