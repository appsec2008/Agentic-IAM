'use server';

/**
 * @fileOverview Analyzes agent behavior logs to identify anomalous patterns.
 *
 * - analyzeAgentBehavior - Analyzes logs for anomalous behavior.
 * - AnalyzeAgentBehaviorInput - The input type for the analyzeAgentBehavior function.
 * - AnalyzeAgentBehaviorOutput - The return type for the analyzeAgentBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAgentBehaviorInputSchema = z.object({
  agentId: z.string().describe('The ID of the agent to analyze.'),
  logs: z.string().describe('The agent behavior logs to analyze.'),
  threshold: z.number().describe('Threshold for anomaly detection.'),
});
export type AnalyzeAgentBehaviorInput = z.infer<typeof AnalyzeAgentBehaviorInputSchema>;

const AnalyzeAgentBehaviorOutputSchema = z.object({
  anomalous: z.boolean().describe('Whether the agent behavior is anomalous.'),
  reason: z.string().describe('The reason for the anomalous behavior, if any.'),
});
export type AnalyzeAgentBehaviorOutput = z.infer<typeof AnalyzeAgentBehaviorOutputSchema>;

export async function analyzeAgentBehavior(input: AnalyzeAgentBehaviorInput): Promise<AnalyzeAgentBehaviorOutput> {
  return analyzeAgentBehaviorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAgentBehaviorPrompt',
  input: {schema: AnalyzeAgentBehaviorInputSchema},
  output: {schema: AnalyzeAgentBehaviorOutputSchema},
  prompt: `You are a security expert analyzing agent behavior logs for anomalies.

  Analyze the following logs for agent {{agentId}} and determine if the behavior is anomalous based on the threshold of {{threshold}}:

  Logs:
  {{logs}}

  Respond with JSON format including the anomalous field and reason field.
  If the behavior is anomalous, set anomalous to true and provide a reason.
  If the behavior is normal, set anomalous to false and the reason to null.
  Make sure to set threshold into account. Return anomaly only if it surpasses the threshold.
  `,
});

const analyzeAgentBehaviorFlow = ai.defineFlow(
  {
    name: 'analyzeAgentBehaviorFlow',
    inputSchema: AnalyzeAgentBehaviorInputSchema,
    outputSchema: AnalyzeAgentBehaviorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
