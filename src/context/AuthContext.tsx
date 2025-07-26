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

interface User {
    id: number;
    name: string;
    email: string;
    role: any;
    companies?: any[];
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
            const { data } = await api.get<{ data: User }>("/users/me");
            setUser(data.data);
        } catch (error) {
            setUser(null);
            router.replace("/login");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
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