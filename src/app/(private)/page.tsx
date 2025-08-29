// FILE: src/app/(private)/page.tsx
"use client"
import { Header } from "@/components/layout/Header";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { DashboardContent } from "./dashboard/page";
import CompanyManager from "./companies/page";
import { ProtectedPage } from "@/components/layout/ProtectedPage";
import RoleManager from "./roles/page";
import UserManager from "./users/page";
import EmployeeManager from "./employees/page";
import DepartmentManager from "./departments/page";
import SectorManager from "./sectors/page";
import TeamManager from "./teams/page";
import CostCenterManager from "./costcenters/page";
import PremiseManager from "./premises/page";
import BudgetPeriodManager from "./budgetperiods/page";
import { BudgetManager } from "./budgets/page";
import { VacationManager } from "./vacations/page";
import OvertimeManager from "./overtimes/page";
import CostCenterPlanManager from "./costcenterplans/page";
import { useCompany } from "@/context/CompanyContext";
import CompanySelector from "./companies/components/CompanySelector";
import { useAuth } from "@/context/AuthContext";


export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // >>> pega usuário real do AuthContext
  const { user: authUser } = useAuth();

  // >>> garanta que role seja string
  const roleName =
    typeof authUser?.role === "string"
      ? authUser.role
      : (authUser?.role as any)?.name ?? "user";

  const headerUser = {
    name: authUser?.name ?? "—",
    role: roleName,          // <- string garantida
    email: authUser?.email ?? "",
  };

  const { isCompanySelected, companies } = useCompany();
  const [showInitialSelector, setShowInitialSelector] = useState(true);

  useEffect(() => {
    if (isCompanySelected) setShowInitialSelector(false);
  }, [isCompanySelected]);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent />
      case "companies":
        return <CompanyManager />;
      case "employees":
        return <EmployeeManager />;
      case "departments":
        return <DepartmentManager />;
      case "sectors":
        return <SectorManager />;
      case "teams":
        return <TeamManager />;
      case "costcenters":
        return <CostCenterManager />;
      case "premises":
        return <PremiseManager />;
      case "costcenterplans":
        return <CostCenterPlanManager />
      case "badget":
        return <BudgetManager />
      case "budgetperiods":
        return <BudgetPeriodManager />
      case "vacations":
        return <VacationManager />
      case "overtimes":
        return <OvertimeManager />
      case "users":
        return <UserManager />
      case "roles":
        return <RoleManager />
      default:
        return <DashboardContent />
    }
  };

  // Bloqueia a tela até escolher uma empresa (se existirem empresas)
  if (!isCompanySelected && companies.length > 0) {
    return (
      <div className="h-screen bg-gray-50 flex items-center justify-center">
        <CompanySelector
          isOpen={showInitialSelector}
          onClose={() => {
            if (isCompanySelected) setShowInitialSelector(false);
          }}
          title="Bem-vindo ao Sistema"
          description="Selecione a empresa para começar a trabalhar"
        />
      </div>
    );
  }

  return (
    <ProtectedPage>
      <div className="h-screen bg-gray-50 flex w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={roleName}
        />

        {/* Mobile Sidebar */}
        <MobileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={roleName}
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        />
        <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
          <Header user={headerUser} onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">{renderContent()}</main>
        </div>
      </div>
    </ProtectedPage>
  );
}
