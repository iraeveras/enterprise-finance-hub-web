// FILE: src/app/page.tsx
"use client"
import { Header } from "@/components/layout/Header";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import Image from "next/image";
import React, { useState } from "react";
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

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user] = useState({
    name: "Administrador",
    role: "admin",
    email: "admin@empresa.com",
  });

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent/>
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
      case "badget":
        return <BudgetManager/>
      case "budgetperiods":
        return <BudgetPeriodManager/>
      case "vacations":
        return <VacationManager/>
      case "users":
        return <UserManager/>
      case "roles":
        return <RoleManager/>
      default:
        return <DashboardContent/>
    }
  }

  return (
    <ProtectedPage>
      <div className="h-screen bg-gray-50 flex w-full overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={user.role}
        />

        {/* Mobile Sidebar */}
        <MobileSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          userRole={user.role}
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        />
        <div className="flex-1 flex flex-col md:ml-64 overflow-hidden">
          <Header user={user} onMobileMenuToggle={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">{renderContent()}</main>
        </div>
      </div>
    </ProtectedPage>
  );
}
