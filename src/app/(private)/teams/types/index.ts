// FILE: src/app/(private)/teams/types/index.ts
export interface Team {
    id: string;
    name: string;
    companyId: number;
    sectorId: number;
    leaderId?: number;
    status: 'active' | 'inactive';
    members?: { id: string; name: string }[]
    createdAt: string;
    updatedAt: string;
}

export type CreateTeamInput = Omit<Team, "id" | "createdAt" | "updatedAt">;
export type UpdateTeamInput = Team;