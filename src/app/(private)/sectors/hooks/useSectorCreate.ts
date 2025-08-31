// src/app/(private)/sectors/hooks/useSectorCreate.ts
"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useScopedCompanyMutation, postByCompany } from "@/hooks/scopedCompany";
import api from "@/services/api";
import type { CreateSectorInput, Sector } from "../types";

export function useSectorCreate() {
    return useScopedCompanyMutation<Sector, Partial<Sector>>(
        () => ["sectors"],
        (vars, cid) => postByCompany<Sector>("/sectors", vars, cid),
    );
}