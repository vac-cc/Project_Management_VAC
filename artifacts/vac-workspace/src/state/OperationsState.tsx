import React, { createContext, useCallback, useContext, useState, type ReactNode } from "react";

// ── Global, cross-page operational state ─────────────────────────────
// Cost-line approvals (Tab 1) and outflow paid/pending toggles (Tab 3) must
// stay in sync when actioned from the Dashboard's Daily Action Hub, so this
// state lives above the router (see App.tsx) instead of inside each tab.

interface OperationsStateValue {
  approvals: Record<string, boolean>;
  setApproval: (id: string, value: boolean) => void;
  outflowOverrides: Record<string, boolean>;
  setOutflowPaid: (id: string, value: boolean) => void;
  completedDeadlines: Record<string, boolean>;
  toggleDeadlineComplete: (id: string) => void;
}

const OperationsStateContext = createContext<OperationsStateValue | null>(null);

export function OperationsStateProvider({ children }: { children: ReactNode }) {
  const [approvals, setApprovals] = useState<Record<string, boolean>>({});
  const [outflowOverrides, setOutflowOverrides] = useState<Record<string, boolean>>({});
  const [completedDeadlines, setCompletedDeadlines] = useState<Record<string, boolean>>({});

  const setApproval = useCallback((id: string, value: boolean) => {
    setApprovals((prev) => ({ ...prev, [id]: value }));
  }, []);

  const setOutflowPaid = useCallback((id: string, value: boolean) => {
    setOutflowOverrides((prev) => ({ ...prev, [id]: value }));
  }, []);

  const toggleDeadlineComplete = useCallback((id: string) => {
    setCompletedDeadlines((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  return (
    <OperationsStateContext.Provider
      value={{ approvals, setApproval, outflowOverrides, setOutflowPaid, completedDeadlines, toggleDeadlineComplete }}
    >
      {children}
    </OperationsStateContext.Provider>
  );
}

export function useOperationsState(): OperationsStateValue {
  const ctx = useContext(OperationsStateContext);
  if (!ctx) throw new Error("useOperationsState must be used within an OperationsStateProvider");
  return ctx;
}
