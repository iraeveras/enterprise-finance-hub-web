import { Fallback } from "@radix-ui/react-avatar";

export type UserLite = {
    id: number | string;
    name?: string | null;
    matricula?: string | number | null
};

const toNum = (v: number | string | undefined | null) => v == null ? NaN : Number(v);

export function userName(
    users: UserLite[] | undefined,
    id?: number | string,
    fallback: string = "Usuário"
): string {
    if (id == null) return fallback;
    const u = (users ?? []).find(u => toNum(u.id) === toNum(id));
    return u?.name ?? fallback;
}