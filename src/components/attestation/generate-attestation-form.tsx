
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
    // If state.fields.agentId is populated (e.g. due to a validation error), sync it.
    if (agentIdFromState !== undefined && agentIdFromState !== selectedAgentId) {
      setSelectedAgentId(agentIdFromState);
    } else if (initialAgentId && initialAgentId !== selectedAgentId && agentIdFromState === undefined) {
      // This condition helps if form resets (e.g. successful submission) and we want to re-apply initialAgentId.
      // If state.report exists (success), or if state.fields.agentId is reset (e.g. by formAction initial state on success),
      // and initialAgentId was provided, set selectedAgentId back to initialAgentId or empty string.
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
        // Reset selectedAgentId to initialAgentId (if provided) or "" after successful submission
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
              value={selectedAgentId} 
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
            <input type="hidden" name="agentId" value={selectedAgentId === "--NONE--" ? "" : selectedAgentId} />
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
              <div className="mt-2 p-3 rounded-md bg-background/30 text-accent-foreground/90 overflow-x-auto text-sm">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-3 pb-1 border-b border-border" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-2 pb-1 border-b border-border/70" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-2 mb-1" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-base font-semibold mt-1 mb-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 pl-5 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 pl-5 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                    code: ({node, inline, className, children, ...props}) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline ? (
                        <pre className="block whitespace-pre-wrap bg-muted/50 p-3 rounded-md my-3 overflow-x-auto">
                          <code className={`language-${match ? match[1] : 'text'}`} {...props}>{children}</code>
                        </pre>
                      ) : (
                        <code className="px-1.5 py-0.5 bg-muted/50 rounded text-sm font-mono" {...props}>{children}</code>
                      );
                    },
                    pre: ({node, children, ...props}) => <>{children}</>, // react-markdown wraps code blocks in pre, so we pass children through
                    a: ({node, ...props}) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="pl-4 border-l-4 border-border italic my-3 text-muted-foreground bg-card/50 py-2" {...props} />,
                    table: ({node, ...props}) => <table className="min-w-full divide-y divide-border my-3 border border-border rounded-md shadow-sm" {...props} />,
                    thead: ({node, ...props}) => <thead className="bg-card-foreground/10" {...props} />,
                    th: ({node, ...props}) => <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" {...props} />,
                    td: ({node, ...props}) => <td className="px-4 py-2.5 text-sm border-t border-border" {...props} />,
                    hr: ({node, ...props}) => <hr className="my-4 border-border/50" {...props} />
                  }}
                >
                  {state.report}
                </ReactMarkdown>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
