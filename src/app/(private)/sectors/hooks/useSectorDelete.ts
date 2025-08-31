// src/app/(private)/sectors/hooks/useSectorDelete.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useScopedCompanyMutation, delByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api";

export function useSectorDelete() {
    return useScopedCompanyMutation<unknown, number>(
        () => ["sectors"],
        (id, cid) => delByCompany(`/sectors/${id}`, cid)
    );
}