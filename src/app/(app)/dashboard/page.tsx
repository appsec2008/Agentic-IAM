import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { MOCK_AGENTS, MOCK_INCIDENTS, MOCK_POLICIES, APP_NAME } from "@/lib/constants";
import { Users2, AlertTriangle, FileSliders, CheckCircle2, Activity, ShieldAlert, LayoutDashboard, GitBranch } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const activeIncidents = MOCK_INCIDENTS.filter(inc => inc.status === 'active').length;
  const averageTrustScore = MOCK_AGENTS.length > 0 
    ? (MOCK_AGENTS.reduce((sum, agent) => sum + agent.trustScore, 0) / MOCK_AGENTS.length).toFixed(0)
    : 'N/A';

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        description={`Welcome to ${APP_NAME}. Overview of your Agentic IAM ecosystem.`} 
        icon={LayoutDashboard} 
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Agents" value={MOCK_AGENTS.length} icon={Users2} description="Managed AI agents" />
        <StatCard title="Active Incidents" value={activeIncidents} icon={AlertTriangle} description="Requiring attention" />
        <StatCard title="Access Policies" value={MOCK_POLICIES.length} icon={FileSliders} description="Configured policies" />
        <StatCard title="Avg. Trust Score" value={`${averageTrustScore}%`} icon={CheckCircle2} description="System-wide agent trust" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest events and alerts in the system.</CardDescription>
          </CardHeader>
          <CardContent>
            {MOCK_INCIDENTS.slice(0, 3).map(incident => (
              <div key={incident.id} className="mb-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
                <h4 className="font-semibold text-foreground">{incident.summary}</h4>
                <p className="text-sm text-muted-foreground">Agent: {incident.agentAnsName || incident.agentId} - {new Date(incident.timestamp).toLocaleDateString()}</p>
                <Link href="/incidents">
                  <Button variant="link" size="sm" className="px-0 h-auto text-accent hover:text-primary">View Details</Button>
                </Link>
              </div>
            ))}
             {MOCK_INCIDENTS.length === 0 && <p className="text-muted-foreground">No recent incidents.</p>}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-6 w-6 text-primary" />
              System Status
            </CardTitle>
            <CardDescription>Quick overview of IAM components.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Agent Discovery (ANS)</span>
              <span className="font-semibold text-green-400">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Policy Enforcement</span>
              <span className="font-semibold text-green-400">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Global Session Layer</span>
              <span className="font-semibold text-yellow-400">Degraded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Audit Logging</span>
              <span className="font-semibold text-green-400">Operational</span>
            </div>
            {/* Removed placeholder image */}
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-primary" />
              Framework Overview
            </CardTitle>
            <CardDescription>Learn more about the Agentic AI IAM framework.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This application demonstrates key concepts from the "Agentic AI Identity and Access Management: A New Approach" paper. Explore different sections to see how Decentralized Identifiers (DIDs), Verifiable Credentials (VCs), and an Agent Naming Service (ANS) can enable robust, fine-grained access control and enhance security for Multi-Agent Systems.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="https://cloudsecurityalliance.org/blog/2025/03/11/agentic-ai-identity-management-approach/" target="_blank">Read CSA Paper (Placeholder)</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/agents">Explore Agents</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
