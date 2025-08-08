"use client";

import {
    Users,
    Building,
    DollarSign,
    BarChart,
    FileText,
    Calendar,
    UserCheck,
    Gift,
    Clock,
    Building2,
    Factory,
    Group,
    Target,
    MapPin,
    Calculator,
    TrendingUp,
    Eye,
    BarChart3,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface SidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    userRole: string;
}

interface SidebarItemProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
    icon: Icon,
    label,
    isActive,
    onClick,
}) => (
    <button
        className={cn(
            "group flex w-full items-center space-x-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100 cursor-pointer",
            isActive
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:text-gray-900"
            )}
            onClick={onClick}
    >
        <Icon
            className={cn("h-4 w-4", isActive ? "text-gray-600" : "text-gray-500")}
        />
        <span>{label}</span>
    </button>
);

export const Sidebar: React.FC<SidebarProps> = ({
    activeSection,
    onSectionChange,
    userRole,
}) => {
    return (
        <div className="fixed left-0 top-0 z-50 h-screen w-64 flex-col border-r bg-white lg:flex md:w-64 hidden md:flex">
            <div className="flex-shrink-0 border-b p-4">
                <a href="/" className="flex items-center space-x-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    <span className="font-bold text-xl">
                        <span className="text-primary">Orça</span>Gestão
                    </span>
                </a>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                {/* Dashboard */}
                <div className="mb-4">
                    <SidebarItem
                        icon={BarChart}
                        label="Dashboard"
                        isActive={activeSection === "dashboard"}
                        onClick={() => onSectionChange("dashboard")}
                    />
                </div>

                <Accordion type="multiple" className="w-full space-y-2">
                    {/* Gestão Empresarial */}
                    <AccordionItem value="empresa" className="border-0">
                        <AccordionTrigger className="cursor-pointer px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                            Gestão Empresarial
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <div className="space-y-1">
                                <SidebarItem
                                    icon={Building}
                                    label="Empresas"
                                    isActive={activeSection === "companies"}
                                    onClick={() => onSectionChange("companies")}
                                />
                                <SidebarItem
                                    icon={Users}
                                    label="Funcionários"
                                    isActive={activeSection === "employees"}
                                    onClick={() => onSectionChange("employees")}
                                />
                                <SidebarItem
                                    icon={Building2}
                                    label="Departamentos"
                                    isActive={activeSection === "departments"}
                                    onClick={() => onSectionChange("departments")}
                                />
                                <SidebarItem
                                    icon={Factory}
                                    label="Setores"
                                    isActive={activeSection === "sectors"}
                                    onClick={() => onSectionChange("sectors")}
                                />
                                <SidebarItem
                                    icon={Group}
                                    label="Equipes"
                                    isActive={activeSection === "teams"}
                                    onClick={() => onSectionChange("teams")}
                                />
                                <SidebarItem
                                    icon={Target}
                                    label="Centros de Custo"
                                    isActive={activeSection === "costcenters"}
                                    onClick={() => onSectionChange("costcenters")}
                                />
                                <SidebarItem
                                    icon={MapPin}
                                    label="Estabelecimentos"
                                    isActive={activeSection === "premises"}
                                    onClick={() => onSectionChange("premises")}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Orçamento */}
                    <AccordionItem value="orcamento" className="border-0">
                        <AccordionTrigger className="cursor-pointer px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                            Orçamento
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <div className="space-y-1">
                                <SidebarItem
                                    icon={DollarSign}
                                    label="Orçamentos"
                                    isActive={activeSection === "budget"}
                                    onClick={() => onSectionChange("budget")}
                                />
                                <SidebarItem
                                    icon={Calendar}
                                    label="Períodos Orçamentários"
                                    isActive={activeSection === "budgetperiods"}
                                    onClick={() => onSectionChange("budgetperiods")}
                                />
                                <SidebarItem
                                    icon={Calculator}
                                    label="Simulação"
                                    isActive={activeSection === "simulation"}
                                    onClick={() => onSectionChange("simulation")}
                                />
                                <SidebarItem
                                    icon={TrendingUp}
                                    label="Projeções Econômicas"
                                    isActive={activeSection === "projections"}
                                    onClick={() => onSectionChange("projections")}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Gestão de Pessoas */}
                    <AccordionItem value="pessoas" className="border-0">
                        <AccordionTrigger className="cursor-pointer px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                            Gestão de Pessoas
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <div className="space-y-1">
                                <SidebarItem
                                    icon={Calendar}
                                    label="Férias"
                                    isActive={activeSection === "vacation"}
                                    onClick={() => onSectionChange("vacation")}
                                />
                                <SidebarItem
                                    icon={Clock}
                                    label="Horas Extras"
                                    isActive={activeSection === "overtime"}
                                    onClick={() => onSectionChange("overtime")}
                                />
                                <SidebarItem
                                    icon={Gift}
                                    label="Benefícios"
                                    isActive={activeSection === "benefits"}
                                    onClick={() => onSectionChange("benefits")}
                                />
                                <SidebarItem
                                    icon={Calendar}
                                    label="Escalas"
                                    isActive={activeSection === "schedule"}
                                    onClick={() => onSectionChange("schedule")}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                {/* Monitoramento */}
                    <AccordionItem value="monitoramento" className="border-0">
                        <AccordionTrigger className="cursor-pointer px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                            Monitoramento
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <div className="space-y-1">
                                <SidebarItem
                                    icon={Eye}
                                    label="Acompanhamento Mensal"
                                    isActive={activeSection === "monitoring"}
                                    onClick={() => onSectionChange("monitoring")}
                                />
                                <SidebarItem
                                    icon={BarChart3}
                                    label="Resumo Centro de Custos"
                                    isActive={activeSection === "costcenter-summary"}
                                    onClick={() => onSectionChange("costcenter-summary")}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                {/* Relatórios */}
                    <AccordionItem value="relatorios" className="border-0">
                        <AccordionTrigger className="cursor-pointer px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                            Relatórios
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                            <div className="space-y-1">
                                <SidebarItem
                                    icon={FileText}
                                    label="Relatórios"
                                    isActive={activeSection === "reports"}
                                    onClick={() => onSectionChange("reports")}
                                />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* Administração */}
                    {userRole === "admin" && (
                        <AccordionItem value="admin" className="border-0">
                            <AccordionTrigger className="cursor-pointer px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                                Administração
                            </AccordionTrigger>
                            <AccordionContent className="pb-2">
                                <div className="space-y-1">
                                    <SidebarItem
                                        icon={UserCheck}
                                        label="Usuários"
                                        isActive={activeSection === "users"}
                                        onClick={() => onSectionChange("users")}
                                    />
                                    <SidebarItem
                                        icon={Users}
                                        label="Cargos"
                                        isActive={activeSection === "roles"}
                                        onClick={() => onSectionChange("roles")}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </nav>

            <div className="mt-auto border-t p-4">
                <p className="text-center text-xs text-gray-500">
                    Copyright © {new Date().getFullYear()} OrçaGestão
                </p>
            </div>
        </div>
    );
};