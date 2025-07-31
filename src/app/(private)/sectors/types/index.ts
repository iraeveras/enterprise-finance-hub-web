export interface Sector {
    id: string;
    name: string;
    companyId: number;
    departmentId: number;
    status: 'active' | 'inactive';
}

export type CreateSectorInput = Omit<Sector, "id" | "createdAt" | "updatedAt">;
export type UpdateSectorInput = Sector;