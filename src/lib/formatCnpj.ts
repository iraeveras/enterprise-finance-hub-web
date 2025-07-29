// src/lib/formatCnpj.ts
export function formatCNPJ(value: string): string {
    const digits = value.replace(/\D/g, "");
    return digits.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
    );
}