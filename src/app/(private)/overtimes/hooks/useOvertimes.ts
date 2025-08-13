"use client";
import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import type { Overtime, OvertimeStatus } from "../types";

type Params = Partial<{
    year: number;
    month: number;
    employeeId: number;
    status: OvertimeStatus | "all";
    companyId: number;
    costCenterId: number;
}>;

const buildQuery = (params?: Params) => {
    if (!params) return "";
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "all" && String(v).length > 0) {
            q.append(k, String(v));
        }
    });
    const s = q.toString();
    return s ? `?${s}` : "";
};

export function useOvertimes(params?: Params) {
    return useQuery<Overtime[]>({
        queryKey: ["overtimes", params],
        queryFn: async () => {
            const res = await api.get<{data: Overtime[]}>(`/overtimes`, { params });
            
            return res.data.data as Overtime[];
        },
        refetchOnWindowFocus: false,
    });
}
