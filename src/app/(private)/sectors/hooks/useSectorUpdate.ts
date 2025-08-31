// src/app/(private)/sectors/hooks/useSectorUpdate.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useScopedCompanyMutation, putByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api";
import type { Sector } from "../types";

export function useSectorUpdate() {
    return useScopedCompanyMutation<Sector, {id: number; data: Partial<Sector>}>(
        () => ["sectors"],
        (vars, cid) => putByCompany<Sector>(`/sectors/${vars.id}`, vars.data, cid)
    );
}