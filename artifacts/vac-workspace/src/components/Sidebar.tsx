import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  FolderKanban,
  Users,
  Briefcase,
  ShieldCheck,
  Settings,
  CircleDashed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import logoSrc from "@assets/Branding_RGB_V2-01_1782856164314.png";
import { PATTERN_BANK } from "../data/assigneePalette";

const navItems = [
  { name: "Dashboard", path: "/",        icon: LayoutDashboard },
  { name: "Projects",  path: "/projects", icon: FolderKanban   },
  { name: "Clients",   path: "/clients",  icon: Users          },
  { name: "Onboarding", path: "/onboarding", icon: ClipboardList },
  { name: "Finance",   path: "/finance",  icon: Briefcase      },
  { name: "Vault",     path: "/vault",    icon: ShieldCheck    },
  { name: "Team",      path: "/team",     icon: CircleDashed   },
  { name: "Settings",  path: "/settings", icon: Settings       },
];

const TEAM_AVATARS = [
  { initials: "PO", palette: PATTERN_BANK.stripedGreen },
  { initials: "CP", palette: PATTERN_BANK.dottedGreen },
  { initials: "AA", palette: PATTERN_BANK.solidTerracotta },
  { initials: "IF", palette: PATTERN_BANK.stripedTerracotta },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [location] = useLocation();

  return (
    <aside
      style={{ width: collapsed ? 52 : 220 }}
      className="h-full bg-sidebar border-r border-border flex flex-col justify-between py-7 shrink-0 overflow-hidden transition-[width] duration-300"
    >
      <div className="flex-1 min-h-0">

        {/* Logo row + collapse toggle */}
        <div className="flex items-center justify-between px-4 mb-10">
          {!collapsed && (
            <img
              src={logoSrc}
              alt="VĀC Conscious Communication"
              className="w-[100px] object-contain"
              style={{ mixBlendMode: "multiply" }}
              data-testid="img-vac-logo"
            />
          )}
          <button
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`w-7 h-7 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white transition-colors shrink-0 ${collapsed ? "mx-auto" : "ml-auto"}`}
          >
            {collapsed
              ? <ChevronRight size={13} />
              : <ChevronLeft  size={13} />
            }
          </button>
        </div>

        <nav className="flex flex-col">
          {navItems.map((item) => {
            const isActive =
              location === item.path ||
              (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.name} href={item.path}>
                <div
                  data-testid={`nav-item-${item.name.toLowerCase()}`}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 py-2.5 cursor-pointer transition-all duration-150 border-l-2 ${
                    collapsed ? "px-0 justify-center" : "px-6"
                  } ${
                    isActive
                      ? "bg-white border-l-accent text-foreground"
                      : "border-l-transparent text-muted-foreground hover:bg-white hover:text-foreground"
                  }`}
                >
                  <item.icon size={15} className={`shrink-0 ${isActive ? "text-accent" : ""}`} />
                  {!collapsed && (
                    <span className="font-bold text-sm tracking-wide whitespace-nowrap">{item.name}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Active Team — hidden when collapsed */}
      {!collapsed && (
        <div className="px-6 space-y-3 border-t border-border pt-6">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Active Team</p>
          <div className="flex gap-1.5">
            {TEAM_AVATARS.map(({ initials, palette }) => (
              <div
                key={initials}
                data-testid={`avatar-team-${initials}`}
                className="w-8 h-8 flex items-center justify-center text-[10px] font-bold relative"
                style={{ ...palette.bar, color: palette.text }}
              >
                {initials}
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-accent border border-sidebar" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsed: show palette dots only */}
      {collapsed && (
        <div className="flex flex-col items-center gap-1.5 border-t border-border pt-4 pb-1">
          {TEAM_AVATARS.map(({ initials, palette }) => (
            <div
              key={initials}
              className="w-6 h-6 flex items-center justify-center text-[8px] font-bold"
              style={{ ...palette.bar, color: palette.text }}
            >
              {initials}
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
