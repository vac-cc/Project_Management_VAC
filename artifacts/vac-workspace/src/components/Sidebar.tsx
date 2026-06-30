import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Briefcase,
  ShieldCheck,
  Settings,
  CircleDashed
} from "lucide-react";
import { Link, useLocation } from "wouter";
import logoSrc from "@assets/Branding_RGB_V2-01_1782856164314.png";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Clients", path: "/clients", icon: Users },
  { name: "Finance", path: "/finance", icon: Briefcase },
  { name: "Vault", path: "/vault", icon: ShieldCheck },
  { name: "Team", path: "/team", icon: CircleDashed },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-[220px] h-full bg-sidebar border-r border-border flex flex-col justify-between py-7 shrink-0 overflow-hidden">
      <div>
        {/* Logo — mix-blend-mode:multiply makes black bg transparent on white */}
        <div className="px-6 mb-10">
          <img
            src={logoSrc}
            alt="VĀC Conscious Communication"
            className="w-[120px] object-contain"
            style={{ mixBlendMode: "multiply" }}
            data-testid="img-vac-logo"
          />
        </div>

        <nav className="flex flex-col">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.name} href={item.path}>
                <div
                  data-testid={`nav-item-${item.name.toLowerCase()}`}
                  className={`flex items-center gap-3 px-6 py-2.5 cursor-pointer transition-all duration-150 border-l-2 ${
                    isActive
                      ? "bg-white border-l-accent text-foreground"
                      : "border-l-transparent text-muted-foreground hover:bg-white hover:text-foreground"
                  }`}
                >
                  <item.icon size={15} className={isActive ? "text-accent" : ""} />
                  <span className="font-bold text-sm tracking-wide">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Active Team */}
      <div className="px-6 space-y-3 border-t border-border pt-6">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Active Team</p>
        <div className="flex gap-1.5">
          {[
            { initials: "CF", bg: "bg-accent" },
            { initials: "MS", bg: "bg-primary" },
            { initials: "JP", bg: "bg-foreground" },
          ].map(({ initials, bg }) => (
            <div
              key={initials}
              data-testid={`avatar-team-${initials}`}
              className={`w-8 h-8 ${bg} flex items-center justify-center text-[10px] font-bold text-white relative`}
            >
              {initials}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-accent border border-sidebar" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
