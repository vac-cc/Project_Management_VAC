import React, { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "../components/Sidebar";
import ZoneA from "../components/ZoneA";
import ZoneB from "../components/ZoneB";
import ZoneC from "../components/ZoneC";
import TeamPage from "./TeamPage";
import ClientsPage from "./ClientsPage";
import ProjectsPage from "./ProjectsPage";

export default function Workspace() {
  const [pendingCount, setPendingCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [location] = useLocation();

  const isTeam     = location === "/team";
  const isClients  = location === "/clients";
  const isProjects = location === "/projects";
  const isWorkspace = !isTeam && !isClients && !isProjects;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main content — expands smoothly when sidebar collapses */}
      <div className="flex flex-1 min-w-0 transition-all duration-300 overflow-hidden">
        {isTeam     && <TeamPage />}
        {isClients  && <ClientsPage />}
        {isProjects && <ProjectsPage />}
        {isWorkspace && (
          <>
            <ZoneA />
            <ZoneB onCostSubmitted={() => setPendingCount((n) => n + 1)} />
            <ZoneC pendingCount={pendingCount} />
          </>
        )}
      </div>
    </div>
  );
}
