// FILE: src/app/(private)/employees/hooks/useEmployeeCreate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Employee, CreateEmployeeInput } from "../types";

export function useEmployeeCreate() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (newEmp: CreateEmployeeInput) => {
            const res = await api.post<{ data: Employee }>("/employees", newEmp);
            console.log(res);
            
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}