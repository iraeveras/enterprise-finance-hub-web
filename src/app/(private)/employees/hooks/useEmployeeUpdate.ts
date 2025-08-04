// FILE: src/app/(private)/employees/hooks/useEmployeeUpdate.ts
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { Employee, UpdateEmployeeInput } from "../types";

export function useEmployeeUpdate() {
    const queryclient = useQueryClient();
    return useMutation({
        mutationFn: async (emp: UpdateEmployeeInput) => {
            const { id, ...data } = emp;
            const res = await api.put<{ data: Employee }>(`/employees/${id}`, data);
            console.log(res);
            
            return res.data.data;
        },
        onSuccess: () => {
            queryclient.invalidateQueries({ queryKey: ["employees"] });
        },
    });
}