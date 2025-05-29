
"use client";

import { useFormStatus, useActionState } from "react-dom";
import { generateAttestationAction, type GenerateAttestationActionState } from "@/app/actions/generate-attestation-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileCheck2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { MOCK_AGENTS } from "@/lib/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? "Generating Report..." : <> <Sparkles className="mr-2 h-4 w-4" /> Generate Report </>}
    </Button>
  );
}

interface GenerateAttestationFormProps {
  initialAgentId?: string;
}

export function GenerateAttestationForm({ initialAgentId }: GenerateAttestationFormProps) {
  const initialState: GenerateAttestationActionState = {
    fields: initialAgentId ? { agentId: initialAgentId } : {},
  };
  const [state, formAction] = useActionState(generateAttestationAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    initialState?.fields?.agentId || initialAgentId || ""
  );

  useEffect(() => {
    const agentIdFromState = state?.fields?.agentId as string | undefined;
    if (agentIdFromState && agentIdFromState !== selectedAgentId) {
      setSelectedAgentId(agentIdFromState);
    } else if (!agentIdFromState && initialAgentId && initialAgentId !== selectedAgentId) {
      setSelectedAgentId(initialAgentId);
    }
  }, [state?.fields?.agentId, initialAgentId, selectedAgentId]);


 useEffect(() => {
    if (state?.message) {
      toast({
        title: "Success",
        description: state.message,
        action: <CheckCircle className="text-green-500" />,
      });
      if(state.report) {
        formRef.current?.reset();
        setSelectedAgentId(initialAgentId || ""); // Reset select if initialAgentId is present
      }
    }
    if (state?.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
        action: <AlertCircle className="text-red-500" />,
      });
    }
  }, [state, toast, initialAgentId]);


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
           <FileCheck2 className="h-5 w-5 text-primary" />
           AI-Powered Attestation Report
        </CardTitle>
        <CardDescription>
          Generate a compliance attestation report for an AI agent based on its verifiable credentials and policy enforcement.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="agentIdSelect" className="text-muted-foreground">Agent ID (DID)</Label>
            <Select
              value={selectedAgentId}
              onValueChange={setSelectedAgentId}
            >
              <SelectTrigger id="agentIdSelect" className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground">
                <SelectValue placeholder="Select an agent DID" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_AGENTS.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name} ({agent.id.substring(0,20)}...)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="agentId" value={selectedAgentId} />
            {state?.issues?.find(issue => issue.toLowerCase().includes("agent id")) && <p className="text-sm text-red-400 mt-1">{state.issues.find(issue => issue.toLowerCase().includes("agent id"))}</p>}
          </div>
          <div>
            <Label htmlFor="complianceRequirements" className="text-muted-foreground">Compliance Requirements</Label>
            <Textarea 
              id="complianceRequirements" 
              name="complianceRequirements" 
              placeholder="Describe the compliance requirements to be attested (e.g., GDPR Article 5, ISO 27001 Annex A.12)" 
              rows={3}
              defaultValue={state?.fields?.complianceRequirements}
              className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"
            />
            {state?.issues?.find(issue => issue.toLowerCase().includes("compliance requirements")) && <p className="text-sm text-red-400 mt-1">{state.issues.find(issue => issue.toLowerCase().includes("compliance requirements"))}</p>}
          </div>
           <div>
            <Label htmlFor="reportFormatInstructions" className="text-muted-foreground">Report Format Instructions (Optional)</Label>
            <Textarea 
              id="reportFormatInstructions" 
              name="reportFormatInstructions" 
              placeholder="Specific formatting or content instructions for the report. If not provided, a default format will be used." 
              rows={3}
              defaultValue={state?.fields?.reportFormatInstructions}
              className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
      
      {state?.report && (
        <div className="p-6 pt-0">
          <Alert className="bg-accent/10 border-accent/30">
            <FileCheck2 className="h-5 w-5 text-accent" />
            <AlertTitle className="text-accent">Generated Attestation Report</AlertTitle>
            <AlertDescription>
              <pre className="whitespace-pre-wrap text-sm text-accent-foreground/80 bg-background/30 p-3 rounded-md mt-2 overflow-x-auto">
                {state.report}
              </pre>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
