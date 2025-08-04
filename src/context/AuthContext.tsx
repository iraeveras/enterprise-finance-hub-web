// FILE: src/context/AuthContext.tsx
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface User {
    id: number;
    name: string;
    email: string;
    role: any;
    companies?: any[];
    expiration: number;
    status?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Busca /users/me no mount
    const fetchMe = async () => {
        try {
            const res = await api.get<{
                data: {
                    id: number;
                    name: string;
                    email: string;
                    role: any;
                    TokenExpiredError: number;  // veio do backend
                    companies: any[];
                    status: string;
                };
            }>("/users/me");

            const me = res.data.data;
            setUser({
                id: me.id,
                name: me.name,
                email: me.email,
                role: me.role,
                companies: me.companies,
                status: me.status,
                expiration: me.TokenExpiredError,
            });
        } catch (error) {
            setUser(null);
            router.replace("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
        // se receber evento de logout (sesão expirada), desconecta
        const onExpire = () => {
            toast.error("Sessão expirada.");
            logout();
        };
        window.addEventListener("logout", onExpire);
        return () => {
            window.removeEventListener("logout", onExpire);
        }
    }, []);

    const login = async (email: string, password: string) => {
        await api.post("/users/login", { email, password });
        // backend já setou cookies token+refreshToken
        await fetchMe();
        router.replace("/");
    };

    const logout = async () => {
        await api.post("/users/logout");
        setUser(null);
        router.replace("/login");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}