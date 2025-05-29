// Using useSearchParams requires this to be a client component
"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from "@/components/layout/page-header";
import { GenerateAttestationForm } from "@/components/attestation/generate-attestation-form";
import { FileCheck2 } from "lucide-react";

// A wrapper component to use useSearchParams because it must be used within Suspense
function AttestationContent() {
  const searchParams = useSearchParams();
  const agentId = searchParams.get('agentId');

  return (
     <GenerateAttestationForm initialAgentId={agentId || undefined} />
  );
}


export default function AttestationPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Attestation Reports"
        description="Generate compliance attestation reports for AI agents using AI-powered analysis."
        icon={FileCheck2}
      />
      <Suspense fallback={<div>Loading form...</div>}>
        <AttestationContent />
      </Suspense>

      {/* Placeholder for displaying past generated reports */}
      {/* 
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Previously Generated Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">List of past reports will appear here.</p>
        </CardContent>
      </Card> 
      */}
    </div>
  );
}

