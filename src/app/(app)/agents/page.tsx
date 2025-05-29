import { PageHeader } from "@/components/layout/page-header";
import { AgentCard } from "@/components/agents/agent-card";
import { MOCK_AGENTS } from "@/lib/constants";
import { Users2, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AgentsPage() {
  // In a real app, you'd fetch agents and handle filtering/search server-side or client-side with state.
  // For this demo, we're just displaying all mock agents.
  // Add a simple client-side search for demonstration if time permits.

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Agent Management" 
        description="View, manage, and monitor AI agents within the ecosystem."
        icon={Users2}
      />
      
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <Input 
          placeholder="Search agents by name, DID, or ANS name..." 
          className="max-w-sm bg-card text-card-foreground placeholder:text-muted-foreground"
        />
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <PlusCircle className="mr-2 h-4 w-4" /> Register New Agent
        </Button>
      </div>

      {MOCK_AGENTS.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground text-lg">No agents found.</p>
          <Button variant="link" className="mt-2 text-accent hover:text-primary">Register your first agent</Button>
        </div>
      )}
    </div>
  );
}
