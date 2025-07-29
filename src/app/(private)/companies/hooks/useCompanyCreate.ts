"use client"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Company, CompanyFormData } from "@/types";

export type CreateCompanyInput = CompanyFormData;

export function useCompanyCreate() {
    const queryClient = useQueryClient();
    return useMutation<Company, Error, CreateCompanyInput>({
        mutationFn: (newCompany) =>
            api.post<{ data: Company }>("/companies", newCompany).then(r => r.data.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
        },
    });
}