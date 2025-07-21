"use client"
import { Header } from "@/components/layout/Header";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Sidebar } from "@/components/layout/Sidebar";
import Image from "next/image";
import React, { useState } from "react";
import { DashboardContent } from "./(private)/dashboard/page";

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
      default:
        return <DashboardContent/>
    }
  }

  return (
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
  );
}
