export function formatBR(isoOrDate: string | Date) {
    const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
    // força UTC para não “voltar um dia” em timezones negativos
    return d.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}