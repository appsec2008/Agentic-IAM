import Link from "next/link";
import Image from "next/image";
import type { Agent } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Shield, XCircle, AlertTriangle, Fingerprint } from "lucide-react";

interface AgentCardProps {
  agent: Agent;
}

const statusIcons = {
  active: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  inactive: <XCircle className="h-4 w-4 text-gray-500" />,
  quarantined: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  revoked: <Shield className="h-4 w-4 text-red-500" />,
};

const statusColors: Record<Agent['status'], string> = {
  active: "bg-green-500/20 text-green-300 border-green-500/50",
  inactive: "bg-gray-500/20 text-gray-300 border-gray-500/50",
  quarantined: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
  revoked: "bg-red-500/20 text-red-300 border-red-500/50",
};


export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          {agent.avatar && (
             <Image src={agent.avatar} alt={agent.name} width={48} height={48} className="rounded-full mr-4 border-2 border-primary" data-ai-hint={agent.dataAiHint || "abstract identity"} />
          )}
          <Badge variant="outline" className={`capitalize ${statusColors[agent.status]}`}>
            {statusIcons[agent.status]}
            <span className="ml-1">{agent.status}</span>
          </Badge>
        </div>
        <CardTitle className="mt-2 text-lg text-foreground">{agent.name}</CardTitle>
        <CardDescription className="text-xs truncate text-muted-foreground flex items-center gap-1">
         <Fingerprint className="h-3 w-3" /> {agent.id}
        </CardDescription>
        <CardDescription className="text-xs truncate text-muted-foreground">{agent.ansName}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{agent.description || "No description available."}</p>
        <div className="text-sm text-muted-foreground">
          Trust Score: <span className={`font-bold ${agent.trustScore > 75 ? 'text-green-400' : agent.trustScore > 50 ? 'text-yellow-400' : 'text-red-400'}`}>{agent.trustScore}%</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full hover:bg-accent/80">
          <Link href={`/agents/${encodeURIComponent(agent.id)}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
