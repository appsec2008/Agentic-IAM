import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MOCK_POLICIES } from "@/lib/constants";
import { FileSliders, ListChecks } from "lucide-react";
import { GeneratePolicyForm } from "@/components/policies/generate-policy-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function PoliciesPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Access Policies"
        description="Manage and generate attribute-based access control (ABAC) policies for AI agents."
        icon={FileSliders}
      />

      <GeneratePolicyForm />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-foreground">
            <ListChecks className="h-5 w-5 text-primary" />
            Existing Policies ({MOCK_POLICIES.length})
          </CardTitle>
          <CardDescription>Review and manage currently active access policies.</CardDescription>
        </CardHeader>
        <CardContent>
          {MOCK_POLICIES.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {MOCK_POLICIES.map((policy) => (
                <AccordionItem value={policy.id} key={policy.id} className="border-b border-border/50">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-col items-start text-left">
                       <span className="font-semibold text-foreground">{policy.name}</span>
                       <span className="text-xs text-muted-foreground">{policy.id}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{policy.description}</p>
                    <h4 className="font-medium text-sm text-foreground">Rules:</h4>
                    <ul className="space-y-2">
                      {policy.rules.map((rule, index) => (
                        <li key={index} className="text-xs p-2 border border-border/30 rounded-md bg-card-foreground/5">
                          <span className={`font-semibold ${rule.effect === 'allow' ? 'text-green-400' : 'text-red-400'}`}>
                            Effect: {rule.effect.toUpperCase()}
                          </span>
                          <p><span className="text-muted-foreground">Conditions:</span> {rule.conditions.join(' AND ')}</p>
                          <p><span className="text-muted-foreground">Actions:</span> {rule.actions.join(', ')}</p>
                          <p><span className="text-muted-foreground">Resources:</span> {rule.resources.join(', ')}</p>
                        </li>
                      ))}
                    </ul>
                     {policy.generatedPolicy && (
                       <div>
                          <h4 className="font-medium text-sm text-foreground mt-2">AI Generated Policy:</h4>
                           <pre className="whitespace-pre-wrap text-xs text-accent-foreground/80 bg-background/30 p-2 rounded-md mt-1 overflow-x-auto">
                            {policy.generatedPolicy}
                          </pre>
                       </div>
                     )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground text-center py-4">No policies defined yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
