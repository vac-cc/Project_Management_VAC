import React, { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "../components/Sidebar";
import TeamPage from "./TeamPage";
import ClientsPage from "./ClientsPage";
import ProjectsPage from "./ProjectsPage";
import FinancePage from "./FinancePage";
import DashboardPage from "./DashboardPage";

export default function Workspace() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location] = useLocation();

  const isTeam      = location === "/team";
  const isClients   = location === "/clients";
  const isProjects  = location === "/projects";
  const isFinance   = location === "/finance";
  const isDashboard = !isTeam && !isClients && !isProjects && !isFinance;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main content — expands smoothly when sidebar collapses */}
      <div className="flex flex-1 min-w-0 transition-all duration-300 overflow-hidden">
        {isTeam      && <TeamPage />}
        {isClients   && <ClientsPage />}
        {isProjects  && <ProjectsPage />}
        {isFinance   && <FinancePage />}
        {isDashboard && <DashboardPage />}
      </div>
    </div>
  );
}
