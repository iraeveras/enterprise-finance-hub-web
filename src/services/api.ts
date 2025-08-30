// FILE: src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { toast } from "sonner";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    withCredentials: true,       // envia automaticamente os cookies httpOnly
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
});

/** Util: lê cookie de forma segura (evita erro em SSR) */
function readCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const row = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
    return row ? decodeURIComponent(row.split("=")[1]) : null;
}

/** REQUEST INTERCEPTOR
 * Injeta X-Company-Id nas requisições sempre que existir o cookie "activeCompanyId".
 * Não sobrescreve se o header já tiver sido definido manualmente.
 */
api.interceptors.request.use((config) => {
    const cid = readCookie("activeCompanyId");
    if (cid) {
        config.headers = config.headers ?? {};
        if (!config.headers["X-Company-Id"]) {
            (config.headers as any)["X-Company-Id"] = String(cid);
        }
    }
    return config;
});

// Força refresh de token se receber 401
let isRefreshing = false;
let failedQueue: {
    resolve: (value?: any) => void;
    reject: (error: any) => void;
}[] = [];

const processQueue = (error: any) => {
    failedQueue.forEach(({ reject }) => reject(error));
    failedQueue = [];
};

api.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
        const originalReq = err.config as AxiosRequestConfig & { _retry?: boolean };
        const hasRefreshToken = document.cookie.includes('refreshToken');

        if (err.response?.status === 401 && !originalReq._retry && hasRefreshToken) {
        // tenta refresh token
            if (isRefreshing) {
                // enfileira
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => api(originalReq));
            }

            originalReq._retry = true;
            isRefreshing = true;

            try {
                await api.post("/users/refresh-token"); // renova cookie token
                processQueue(null);
                return api(originalReq);                // re-executa a requisição original
            } catch (refreshError) {
                processQueue(refreshError);
                // Se refresh falhar, dispara logout global
                window.dispatchEvent(new Event("logout"));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // Outros erros: log
        console.error("API Error:", err.response?.status, err.response?.data);
        return Promise.reject(err);
    }
);

export default api;