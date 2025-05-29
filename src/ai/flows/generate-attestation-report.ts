
// src/ai/flows/generate-attestation-report.ts
'use server';

/**
 * @fileOverview Generates a compliance attestation report for AI agents based on verifiable credentials and policy enforcement.
 *
 * - generateAttestationReport - A function that generates the attestation report.
 * - GenerateAttestationReportInput - The input type for the generateAttestationReport function.
 * - GenerateAttestationReportOutput - The return type for the generateAttestationReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAttestationReportInputSchema = z.object({
  agentId: z.string().optional().describe('The Decentralized Identifier (DID) of the AI agent. Optional.'),
  complianceRequirements: z.string().optional().describe('A description of the compliance requirements to be attested. Optional.'),
  reportFormatInstructions: z
    .string()
    .optional()
    .describe(
      'Specific formatting or content instructions for the report. If not provided a default format will be used. Optional.'
    ),
});
export type GenerateAttestationReportInput = z.infer<typeof GenerateAttestationReportInputSchema>;

const GenerateAttestationReportOutputSchema = z.object({
  report: z.string().describe('The generated compliance attestation report.'),
});
export type GenerateAttestationReportOutput = z.infer<typeof GenerateAttestationReportOutputSchema>;

export async function generateAttestationReport(input: GenerateAttestationReportInput): Promise<GenerateAttestationReportOutput> {
  // Provide defaults here if not supplied by the user
  const inputWithDefaults: GenerateAttestationReportInput = {
    agentId: input.agentId || "did:generic:ai-agent:001",
    complianceRequirements: input.complianceRequirements || "General AI ethics, safety, and responsible operation standards.",
    reportFormatInstructions: input.reportFormatInstructions, // Default handled by prompt
  };
  return generateAttestationReportFlow(inputWithDefaults);
}

const prompt = ai.definePrompt({
  name: 'generateAttestationReportPrompt',
  input: {schema: GenerateAttestationReportInputSchema}, // Schema still marks fields as optional for definition
  output: {schema: GenerateAttestationReportOutputSchema},
  prompt: `You are a compliance auditor specializing in AI systems. You will generate a report
attesting to an AI agent's compliance with specific requirements based on its verifiable credentials and policy enforcement.

Agent ID: {{{agentId}}}
Compliance Requirements: {{{complianceRequirements}}}

Report Format Instructions: {{#if reportFormatInstructions}}{{{reportFormatInstructions}}}{{else}}Use a clear, concise, and professional tone. Include a summary of the agent's compliance status, a list of relevant verifiable credentials (if applicable for the agent ID), and an assessment of policy enforcement. Base the report on the provided Agent ID and Compliance Requirements.{{/if}}

Generate the compliance attestation report:`,
});

const generateAttestationReportFlow = ai.defineFlow(
  {
    name: 'generateAttestationReportFlow',
    inputSchema: GenerateAttestationReportInputSchema, // Input to the flow can be optional
    outputSchema: GenerateAttestationReportOutputSchema,
  },
  async (flowInput) => { // flowInput matches GenerateAttestationReportInput (could be optional)
    // Defaults are now handled in the wrapper function `generateAttestationReport`
    // So, `flowInput` here will already have defaults applied if they were missing.
    const {output} = await prompt(flowInput);
    return output!;
  }
);
