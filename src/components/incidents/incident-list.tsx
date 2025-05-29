"use client";

import type { Incident } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ShieldExclamation, Wrench, Fingerprint } from "lucide-react";
import Link from "next/link";

interface IncidentListProps {
  incidents: Incident[];
  onQuarantineAgent?: (agentId: string) => void; // Placeholder for action
}

const severityColors: Record<Incident['severity'], string> = {
  critical: "bg-red-700/30 text-red-300 border-red-600",
  high: "bg-red-500/30 text-red-400 border-red-500",
  medium: "bg-yellow-500/30 text-yellow-300 border-yellow-500",
  low: "bg-blue-500/30 text-blue-300 border-blue-500",
};

const statusIcons: Record<Incident['status'], React.ReactElement> = {
  active: <AlertTriangle className="h-4 w-4 text-yellow-400" />,
  under_investigation: <Wrench className="h-4 w-4 text-blue-400" />,
  resolved: <CheckCircle className="h-4 w-4 text-green-400" />,
  false_positive: <CheckCircle className="h-4 w-4 text-gray-400" />,
};

const statusTextColors: Record<Incident['status'], string> = {
  active: "text-yellow-400",
  under_investigation: "text-blue-400",
  resolved: "text-green-400",
  false_positive: "text-gray-400",
};


export function IncidentList({ incidents, onQuarantineAgent }: IncidentListProps) {
  if (incidents.length === 0) {
    return <p className="text-muted-foreground text-center py-6">No incidents to display.</p>;
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <Card key={incident.id} className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-foreground">{incident.summary}</CardTitle>
              <Badge variant="outline" className={`capitalize ${severityColors[incident.severity]}`}>
                {incident.severity}
              </Badge>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              ID: {incident.id} | Timestamp: {new Date(incident.timestamp).toLocaleString()}
            </CardDescription>
             <div className="flex items-center gap-2 text-xs">
                <span className={`font-semibold flex items-center gap-1 ${statusTextColors[incident.status]}`}>
                    {statusIcons[incident.status]} {incident.status.replace("_", " ")}
                </span>
             </div>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground mb-2 line-clamp-2">{incident.details || "No further details provided."}</p>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Fingerprint className="h-3 w-3" /> Involved Agent: 
              <Link href={`/agents/${encodeURIComponent(incident.agentId)}`} className="text-accent hover:text-primary underline truncate" title={incident.agentId}>
                 {incident.agentAnsName || incident.agentId}
              </Link>
            </div>
            {incident.analysisResult && (
                 <div className={`mt-2 p-2 rounded-md text-xs ${incident.analysisResult.anomalous ? 'bg-red-900/30 text-red-300' : 'bg-green-900/30 text-green-300'}`}>
                    <strong>AI Analysis:</strong> {incident.analysisResult.anomalous ? "Anomalous" : "Normal"}. Reason: {incident.analysisResult.reason}
                </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" size="sm" className="hover:bg-accent/80">View Details</Button>
            {incident.status === 'active' && onQuarantineAgent && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => onQuarantineAgent(incident.agentId)}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                <ShieldExclamation className="mr-2 h-4 w-4" /> Quarantine Agent
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

