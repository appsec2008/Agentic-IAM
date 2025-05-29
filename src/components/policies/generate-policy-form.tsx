"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generatePolicyAction, type GeneratePolicyActionState } from "@/app/actions/generate-policy-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have Textarea
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";


function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-primary hover:bg-primary/90 text-primary-foreground">
      {pending ? "Generating..." : <> <Sparkles className="mr-2 h-4 w-4" /> Generate Policy </>}
    </Button>
  );
}

export function GeneratePolicyForm() {
  const initialState: GeneratePolicyActionState = {};
  const [state, formAction] = useFormState(generatePolicyAction, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

 useEffect(() => {
    if (state?.message) {
      toast({
        title: "Success",
        description: state.message,
        variant: "default",
        action: <CheckCircle className="text-green-500" />,
      });
      // Optionally reset form or clear generated policy from view if it's part of state handled elsewhere
      if (state.generatedPolicy) {
        formRef.current?.reset(); // Reset form fields if policy generated successfully
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
  }, [state, toast]);


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
           <Sparkles className="h-5 w-5 text-primary" />
           AI-Powered Policy Generation
        </CardTitle>
        <CardDescription>
          Define agent capabilities, roles, resource, and access type to generate a secure access policy using AI.
        </CardDescription>
      </CardHeader>
      <form action={formAction} ref={formRef}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agentCapabilities" className="text-muted-foreground">Agent Capabilities</Label>
              <Input id="agentCapabilities" name="agentCapabilities" placeholder="e.g., ReadData, ExecuteCode" defaultValue={state?.fields?.agentCapabilities} className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"/>
              {state?.issues?.find(issue => issue.includes("capabilities")) && <p className="text-sm text-red-400 mt-1">{state.issues.find(issue => issue.includes("capabilities"))}</p>}
            </div>
            <div>
              <Label htmlFor="agentRoles" className="text-muted-foreground">Agent Roles</Label>
              <Input id="agentRoles" name="agentRoles" placeholder="e.g., DataAnalyst, SystemAdmin" defaultValue={state?.fields?.agentRoles} className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"/>
               {state?.issues?.find(issue => issue.includes("roles")) && <p className="text-sm text-red-400 mt-1">{state.issues.find(issue => issue.includes("roles"))}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="resourceDescription" className="text-muted-foreground">Resource Description</Label>
            <Input id="resourceDescription" name="resourceDescription" placeholder="e.g., CustomerDatabase Table Users" defaultValue={state?.fields?.resourceDescription} className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"/>
            {state?.issues?.find(issue => issue.includes("resource")) && <p className="text-sm text-red-400 mt-1">{state.issues.find(issue => issue.includes("resource"))}</p>}
          </div>
          <div>
            <Label htmlFor="accessType" className="text-muted-foreground">Access Type</Label>
            <Input id="accessType" name="accessType" placeholder="e.g., Read, Write, Execute" defaultValue={state?.fields?.accessType} className="bg-card-foreground/5 text-foreground placeholder:text-muted-foreground"/>
            {state?.issues?.find(issue => issue.includes("access type")) && <p className="text-sm text-red-400 mt-1">{state.issues.find(issue => issue.includes("access type"))}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <SubmitButton />
        </CardFooter>
      </form>
      
      {state?.generatedPolicy && (
        <div className="p-6 pt-0">
          <Alert className="bg-accent/10 border-accent/30">
            <Terminal className="h-5 w-5 text-accent" />
            <AlertTitle className="text-accent">Generated Access Policy</AlertTitle>
            <AlertDescription>
              <pre className="whitespace-pre-wrap text-sm text-accent-foreground/80 bg-background/30 p-3 rounded-md mt-2 overflow-x-auto">
                {state.generatedPolicy}
              </pre>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </Card>
  );
}
