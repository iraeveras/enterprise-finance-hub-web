// FILE: src/hooks/scopedCompany.ts
"use client";

import { useCompany } from "@/context/CompanyContext";
import { useMutation, useQuery, useQueryClient, QueryKey } from "@tanstack/react-query";
import api from "@/services/api";

export function useCompanyId(): number | null {
    const { selectedCompany } = useCompany();
    return selectedCompany ? Number(selectedCompany.id) : null;
}

// construtor de queryKeys com escopo
export function scopedKey(base: QueryKey, companyId: number | null): QueryKey {
    return ["company", companyId ?? "none", ...([].concat(base as any))];
}

// GET escopado
export function useScopedCompanyQuery<T, R = T>(
    key: (companyId: number) => QueryKey,
    fetcher: (companyId: number) => Promise<T>,
    enabledExtra = true,
    select?: (data: T, companyId: number) => R
) {
    const companyId = useCompanyId();
    return useQuery<R>({
        queryKey: scopedKey(key(companyId ?? -1), companyId),
        queryFn: async () => {
            const data = await fetcher(companyId!);
            return select ? select(data, companyId!) : (data as unknown as R);
        },
        enabled: !!companyId && enabledExtra,
    });
}

// CRUD escopado com invalidation automático
export function useScopedCompanyMutation<TData = unknown, TVars = unknown>(
    keyToInvalidate: (companyId: number) => QueryKey,
    mutateFn: (vars: TVars, companyId: number) => Promise<TData>,
) {
    const qc = useQueryClient();
    const companyId = useCompanyId();

    return useMutation<TData, unknown, TVars>({
        mutationFn: (vars) => mutateFn(vars, companyId!),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: scopedKey(keyToInvalidate(companyId!), companyId!) });
        },
    });
}

// helper para enviar companyId como header ou params
export function withCompanyParams(params: Record<string, any>, companyId: number) {
    return { ...params, companyId };
}
// exemplo de axios com header (se o backend prefere header):
export function withCompanyHeader(cfg: any, companyId: number) {
    return {
        ...cfg,
        headers: { ...(cfg?.headers ?? {}), "X-Company-Id": String(companyId) },
    };
}

// atalho seguro para GET por empresa (params)
export async function getByCompany<T>(url: string, companyId: number, params?: any) {
    const cfg = withCompanyHeader({ params: withCompanyParams(params ?? {}, companyId) }, companyId);
    const { data } = await api.get(url, cfg);
    return data.data ?? data;
}

// atalho seguro para POST/PUT por empresa (mesmo quando o corpo não tem a FK explícita)
export async function postByCompany<T>(url: string, body: any, companyId: number) {
    const cfg = withCompanyHeader({}, companyId);
    const { data } = await api.post(url, { ...body, companyId }, cfg);
    return data.data ?? data;
}
export async function putByCompany<T>(url: string, body: any, companyId: number) {
    const cfg = withCompanyHeader({}, companyId);
    const { data } = await api.put(url, { ...body, companyId }, cfg);
    return data.data ?? data;
}
export async function delByCompany<T>(url: string, companyId: number) {
    const cfg = withCompanyHeader({ params: { companyId } }, companyId);
    const { data } = await api.delete(url, cfg);
    return data.data ?? data;
}