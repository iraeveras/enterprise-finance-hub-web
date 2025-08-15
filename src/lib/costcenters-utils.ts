export type CostCenterLite = {
    id: number | string;
    name?: string | null;
    matricula?: string | number | null
};

const toNum = (v: number | string) => Number(v);

export function costcenterName(
    costcenters: CostCenterLite[] | undefined,
    id: number | string,
    fallback: string = "Centro de custo"
) {
    const cc = (costcenters ?? []).find(costcenter => toNum(costcenter.id) === toNum(id));
    return cc?.name ?? fallback;
}