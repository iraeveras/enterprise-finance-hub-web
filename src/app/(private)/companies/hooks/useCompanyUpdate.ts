"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Company, CompanyFormData } from "../types";

export interface UpdateCompanyInput extends CompanyFormData {
    id: string;
}

export function useCompanyUpdate() {
    const queryClient = useQueryClient();
    return useMutation<Company, Error, UpdateCompanyInput>({
        mutationFn: ({ id, ...data }) =>
            api.put<{ data: Company }>(`/companies/${id}`, data).then(r => r.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
    });
}
