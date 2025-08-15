export type SectorLite = {
    id: number | string;
    name?: string | null;
    matricula?: string | number | null
};

const toNum = (v: number | string) => Number(v);

export function sectorName(
    sectors: SectorLite[] | undefined,
    id: number | string,
    fallback: string = "Setor"
) {
    const s = (sectors ?? []).find(sectors => toNum(sectors.id) === toNum(id));
    return s?.name ?? fallback;
}