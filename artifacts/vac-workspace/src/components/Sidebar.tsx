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
    <aside className="w-[220px] h-full bg-sidebar border-r border-border flex flex-col justify-between py-6 shrink-0 overflow-hidden">
      {/* Logo */}
      <div>
        <div className="px-5 mb-8">
          <img
            src={logoSrc}
            alt="VĀC Conscious Communication"
            className="w-[130px] object-contain"
            data-testid="img-vac-logo"
          />
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.name} href={item.path}>
                <div
                  data-testid={`nav-item-${item.name.toLowerCase()}`}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group relative ${
                    isActive
                      ? "bg-card text-foreground"
                      : "text-muted-foreground hover:bg-card/40 hover:text-foreground"
                  }`}
                >
                  {/* Active indicator — "/" brand mark */}
                  <span
                    className={`absolute left-0 top-1/2 -translate-y-1/2 text-base font-bold leading-none transition-all duration-200 ${
                      isActive ? "text-accent opacity-100" : "opacity-0"
                    }`}
                    aria-hidden="true"
                  >
                    /
                  </span>

                  <item.icon
                    size={16}
                    className={`shrink-0 transition-colors ${isActive ? "text-accent" : "group-hover:text-foreground"}`}
                  />
                  <span className="font-semibold text-sm tracking-wide">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Active Team */}
      <div className="px-5 space-y-3">
        <p className="text-[9px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">Active Team</p>
        <div className="flex -space-x-2">
          {["CF", "MS", "JP"].map((initials, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-card border-2 border-sidebar flex items-center justify-center text-[10px] font-bold relative"
              data-testid={`avatar-team-${initials}`}
            >
              {initials}
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-accent border-2 border-sidebar animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
