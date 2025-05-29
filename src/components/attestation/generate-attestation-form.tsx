
"use client";

import { useFormStatus } from "react-dom";
import { useActionState, useEffect, useRef, useState } from "react";
import { generateAttestationAction, type GenerateAttestationActionState } from "@/app/actions/generate-attestation-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileCheck2, CheckCircle, AlertCircle, Sparkles } from "lucide-react";
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
    fields: initialAgentId ? { agentId: initialAgentId } : { agentId: "" }, // agentId: "" will show placeholder
  };
  const [state, formAction] = useActionState(generateAttestationAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  // selectedAgentId can be "", an actual agent ID, or "--NONE--"
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    initialState?.fields?.agentId || initialAgentId || ""
  );

  useEffect(() => {
    const agentIdFromState = state?.fields?.agentId as string | undefined;
    if (agentIdFromState !== undefined && agentIdFromState !== selectedAgentId) {
      setSelectedAgentId(agentIdFromState);
    } else if (initialAgentId && initialAgentId !== selectedAgentId && agentIdFromState === undefined) {
      // If state is cleared (e.g. successful submission) but initialAgentId exists, re-select it.
      // If form resets, initial state might repopulate, or we clear selectedAgentId.
      setSelectedAgentId(state?.report ? (initialAgentId || "") : (agentIdFromState || ""));
    }
  }, [state?.fields?.agentId, initialAgentId, selectedAgentId, state?.report]);


 useEffect(() => {
    if (state?.message) {
      toast({
        title: "Success",
        description: state.message,
        action: <CheckCircle className="text-green-500" />,
      });
      if(state.report) {
        formRef.current?.reset();
        setSelectedAgentId(initialAgentId || ""); 
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
          Generate a compliance attestation report for an AI agent. All fields are optional; defaults will be used if left empty.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="agentIdSelect" className="text-muted-foreground">Agent ID (DID) (Optional)</Label>
            <Select
              value={selectedAgentId} // Controlled component
              onValueChange={setSelectedAgentId}
              // name="agentId" // Name is on hidden input
            >
              <SelectTrigger id="agentIdSelect" className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground">
                <SelectValue placeholder="Select an agent DID (Optional)" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="--NONE--">-- None --</SelectItem> 
                {MOCK_AGENTS.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>{agent.name} ({agent.id.substring(0,20)}...)</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Hidden input to carry the value to FormData */}
            <input type="hidden" name="agentId" value={selectedAgentId} />
            {state?.issues?.find(issue => issue.toLowerCase().includes("agent id")) && <p className="text-sm text-red-400 mt-1">{state.issues.find(issue => issue.toLowerCase().includes("agent id"))}</p>}
          </div>
          <div>
            <Label htmlFor="complianceRequirements" className="text-muted-foreground">Compliance Requirements (Optional)</Label>
            <Textarea 
              id="complianceRequirements" 
              name="complianceRequirements" 
              placeholder="Describe compliance requirements (e.g., GDPR Article 5). If empty, general standards will be used." 
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
              placeholder="Specific formatting instructions. If empty, a default professional format will be used." 
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
