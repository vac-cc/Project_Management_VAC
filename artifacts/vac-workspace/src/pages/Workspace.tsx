import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ZoneA from "../components/ZoneA";
import ZoneB from "../components/ZoneB";
import ZoneC from "../components/ZoneC";

export default function Workspace() {
  const [pendingCount, setPendingCount] = useState(0);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      <Sidebar />
      <ZoneA />
      <ZoneB onCostSubmitted={() => setPendingCount((n) => n + 1)} />
      <ZoneC pendingCount={pendingCount} />
    </div>
  );
}
