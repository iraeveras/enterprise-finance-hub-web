// FILE: src/app/(private)/teams/hooks/useTeamUpdate.tsx
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useScopedCompanyMutation, putByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api"
import type { Team } from "../types"

export function useTeamUpdate() {
    return useScopedCompanyMutation<Team, { id: number; data: Partial<Team>}>(
        () => ["teams"],
        (vars, cid) => putByCompany<Team>(`/teams/${vars.id}`, vars.data, cid)
    )
}