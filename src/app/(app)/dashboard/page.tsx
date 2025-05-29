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
          </CardContent>
        </Card>
      </div>
       <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-6 w-6 text-primary" />
              Framework Overview
            </CardTitle>
            <CardDescription>
              A Novel Zero-Trust Identity Framework for Agentic AI: Decentralized Authentication and Fine-Grained Access Control
              <br />
              <span className="text-xs text-muted-foreground">
                Ken Huang, Vineeth Sai Narajala, John Yeoh, Ramesh Raskar, Youssef Harkati, Jerry Huang, Idan Habler, Chris Hughes
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3 text-sm">
              Traditional Identity and Access Management (IAM) systems, primarily designed for human users or static machine identities via protocols such as OAuth, OpenID Connect (OIDC), and SAML, prove fundamentally inadequate for the dynamic, interdependent, and often ephemeral nature of AI agents operating at scale within Multi Agent Systems (MAS), a computational system composed of multiple interacting intelligent agents that work collectively.
            </p>
            <p className="text-muted-foreground mb-3 text-sm">
              This paper posits the imperative for a novel Agentic AI IAM framework: We deconstruct the limitations of existing protocols when applied to MAS, illustrating with concrete examples why their coarse-grained controls, single-entity focus, and lack of context-awareness falter. We then propose a comprehensive framework built upon rich, verifiable Agent Identities (IDs), leveraging Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs), that encapsulate an agents capabilities, provenance, behavioral scope, and security posture.
            </p>
            <p className="text-muted-foreground mb-3 text-sm">
              Our framework includes an Agent Naming Service (ANS) for secure and capability-aware discovery, dynamic fine-grained access control mechanisms, and critically, a unified global session management and policy enforcement layer for real-time control and consistent revocation across heterogeneous agent communication protocols. We also explore how Zero-Knowledge Proofs (ZKPs) enable privacy-preserving attribute disclosure and verifiable policy compliance.
            </p>
            <p className="text-muted-foreground mb-4 text-sm">
              We outline the architecture, operational lifecycle, innovative contributions, and security considerations of this new IAM paradigm, aiming to establish the foundational trust, accountability, and security necessary for the burgeoning field of agentic AI and the complex ecosystems they will inhabit.
            </p>
            <div className="flex gap-4">
              <Button asChild variant="outline">
                <Link href="https://arxiv.org/abs/2505.19301" target="_blank">Read ArXiv Paper</Link>
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
