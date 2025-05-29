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
  agentId: z.string().describe('The Decentralized Identifier (DID) of the AI agent.'),
  complianceRequirements: z.string().describe('A description of the compliance requirements to be attested.'),
  reportFormatInstructions: z
    .string()
    .optional()
    .describe(
      'Specific formatting or content instructions for the report. If not provided a default format will be used.'
    ),
});
export type GenerateAttestationReportInput = z.infer<typeof GenerateAttestationReportInputSchema>;

const GenerateAttestationReportOutputSchema = z.object({
  report: z.string().describe('The generated compliance attestation report.'),
});
export type GenerateAttestationReportOutput = z.infer<typeof GenerateAttestationReportOutputSchema>;

export async function generateAttestationReport(input: GenerateAttestationReportInput): Promise<GenerateAttestationReportOutput> {
  return generateAttestationReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAttestationReportPrompt',
  input: {schema: GenerateAttestationReportInputSchema},
  output: {schema: GenerateAttestationReportOutputSchema},
  prompt: `You are a compliance auditor specializing in AI systems. You will generate a report
attesting to an AI agent's compliance with specific requirements based on its verifiable credentials and policy enforcement.

Agent ID: {{{agentId}}}
Compliance Requirements: {{{complianceRequirements}}}

Report Format Instructions: {{#if reportFormatInstructions}}{{{reportFormatInstructions}}}{{else}}Use a clear, concise, and professional tone. Include a summary of the agent's compliance status, a list of relevant verifiable credentials, and an assessment of policy enforcement.{{/if}}

Generate the compliance attestation report:`,
});

const generateAttestationReportFlow = ai.defineFlow(
  {
    name: 'generateAttestationReportFlow',
    inputSchema: GenerateAttestationReportInputSchema,
    outputSchema: GenerateAttestationReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
