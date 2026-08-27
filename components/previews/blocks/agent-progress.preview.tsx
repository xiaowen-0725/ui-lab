"use client";

// Ported from beUI (starc007/ui-components, MIT).

import { AgentProgress } from "@/components/agents/loading-states/agent-progress";

export function AgentProgressPreview() {
  return (
    <AgentProgress
      label="Churning"
      initialSeconds={151.6}
      className="text-base"
    />
  );
}
