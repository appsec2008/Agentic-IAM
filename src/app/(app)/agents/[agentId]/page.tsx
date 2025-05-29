import { MOCK_AGENTS } from "@/lib/constants";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VCDisplay } from "@/components/agents/vc-display";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Users2, Fingerprint, Globe, Brain, ShieldCheck, CheckCircle2, AlertTriangle, Shield, XCircle, Edit, Share2, FileText, KeyRound, LinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AgentDetailPageProps {
  params: { agentId: string };
}

const statusIcons = {
  active: <CheckCircle2 className="h-5 w-5 text-green-400" />,
  inactive: <XCircle className="h-5 w-5 text-gray-400" />,
  quarantined: <AlertTriangle className="h-5 w-5 text-yellow-400" />,
  revoked: <Shield className="h-5 w-5 text-red-400" />,
};

const statusTextColors : Record<string, string> = {
  active: "text-green-400",
  inactive: "text-gray-400",
  quarantined: "text-yellow-400",
  revoked: "text-red-400",
};


export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const agentId = decodeURIComponent(params.agentId);
  const agent = MOCK_AGENTS.find((a) => a.id === agentId);

  if (!agent) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title={agent.name}
        description={`Detailed information for agent: ${agent.id}`}
        icon={Users2}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agent Info Card */}
        <Card className="lg:col-span-1 shadow-xl">
          <CardHeader className="items-center text-center">
            {agent.avatar && (
              <Image 
                src={agent.avatar} 
                alt={agent.name} 
                width={128} 
                height={128} 
                className="rounded-full mb-4 border-4 border-primary shadow-md" 
                data-ai-hint={agent.dataAiHint || "abstract identity"}
              />
            )}
            <CardTitle className="text-2xl text-foreground">{agent.name}</CardTitle>
            <div className={`flex items-center gap-2 font-semibold ${statusTextColors[agent.status]}`}>
              {statusIcons[agent.status]}
              <span className="capitalize">{agent.status}</span>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Fingerprint className="h-5 w-5 text-accent" />
              <span className="font-medium">DID:</span>
              <span className="text-foreground truncate" title={agent.id}>{agent.id}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="h-5 w-5 text-accent" />
              <span className="font-medium">ANS Name:</span>
              <span className="text-foreground truncate" title={agent.ansName}>{agent.ansName}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Brain className="h-5 w-5 text-accent" />
              <span className="font-medium">Model:</span>
              <span className="text-foreground">{agent.modelInfo || "N/A"}</span>
            </div>
             <div className="flex items-center gap-2 text-muted-foreground">
              <Users2 className="h-5 w-5 text-accent" />
              <span className="font-medium">Creator:</span>
              <span className="text-foreground truncate" title={agent.creator}>{agent.creator || "N/A"}</span>
            </div>
            <Separator className="my-3 bg-border/50" />
            <p className="text-muted-foreground">{agent.description || "No detailed description."}</p>
            <div className="pt-2">
              <h4 className="font-semibold mb-1 text-foreground">Capabilities:</h4>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map(cap => <Badge key={cap} variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/50">{cap}</Badge>)}
              </div>
            </div>
            <div className="pt-2">
              <h4 className="font-semibold mb-1 text-foreground">Roles:</h4>
              <div className="flex flex-wrap gap-2">
                {agent.roles.map(role => <Badge key={role} variant="outline" className="border-primary/50 text-primary">{role}</Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Trust Score, VCs, Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                <ShieldCheck className="h-6 w-6 text-primary" />
                Trust & Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-card-foreground/5 rounded-lg">
                <span className="text-lg font-medium text-muted-foreground">Trust Score:</span>
                <span className={`text-3xl font-bold ${agent.trustScore > 75 ? 'text-green-400' : agent.trustScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {agent.trustScore}%
                </span>
              </div>
              {agent.didDocument && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2"><KeyRound className="h-5 w-5 text-accent"/>DID Document Snippet:</h4>
                  <pre className="text-xs bg-muted/30 p-3 rounded-md overflow-x-auto text-muted-foreground">
                    {JSON.stringify(agent.didDocument, null, 2)}
                  </pre>
                </div>
              )}
              <div className="mt-6 flex gap-2">
                <Button variant="outline"><Edit className="mr-2 h-4 w-4"/> Edit Agent</Button>
                <Button variant="destructive" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  {agent.status === "quarantined" ? "Release Agent" : "Quarantine Agent"}
                </Button>
                 <Button asChild variant="secondary">
                    <Link href={`/attestation?agentId=${encodeURIComponent(agent.id)}`}>
                        <FileText className="mr-2 h-4 w-4" /> Generate Attestation
                    </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-foreground">
                <LinkIcon className="h-6 w-6 text-primary" />
                Verifiable Credentials ({agent.vcs.length})
              </CardTitle>
              <CardDescription>Attestations about the agent's attributes and capabilities.</CardDescription>
            </CardHeader>
            <CardContent>
              {agent.vcs.length > 0 ? (
                <div className="space-y-4">
                  {agent.vcs.map(vc => <VCDisplay key={vc.id} vc={vc} />)}
                </div>
              ) : (
                <p className="text-muted-foreground">This agent holds no Verifiable Credentials.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
