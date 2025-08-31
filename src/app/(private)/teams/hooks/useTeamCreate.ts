// FILE: src/app/(private)/teams/hooks/useTeamCreate.tsx
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useScopedCompanyMutation, postByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api"
import type { Team, CreateTeamInput } from "../types"

export function useTeamCreate() {
    return useScopedCompanyMutation<Team, Partial<Team>>(
        () => ["teams"],
        (vars, cid) => postByCompany<Team>("/teams", vars, cid),
    );
}