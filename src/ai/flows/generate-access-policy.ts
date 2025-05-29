'use server';
/**
 * @fileOverview A flow to generate access control policies for agents based on their declared capabilities and roles.
 *
 * - generateAccessPolicy - A function that handles the policy generation process.
 * - GenerateAccessPolicyInput - The input type for the generateAccessPolicy function.
 * - GenerateAccessPolicyOutput - The return type for the generateAccessPolicy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAccessPolicyInputSchema = z.object({
  agentCapabilities: z.string().describe('The declared capabilities of the agent.'),
  agentRoles: z.string().describe('The roles of the agent.'),
  resourceDescription: z.string().describe('The description of the resource to be accessed.'),
  accessType: z.string().describe('The type of access being requested (e.g., read, write, execute).'),
});
export type GenerateAccessPolicyInput = z.infer<typeof GenerateAccessPolicyInputSchema>;

const GenerateAccessPolicyOutputSchema = z.object({
  accessPolicy: z.string().describe('The generated access control policy.'),
});
export type GenerateAccessPolicyOutput = z.infer<typeof GenerateAccessPolicyOutputSchema>;

export async function generateAccessPolicy(input: GenerateAccessPolicyInput): Promise<GenerateAccessPolicyOutput> {
  return generateAccessPolicyFlow(input);
}

const generateAccessPolicyPrompt = ai.definePrompt({
  name: 'generateAccessPolicyPrompt',
  input: {schema: GenerateAccessPolicyInputSchema},
  output: {schema: GenerateAccessPolicyOutputSchema},
  prompt: `You are a security expert specializing in generating access control policies for AI agents.

  Based on the agent's capabilities, roles, and the resource it needs to access, generate a concise access control policy.
  Ensure the policy adheres to the principle of least privilege.

  Agent Capabilities: {{{agentCapabilities}}}
  Agent Roles: {{{agentRoles}}}
  Resource Description: {{{resourceDescription}}}
  Access Type: {{{accessType}}}

  Generated Access Policy:
  `,
});

const generateAccessPolicyFlow = ai.defineFlow(
  {
    name: 'generateAccessPolicyFlow',
    inputSchema: GenerateAccessPolicyInputSchema,
    outputSchema: GenerateAccessPolicyOutputSchema,
  },
  async input => {
    const {output} = await generateAccessPolicyPrompt(input);
    return output!;
  }
);
