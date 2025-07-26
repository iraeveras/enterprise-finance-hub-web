"use client";

import { Bell, Settings, User, LogOut, Search, Menu } from "lucide-react";
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

interface HeaderProps {
    user: {
        name: string;
        role: string;
        email: string;
    };
    onMobileMenuToggle?: () => void;
}

export const Header = ({ user, onMobileMenuToggle }: HeaderProps) => {
    const { logout } = useAuth();
    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                {/* Mobile menu button */}
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="md:hidden"
                        onClick={onMobileMenuToggle}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>
                    <div className="relative max-w-md w-full hidden sm:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Buscar funcionários, relatórios..."
                            className="pl-10 pr-4 py-2 w-full"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            3
                        </span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center space-x-2 px-3 cursor-pointer">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="text-left hidden md:block">
                                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
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
                            <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={logout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};