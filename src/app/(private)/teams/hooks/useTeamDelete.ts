// FILE: src/app/(private)/teams/hooks/useTeamDelete.tsx
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useScopedCompanyMutation, delByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api"

export function useTeamDelete() {
    return useScopedCompanyMutation<unknown, number>(
        () => ["teams"],
        (id, cid) => delByCompany(`/teams/${id}`, cid),
    );
}