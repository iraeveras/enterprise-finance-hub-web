// FILE: src/lib/company-storage.ts

// util pequeno para ler/gravar/remover a seleção de empresa
// usamos cookie + localStorage (cookie para backend, localStorage para boot rápido no client)

const COOKIE = "activeCompanyId";

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}`;
}
function getCookie(name: string) {
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`))
        ?.split("=")[1];
}
function removeCookie(name: string) {
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
}

export function getPersistedCompanyId(): number | null {
    // tenta cookie primeiro (pode ter sido setado por outro tab)
    const c = getCookie(COOKIE);
    if (c) return Number(decodeURIComponent(c)) || null;

    // fallback p/ localStorage
    try {
        const ls = localStorage.getItem(COOKIE);
        return ls ? Number(ls) : null;
    } catch {
        return null;
    }
}

export function persistCompanyId(companyId: number | null) {
    try {
        if (companyId == null) {
            removeCookie(COOKIE);
            localStorage.removeItem(COOKIE);
        } else {
            setCookie(COOKIE, String(companyId));
            localStorage.setItem(COOKIE, String(companyId));
        }
    } catch {
        // ignore
    }

    // notifica outras abas/componentes que escutam
    try {
        window.dispatchEvent(new CustomEvent("company-changed", { detail: { companyId } }));
    } catch {}
}

export function clearPersistedCompany() {
    persistCompanyId(null);
}