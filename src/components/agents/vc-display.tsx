import type { VerifiableCredential } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BadgeCheck, ShieldAlert, CalendarDays, UserCircle, KeyRound } from "lucide-react";

interface VCDisplayProps {
  vc: VerifiableCredential;
}

export function VCDisplay({ vc }: VCDisplayProps) {
  return (
    <Card className="bg-background/30 shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2 text-foreground">
            <BadgeCheck className="h-5 w-5 text-primary" />
            {vc.type.filter(t => t !== "VerifiableCredential").join(', ') || "Verifiable Credential"}
          </CardTitle>
          {vc.expirationDate && new Date(vc.expirationDate) < new Date() && (
            <span className="text-xs text-red-400 flex items-center gap-1">
              <ShieldAlert className="h-3 w-3" /> Expired
            </span>
          )}
        </div>
        <CardDescription className="text-xs text-muted-foreground">ID: {vc.id}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1"><UserCircle className="h-3 w-3" /> Issuer:</span>
          <span className="truncate text-foreground" title={vc.issuer}>{vc.issuer}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Issued:</span>
          <span className="text-foreground">{new Date(vc.issuanceDate).toLocaleDateString()}</span>
        </div>
        {vc.expirationDate && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground flex items-center gap-1"><CalendarDays className="h-3 w-3" /> Expires:</span>
            <span className="text-foreground">{new Date(vc.expirationDate).toLocaleDateString()}</span>
          </div>
        )}
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className="text-xs py-1 hover:no-underline text-accent hover:text-primary">
              Show Claims ({Object.keys(vc.credentialSubject).filter(k => k !== 'id').length})
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-0">
              <ul className="space-y-1 text-xs bg-muted/20 p-2 rounded-md">
                {Object.entries(vc.credentialSubject).map(([key, value]) => {
                  if (key === 'id') return null; // Already shown as subject DID
                  return (
                    <li key={key} className="flex justify-between">
                      <span className="font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-foreground truncate ml-2" title={String(value)}>{String(value)}</span>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
          {vc.proof && (
             <AccordionItem value="item-2" className="border-b-0">
                <AccordionTrigger className="text-xs py-1 hover:no-underline text-accent hover:text-primary">
                  Show Proof
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-0">
                  <div className="space-y-1 text-xs bg-muted/20 p-2 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Type:</span>
                      <span className="text-foreground">{vc.proof.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Purpose:</span>
                      <span className="text-foreground">{vc.proof.proofPurpose}</span>
                    </div>
                     <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Created:</span>
                      <span className="text-foreground">{new Date(vc.proof.created).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-muted-foreground">Verification Method:</span>
                      <span className="text-foreground truncate ml-2" title={vc.proof.verificationMethod}>{vc.proof.verificationMethod}</span>
                    </div>
                     {vc.proof.jws && (
                       <div className="flex items-start justify-between">
                        <span className="font-medium text-muted-foreground flex items-center gap-1"><KeyRound className="h-3 w-3" /> JWS:</span>
                        <span className="text-foreground truncate ml-2" title={vc.proof.jws}>{vc.proof.jws.substring(0,30)}...</span>
                      </div>
                     )}
                  </div>
                </AccordionContent>
              </AccordionItem>
          )}
        </Accordion>

      </CardContent>
    </Card>
  );
}
