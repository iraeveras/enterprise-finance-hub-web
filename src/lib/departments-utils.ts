export type DepartmentLite = {
    id: number | string;
    name?: string | null;
    matricula?: string | number | null
};

const toNum = (v: number | string) => Number(v);

export function departmentName(
    departments: DepartmentLite[] | undefined,
    id: number | string,
    fallback: string = "Departamento"
) {
    const d = (departments ?? []).find(department => toNum(department.id) === toNum(id));
    return d?.name ?? fallback;
}