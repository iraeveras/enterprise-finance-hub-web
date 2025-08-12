// Tipagem mínima para o que precisamos aqui
export type EmployeeLite = { 
    id: number | string;
    name?: string | null;
    matricula?: string | number | null 
};

const toNum = (v: number | string) => Number(v);

/** 002, 009, etc (cai para o id se matrícula não existir) */
export function employeeMat(
    employees: EmployeeLite[] | undefined,
    id: number | string,
    pad: number = 3
) {
    const e = (employees ?? []).find(emp => toNum(emp.id) === toNum(id));
    const raw = (e?.matricula ?? id).toString();
    return raw.padStart(pad, "0");
}

/** “Funcionário” como fallback */
export function employeeName(
    employees: EmployeeLite[] | undefined,
    id: number | string,
    fallback: string = "Funcionário"
) {
    const e = (employees ?? []).find(emp => toNum(emp.id) === toNum(id));
    return e?.name ?? fallback;
}