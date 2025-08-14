export type CompanyLite = {
    id: number | string;
    name?: string | null;
    matricula?: string | number | null
};

const toNum = (v: number | string) => Number(v);

export function companyName(
    companies: CompanyLite[] | undefined,
    id: number | string,
    fallback: string = "Empresa"
) {
    const c = (companies ?? []).find(company => toNum(company.id) === toNum(id));
    return c?.name ?? fallback;
}