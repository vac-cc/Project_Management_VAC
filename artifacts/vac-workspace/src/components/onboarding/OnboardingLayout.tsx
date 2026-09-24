import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/Sidebar";
import vacLogo from "@assets/Branding_RGB_V2-01_1782856164314.png";
import symbol02 from "@/assets/symbols/symbol-02.png";
import symbol04 from "@/assets/symbols/symbol-04.png";
import symbol06 from "@/assets/symbols/symbol-06.png";

// ── Onboarding section shell ─────────────────────────────────────────
// The global Workspace sidebar stays on the left (collapsed by default so the
// onboarding section gets room), and the onboarding console keeps its own
// secondary sidebar and visual language, scoped by the `.vac-onboarding`
// class (see styles/onboarding.css).

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/onboarding", label: "Overview" },
  { href: "/onboarding/sessions", label: "Sessions" },
];

export default function OnboardingLayout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [workspaceCollapsed, setWorkspaceCollapsed] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar
        collapsed={workspaceCollapsed}
        onToggle={() => setWorkspaceCollapsed((c) => !c)}
      />

      <div className="vac-onboarding flex flex-1 min-w-0 h-full bg-background text-foreground">
        <aside
          className="w-56 border-r border-border flex-shrink-0 flex flex-col h-full overflow-y-auto"
          style={{ background: "hsl(var(--sidebar))" }}
        >
          {/* Logo */}
          <div className="px-6 pt-8 pb-5 border-b border-border">
            <Link href="/onboarding" className="block">
              <img
                src={vacLogo}
                alt="Vāc conscious communication"
                style={{ height: "44px", width: "auto", objectFit: "contain", objectPosition: "left" }}
              />
            </Link>
          </div>

          {/* Brand symbols row, matching the website's top right trio */}
          <div
            className="px-6 pt-4 pb-3 border-b border-border"
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <img src={symbol02} alt="" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
            <img src={symbol04} alt="" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
            <img src={symbol06} alt="" style={{ width: "22px", height: "22px", objectFit: "contain" }} />
          </div>

          <div className="px-7 pt-6 pb-1">
            <p className="label-mono">Client Onboarding</p>
          </div>

          <nav className="flex-1 px-4 pt-2">
            <div className="space-y-0">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/onboarding"
                    ? location === "/onboarding"
                    : location.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-testid={`nav-${item.label.toLowerCase()}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150",
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span
                      style={{
                        fontFamily: "var(--app-font-brand)",
                        fontSize: "1rem",
                        color: isActive ? "hsl(var(--primary))" : "transparent",
                        lineHeight: 1,
                        transition: "color 0.15s",
                      }}
                    >
                      /
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* New session CTA */}
          <div className="px-4 pb-6 pt-4">
            <Link
              href="/onboarding/new"
              data-testid="nav-new-session"
              className="block w-full text-center py-2.5 text-sm border transition-colors duration-200 font-medium"
              style={{
                borderColor: "hsl(var(--primary))",
                color: "hsl(var(--primary))",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "hsl(var(--primary))";
                (e.currentTarget as HTMLElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "hsl(var(--primary))";
              }}
            >
              + New Session
            </Link>
          </div>

          {/* Footer agency name */}
          <div className="px-6 pb-8 border-t border-border pt-4" style={{ marginTop: "auto" }}>
            <p
              style={{
                fontFamily: "var(--app-font-brand)",
                fontSize: "0.58rem",
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "hsl(var(--muted-foreground))",
                lineHeight: 1.6,
              }}
            >
              Vāc • Conscious<br />Communication
            </p>
          </div>
        </aside>

        <main className="flex-1 overflow-auto h-full bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
