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
    Sheet,
    SheetContent,
    SheetTitle,
} from "@/components/ui/sheet";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface MobileSidebarProps {
    activeSection: string;
    onSectionChange: (section: string) => void;
    userRole: string;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
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
            "group flex w-full items-center space-x-2 rounded-md p-3 text-sm font-medium hover:bg-gray-100",
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

export const MobileSidebar: React.FC<MobileSidebarProps> = ({
    activeSection,
    onSectionChange,
    userRole,
    isOpen,
    onOpenChange,
}) => {
    const handleSectionChange = (section: string) => {
        onSectionChange(section);
        onOpenChange(false); // Fecha o sidebar mobile após seleção
    };

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <div className="flex h-full flex-col">
                    <div className="flex-shrink-0 border-b p-4">
                        <a href="/" className="flex items-center space-x-2">
                            <BarChart3 className="h-6 w-6 text-primary" />
                            <span className="font-bold text-xl">
                                <span className="text-primary">Orça</span>Gestão
                            </span>
                        </a>
                    </div>

                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="mb-4">
                            <SidebarItem
                                icon={BarChart}
                                label="Dashboard"
                                isActive={activeSection === "dashboard"}
                                onClick={() => handleSectionChange("dashboard")}
                            />
                        </div>

                        <Accordion type="multiple" className="w-full space-y-2">
                            {/* Gestão Empresarial */}
                            <AccordionItem value="empresa" className="border-0">
                                <AccordionTrigger className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                                    Gestão Empresarial
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    <div className="space-y-1">
                                        <SidebarItem
                                            icon={Building}
                                            label="Empresas"
                                            isActive={activeSection === "companies"}
                                            onClick={() => handleSectionChange("companies")}
                                        />
                                        <SidebarItem
                                            icon={Users}
                                            label="Funcionários"
                                            isActive={activeSection === "employees"}
                                            onClick={() => handleSectionChange("employees")}
                                        />
                                        <SidebarItem
                                            icon={Building2}
                                            label="Departamentos"
                                            isActive={activeSection === "departments"}
                                            onClick={() => handleSectionChange("departments")}
                                        />
                                        <SidebarItem
                                            icon={Factory}
                                            label="Setores"
                                            isActive={activeSection === "sectors"}
                                            onClick={() => handleSectionChange("sectors")}
                                        />
                                        <SidebarItem
                                            icon={Group}
                                            label="Equipes"
                                            isActive={activeSection === "teams"}
                                            onClick={() => handleSectionChange("teams")}
                                        />
                                        <SidebarItem
                                            icon={Target}
                                            label="Centros de Custo"
                                            isActive={activeSection === "costcenters"}
                                            onClick={() => handleSectionChange("costcenters")}
                                        />
                                        <SidebarItem
                                            icon={MapPin}
                                            label="Estabelecimentos"
                                            isActive={activeSection === "premises"}
                                            onClick={() => handleSectionChange("premises")}
                                        />
                                        <SidebarItem
                                            icon={FileText}
                                            label="Plano de Centro de Custo"
                                            isActive={activeSection === "costcenterplans"}
                                            onClick={() => handleSectionChange("costcenterplans")}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            {/* Orçamento */}
                            <AccordionItem value="orcamento" className="border-0">
                                <AccordionTrigger className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                                    Orçamento
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    <div className="space-y-1">
                                        <SidebarItem
                                            icon={DollarSign}
                                            label="Orçamentos"
                                            isActive={activeSection === "budgets"}
                                            onClick={() => handleSectionChange("budgets")}
                                        />
                                        <SidebarItem
                                            icon={Calendar}
                                            label="Períodos Orçamentários"
                                            isActive={activeSection === "budget-periods"}
                                            onClick={() => handleSectionChange("budget-periods")}
                                        />
                                        <SidebarItem
                                            icon={Calculator}
                                            label="Simulação"
                                            isActive={activeSection === "simulations"}
                                            onClick={() => handleSectionChange("simulations")}
                                        />
                                        <SidebarItem
                                            icon={TrendingUp}
                                            label="Projeções Econômicas"
                                            isActive={activeSection === "projections"}
                                            onClick={() => handleSectionChange("projections")}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            {/* Gestão de Pessoas */}
                            <AccordionItem value="pessoas" className="border-0">
                                <AccordionTrigger className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                                    Gestão de Pessoas
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    <div className="space-y-1">
                                        <SidebarItem
                                            icon={Calendar}
                                            label="Férias"
                                            isActive={activeSection === "vacations"}
                                            onClick={() => handleSectionChange("vacations")}
                                        />
                                        <SidebarItem
                                            icon={Clock}
                                            label="Horas Extras"
                                            isActive={activeSection === "overtimes"}
                                            onClick={() => handleSectionChange("overtimes")}
                                        />
                                        <SidebarItem
                                            icon={Gift}
                                            label="Benefícios"
                                            isActive={activeSection === "benefits"}
                                            onClick={() => handleSectionChange("benefits")}
                                        />
                                        <SidebarItem
                                            icon={Calendar}
                                            label="Escalas"
                                            isActive={activeSection === "schedules"}
                                            onClick={() => handleSectionChange("schedules")}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            {/* Monitoramento */}
                            <AccordionItem value="monitoramento" className="border-0">
                                <AccordionTrigger className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                                    Monitoramento
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    <div className="space-y-1">
                                        <SidebarItem
                                            icon={Eye}
                                            label="Acompanhamento Mensal"
                                            isActive={activeSection === "monitoring"}
                                            onClick={() => handleSectionChange("monitoring")}
                                        />
                                        <SidebarItem
                                            icon={BarChart3}
                                            label="Resumo Centro de Custos"
                                            isActive={activeSection === "costcenter-summary"}
                                            onClick={() => handleSectionChange("costcenter-summary")}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            {/* Relatórios */}
                            <AccordionItem value="relatorios" className="border-0">
                                <AccordionTrigger className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                                    Relatórios
                                </AccordionTrigger>
                                <AccordionContent className="pb-2">
                                    <div className="space-y-1">
                                        <SidebarItem
                                            icon={FileText}
                                            label="Relatórios"
                                            isActive={activeSection === "reports"}
                                            onClick={() => handleSectionChange("reports")}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            {/* Administração */}
                            {userRole === "admin" && (
                                <AccordionItem value="admin" className="border-0">
                                    <AccordionTrigger className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:no-underline">
                                        Administração
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-2">
                                        <div className="space-y-1">
                                            <SidebarItem
                                                icon={UserCheck}
                                                label="Usuários"
                                                isActive={activeSection === "user-management"}
                                                onClick={() => handleSectionChange("user-management")}
                                            />
                                            <SidebarItem
                                                icon={Users}
                                                label="Cargos"
                                                isActive={activeSection === "roles"}
                                                onClick={() => handleSectionChange("roles")}
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
            </SheetContent>
        </Sheet>
    );
};