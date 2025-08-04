// FILE: src/services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import { toast } from "sonner";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
    withCredentials: true,       // envia automaticamente os cookies httpOnly
    headers: { "Content-Type": "application/json" },
    timeout: 10000,
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