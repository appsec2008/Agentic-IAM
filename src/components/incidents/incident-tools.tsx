"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BrainCircuit, FileText, CheckCircle, AlertCircle, BarChartBig } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

import { analyzeBehaviorAction, type AnalyzeBehaviorActionState } from "@/app/actions/analyze-behavior-action";
import { summarizeReportAction, type SummarizeReportActionState } from "@/app/actions/summarize-report-action";
import { MOCK_AGENTS } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function AnalyzeBehaviorSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? "Analyzing..." : <> <BrainCircuit className="mr-2 h-4 w-4" /> Analyze Behavior </>}
    </Button>
  );
}

function SummarizeReportSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? "Summarizing..." : <> <FileText className="mr-2 h-4 w-4" /> Summarize Report </>}
    </Button>
  );
}

export function IncidentTools() {
  const { toast } = useToast();

  const analyzeInitialState: AnalyzeBehaviorActionState = {};
  const [analyzeState, analyzeFormAction] = useFormState(analyzeBehaviorAction, analyzeInitialState);
  const analyzeFormRef = useRef<HTMLFormElement>(null);

  const summarizeInitialState: SummarizeReportActionState = {};
  const [summarizeState, summarizeFormAction] = useFormState(summarizeReportAction, summarizeInitialState);
  const summarizeFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (analyzeState?.message) {
      toast({ title: "Success", description: analyzeState.message, action: <CheckCircle className="text-green-500" /> });
      if (analyzeState.analysisResult) analyzeFormRef.current?.reset();
    }
    if (analyzeState?.error) {
      toast({ title: "Error Analyzing Behavior", description: analyzeState.error, variant: "destructive", action: <AlertCircle className="text-red-500" /> });
    }
  }, [analyzeState, toast]);

  useEffect(() => {
    if (summarizeState?.message) {
      toast({ title: "Success", description: summarizeState.message, action: <CheckCircle className="text-green-500" /> });
      if (summarizeState.summary) summarizeFormRef.current?.reset();
    }
    if (summarizeState?.error) {
      toast({ title: "Error Summarizing Report", description: summarizeState.error, variant: "destructive", action: <AlertCircle className="text-red-500" /> });
    }
  }, [summarizeState, toast]);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Analyze Agent Behavior Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-foreground"><BrainCircuit className="h-5 w-5 text-primary" />Analyze Agent Behavior</CardTitle>
          <CardDescription>Identify anomalous patterns in agent activity logs using AI.</CardDescription>
        </CardHeader>
        <form action={analyzeFormAction} ref={analyzeFormRef}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="agentId" className="text-muted-foreground">Agent ID</Label>
               <Select name="agentId" defaultValue={analyzeState?.fields?.agentId as string | undefined}>
                <SelectTrigger id="agentId" className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground">
                  <SelectValue placeholder="Select an agent DID" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_AGENTS.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name} ({agent.id.substring(0,20)}...)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {analyzeState?.issues?.find(issue => issue.includes("Agent ID")) && <p className="text-sm text-red-400 mt-1">{analyzeState.issues.find(issue => issue.includes("Agent ID"))}</p>}
            </div>
            <div>
              <Label htmlFor="logs" className="text-muted-foreground">Behavior Logs</Label>
              <Textarea id="logs" name="logs" placeholder="Paste agent logs here..." rows={5} defaultValue={analyzeState?.fields?.logs as string | undefined} className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"/>
              {analyzeState?.issues?.find(issue => issue.includes("Logs")) && <p className="text-sm text-red-400 mt-1">{analyzeState.issues.find(issue => issue.includes("Logs"))}</p>}
            </div>
            <div>
              <Label htmlFor="threshold" className="text-muted-foreground">Anomaly Threshold (0.0 - 1.0)</Label>
              <Input id="threshold" name="threshold" type="number" step="0.01" min="0" max="1" placeholder="e.g., 0.8" defaultValue={analyzeState?.fields?.threshold ?? 0.8} className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"/>
              {analyzeState?.issues?.find(issue => issue.includes("Threshold")) && <p className="text-sm text-red-400 mt-1">{analyzeState.issues.find(issue => issue.includes("Threshold"))}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <AnalyzeBehaviorSubmitButton />
          </CardFooter>
        </form>
        {analyzeState?.analysisResult && (
          <div className="p-6 pt-0">
            <Alert className={`${analyzeState.analysisResult.anomalous ? 'border-red-500/50 bg-red-900/20' : 'border-green-500/50 bg-green-900/20'}`}>
              <BarChartBig className={`h-5 w-5 ${analyzeState.analysisResult.anomalous ? 'text-red-400' : 'text-green-400'}`} />
              <AlertTitle className={`${analyzeState.analysisResult.anomalous ? 'text-red-400' : 'text-green-400'}`}>
                Analysis Result: {analyzeState.analysisResult.anomalous ? "Anomalous Behavior Detected" : "Normal Behavior"}
              </AlertTitle>
              <AlertDescription className={`${analyzeState.analysisResult.anomalous ? 'text-red-300' : 'text-green-300'}`}>
                {analyzeState.analysisResult.reason || "No specific reason provided."}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </Card>

      {/* Summarize Incident Report Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-foreground"><FileText className="h-5 w-5 text-primary" />Summarize Incident Report</CardTitle>
          <CardDescription>Get a concise AI-generated summary of a detailed incident report.</CardDescription>
        </CardHeader>
        <form action={summarizeFormAction} ref={summarizeFormRef}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="report" className="text-muted-foreground">Incident Report</Label>
              <Textarea id="report" name="report" placeholder="Paste full incident report here..." rows={8} defaultValue={summarizeState?.fields?.report} className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"/>
              {summarizeState?.issues?.find(issue => issue.includes("report content")) && <p className="text-sm text-red-400 mt-1">{summarizeState.issues.find(issue => issue.includes("report content"))}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <SummarizeReportSubmitButton />
          </CardFooter>
        </form>
        {summarizeState?.summary && (
          <div className="p-6 pt-0">
            <Alert className="bg-accent/10 border-accent/30">
              <FileText className="h-5 w-5 text-accent" />
              <AlertTitle className="text-accent">Generated Summary</AlertTitle>
              <AlertDescription className="text-accent-foreground/80 whitespace-pre-line">
                {summarizeState.summary}
              </AlertDescription>
            </Alert>
          </div>
        )}
      </Card>
    </div>
  );
}
