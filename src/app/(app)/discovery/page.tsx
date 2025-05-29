// For now, this page will be client-rendered to handle form state and mock filtering.
"use client"; 

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_AGENTS } from "@/lib/constants";
import type { Agent } from "@/lib/types";
import { SearchCode, SlidersHorizontal, Fingerprint, Bot, Zap, Verified } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DiscoveryPage() {
  const [capability, setCapability] = useState("");
  const [provider, setProvider] = useState("");
  const [protocol, setProtocol] = useState("");
  const [version, setVersion] = useState("");
  const [discoveredAgents, setDiscoveredAgents] = useState<Agent[]>([]);
  const [searched, setSearched] = useState(false);

  const handleDiscover = () => {
    setSearched(true);
    // Mock AI-powered discovery: filter mock agents
    // A real ANS query would be an API call, possibly to a GenAI flow.
    const results = MOCK_AGENTS.filter(agent => {
      let match = true;
      if (capability && !agent.capabilities.some(c => c.toLowerCase().includes(capability.toLowerCase()))) {
        match = false;
      }
      // ANSName parsing for provider, protocol, version is complex.
      // Simple includes check for demonstration.
      if (provider && !agent.ansName.toLowerCase().includes(provider.toLowerCase())) {
        match = false;
      }
      if (protocol && !agent.ansName.toLowerCase().startsWith(protocol.toLowerCase() + "://")) {
        match = false;
      }
      if (version && !agent.ansName.toLowerCase().includes(`.v${version.toLowerCase()}`)) {
         // simplified version check
        const versionPart = agent.ansName.split('.').find(part => part.startsWith('v'));
        if (!versionPart || !versionPart.includes(version)) {
            match = false;
        }
      }
      return match;
    });
    setDiscoveredAgents(results);
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Agent Discovery (ANS)"
        description="Find AI agents based on capabilities, provider, protocol, and version."
        icon={SearchCode}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Discovery Parameters
          </CardTitle>
          <CardDescription>
            Use the fields below to query the Agent Naming Service. 
            Example ANS Name: <code>protocol://AgentFunction.CapabilityDomain.Provider.Version</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input 
            placeholder="Capability (e.g., FinancialRiskAnalysis)" 
            value={capability} 
            onChange={(e) => setCapability(e.target.value)}
            className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"
          />
          <Input 
            placeholder="Provider (e.g., AcmeFinanceServices)" 
            value={provider} 
            onChange={(e) => setProvider(e.target.value)}
            className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"
          />
          <Input 
            placeholder="Protocol (e.g., acp)" 
            value={protocol} 
            onChange={(e) => setProtocol(e.target.value)}
            className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"
          />
          <Input 
            placeholder="Version (e.g., 2.1.3)" 
            value={version} 
            onChange={(e) => setVersion(e.target.value)}
            className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"
          />
        </CardContent>
        <CardFooter>
          <Button onClick={handleDiscover} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <SearchCode className="mr-2 h-4 w-4" /> Discover Agents
          </Button>
        </CardFooter>
      </Card>

      {searched && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Discovered Agents ({discoveredAgents.length})</h2>
          {discoveredAgents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {discoveredAgents.map(agent => (
                <Card key={agent.id} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                       {agent.avatar && (
                        <Image src={agent.avatar} alt={agent.name} width={40} height={40} className="rounded-full mr-3 border-2 border-accent" data-ai-hint={agent.dataAiHint || "abstract identity"}/>
                      )}
                      <Badge variant="outline" className={agent.trustScore > 75 ? "border-green-500 text-green-400" : "border-yellow-500 text-yellow-400"}>
                        Trust: {agent.trustScore}%
                      </Badge>
                    </div>
                    <CardTitle className="text-md mt-2 text-foreground flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" /> {agent.name}
                    </CardTitle>
                    <CardDescription className="text-xs truncate text-muted-foreground">{agent.ansName}</CardDescription>
                    <CardDescription className="text-xs truncate text-muted-foreground flex items-center gap-1">
                      <Fingerprint className="h-3 w-3" /> {agent.id}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground mb-2 text-xs line-clamp-2">{agent.description}</p>
                    <div className="mb-2">
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Zap className="h-3 w-3" /> Capabilities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {agent.capabilities.slice(0,3).map(cap => <Badge key={cap} variant="secondary" className="text-xs bg-accent/20 text-accent-foreground border-accent/50">{cap}</Badge>)}
                        {agent.capabilities.length > 3 && <Badge variant="secondary" className="text-xs">...</Badge>}
                      </div>
                    </div>
                     <div>
                      <h4 className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-1"><Verified className="h-3 w-3" /> VCs:</h4>
                      <Badge variant="outline" className="text-xs border-primary/50 text-primary">{agent.vcs.length} credentials</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="link" size="sm" className="text-accent hover:text-primary px-0">
                      <Link href={`/agents/${encodeURIComponent(agent.id)}`}>View Full Profile</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-6">No agents found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
}
