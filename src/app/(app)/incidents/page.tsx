// This page needs to be client component to handle state for incidents
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { IncidentTools } from "@/components/incidents/incident-tools";
import { IncidentList } from "@/components/incidents/incident-list";
import { MOCK_INCIDENTS, MOCK_AGENTS } from "@/lib/constants";
import type { Incident, Agent } from "@/lib/types";
import { AlertTriangle, Check, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";


export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS); // If we need to update agent status
  const { toast } = useToast();

  // Example: if analyzeBehaviorAction from IncidentTools creates a new incident,
  // we would need a way to update the `incidents` state here.
  // This could be done via a callback prop, context, or a state management library.
  // For now, we'll rely on initial mock data.

  const handleQuarantineAgent = (agentId: string) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId ? { ...agent, status: 'quarantined' as const } : agent
      )
    );
    // Also update any related incidents if necessary, e.g. to "under_investigation"
    setIncidents(prevIncidents => 
      prevIncidents.map(inc => 
        inc.agentId === agentId && inc.status === 'active' ? { ...inc, status: 'under_investigation' as const } : inc
      )  
    );
    toast({
      title: "Agent Quarantined",
      description: `Agent ${agentId.substring(0,25)}... has been quarantined.`,
      action: <Shield className="text-yellow-500" />,
    });
  };
  
  const activeIncidents = incidents.filter(inc => inc.status === 'active' || inc.status === 'under_investigation');
  const resolvedIncidents = incidents.filter(inc => inc.status === 'resolved' || inc.status === 'false_positive');


  return (
    <div className="space-y-8">
      <PageHeader 
        title="Incident Response"
        description="Analyze agent behavior, summarize reports, and manage security incidents."
        icon={AlertTriangle}
      />

      <IncidentTools />
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Incident Management</h2>
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px] bg-card border border-border">
            <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Active Incidents ({activeIncidents.length})</TabsTrigger>
            <TabsTrigger value="resolved" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Resolved Incidents ({resolvedIncidents.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="mt-4">
            <IncidentList incidents={activeIncidents} onQuarantineAgent={handleQuarantineAgent} />
          </TabsContent>
          <TabsContent value="resolved" className="mt-4">
            <IncidentList incidents={resolvedIncidents} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
