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
    <aside className="w-[220px] h-full bg-sidebar border-r border-border flex flex-col justify-between p-6 shrink-0">
      <div>
        <div className="mb-10 pl-2">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-accent">V</span>Ā<span className="text-primary">C</span>
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">Conscious OS</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.path || (item.path !== "/" && location.startsWith(item.path));
            return (
              <Link key={item.name} href={item.path}>
                <div 
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? "bg-card text-foreground border-l-4 border-l-primary" 
                      : "text-muted-foreground hover:bg-card/50 hover:text-foreground border-l-4 border-l-transparent"
                  }`}
                >
                  <item.icon size={18} className={isActive ? "text-primary" : ""} />
                  <span className="font-semibold text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-2">Active Team</h3>
        <div className="flex -space-x-2 pl-2">
          {['CF', 'MS', 'JP'].map((initials, i) => (
            <div key={i} className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-xs font-bold relative">
              {initials}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-accent border-2 border-sidebar animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
