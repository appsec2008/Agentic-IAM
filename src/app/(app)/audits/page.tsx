"use client"; // For potential client-side filtering/pagination in future

import { PageHeader } from "@/components/layout/page-header";
import { MOCK_AUDIT_LOGS } from "@/lib/constants";
import { ScrollText, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuditLogsPage() {
  // In a real app, pagination and filtering would be implemented.
  const displayedLogs = MOCK_AUDIT_LOGS.slice(0, 20); // Display first 20 logs

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Audit Logs"
        description="Review cryptographically verifiable logs of agent interactions and IAM decisions."
        icon={ScrollText}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-xl text-foreground">System Event Log</CardTitle>
              <CardDescription>Showing latest {displayedLogs.length} of {MOCK_AUDIT_LOGS.length} entries.</CardDescription>
            </div>
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <Input placeholder="Filter logs..." className="max-w-xs bg-card-foreground/5 text-foreground placeholder:text-muted-foreground" />
              <Button variant="outline" className="hover:bg-accent/80">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-muted-foreground">Timestamp</TableHead>
                <TableHead className="text-muted-foreground">Agent ID / ANS Name</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
                <TableHead className="text-muted-foreground">Target</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-accent/10">
                  <TableCell className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <Link href={`/agents/${encodeURIComponent(log.agentId)}`} className="text-xs text-accent hover:text-primary underline truncate block" title={log.agentId}>
                      {log.agentAnsName || log.agentId}
                    </Link>
                  </TableCell>
                  <TableCell className="text-foreground font-medium">{log.action}</TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate" title={log.targetResource || log.targetAgentId}>
                    {log.targetResource || log.targetAgentId || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'} 
                           className={`${log.status === 'success' ? 'bg-green-500/20 text-green-300 border-green-500/50' : 'bg-red-500/20 text-red-300 border-red-500/50'}`}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground truncate" title={log.details}>{log.details || 'No additional details'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {MOCK_AUDIT_LOGS.length === 0 && (
            <p className="text-center py-10 text-muted-foreground">No audit logs available.</p>
          )}
        </CardContent>
      </Card>
       {MOCK_AUDIT_LOGS.length > displayedLogs.length && (
        <div className="text-center mt-6">
            <Button variant="outline" className="hover:bg-accent/80">Load More Logs</Button>
        </div>
      )}
    </div>
  );
}
