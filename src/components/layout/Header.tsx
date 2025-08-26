// FILE: src/components/layout/Header.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Bell, Settings, User, LogOut, Search, Menu, ClockFading, Building, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useCompany } from "@/context/CompanyContext";
import CompanySelector from "@/app/(private)/companies/components/CompanySelector";

interface HeaderProps {
    user: {
        name: string;
        role: string;
        email: string;
    };
    onMobileMenuToggle?: () => void;
}

export const Header = ({ user: propUser, onMobileMenuToggle }: HeaderProps) => {
    const { user: ctxUser, logout } = useAuth();
    const [secondsLeft, setSecondsLeft] = useState(0);
    const { selectedCompany } = useCompany();
    const [showSelector, setShowSelector] = useState(false);

    const format = (sec: number) => {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    useEffect(() => {
        if (!ctxUser?.expiration) return;
        const update = () => {
            const diff = Math.max(
                0, Math.ceil((ctxUser.expiration - Date.now()) / 1000)
            );
            setSecondsLeft(diff);
            if (diff === 0) {
                logout();
            }
        };
        update();
        const iv = setInterval(update, 1000);
        return () => clearInterval(iv);
    }, [ctxUser, logout]);

    return (
        <>
            <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                        <Button variant="ghost" size="sm" className="md:hidden" onClick={onMobileMenuToggle}>
                            <Menu className="w-5 h-5" />
                        </Button>

                        {/* Pílula com a empresa atual + trocar */}
                        {selectedCompany && (
                            <div className="flex items-center space-x-2 bg-primary/5 px-3 py-2 rounded-lg">
                                <Building className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium text-primary">{selectedCompany.tradeName}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                                    onClick={() => setShowSelector(true)}
                                    title="Trocar empresa"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                </Button>
                            </div>
                        )}

                        <div className="relative max-w-md w-full hidden sm:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input type="text" placeholder="Buscar funcionários, relatórios..." className="pl-10 pr-4 py-2 w-full" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                3
                            </span>
                        </Button>
                        {ctxUser?.expiration && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                                <ClockFading className="w-4 h-4" /> {format(secondsLeft)}
                            </p>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center space-x-2 px-3 cursor-pointer">
                                    <Avatar className="w-8 h-8">
                                        <AvatarFallback className="bg-blue-600 text-white">
                                            {propUser.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-left hidden md:block">
                                        <p className="text-sm font-medium text-gray-900">{propUser.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{propUser.role}</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem className="cursor-pointer">
                                    <User className="w-4 h-4 mr-2" />
                                    Perfil
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Configurações
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => setShowSelector(true)}>
                                    <Building className="w-4 h-4 mr-2" />
                                    Trocar Empresa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>

            <CompanySelector
                isOpen={showSelector}
                onClose={() => setShowSelector(false)}
                title="Trocar Empresa"
                description="Selecione a empresa para continuar operando"
            />
        </>
    );
};