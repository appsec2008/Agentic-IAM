"use server";

import { generateAccessPolicy, type GenerateAccessPolicyInput } from "@/ai/flows/generate-access-policy";
import { z } from "zod";

const InputSchema = z.object({
  agentCapabilities: z.string().min(1, "Agent capabilities are required."),
  agentRoles: z.string().min(1, "Agent roles are required."),
  resourceDescription: z.string().min(1, "Resource description is required."),
  accessType: z.string().min(1, "Access type is required."),
});

export interface GeneratePolicyActionState {
  message?: string;
  error?: string;
  generatedPolicy?: string;
  fields?: Record<string, string>;
  issues?: string[];
}

export async function generatePolicyAction(
  prevState: GeneratePolicyActionState,
  formData: FormData
): Promise<GeneratePolicyActionState> {
  const rawInput = {
    agentCapabilities: formData.get("agentCapabilities"),
    agentRoles: formData.get("agentRoles"),
    resourceDescription: formData.get("resourceDescription"),
    accessType: formData.get("accessType"),
  };

  const validatedFields = InputSchema.safeParse(rawInput);

  if (!validatedFields.success) {
    return {
      error: "Invalid input. Please check the fields.",
      fields: rawInput as Record<string, string>,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const input: GenerateAccessPolicyInput = validatedFields.data;
    const result = await generateAccessPolicy(input);
    
    if (result.accessPolicy) {
      return { 
        message: "Access policy generated successfully.",
        generatedPolicy: result.accessPolicy 
      };
    } else {
      return { error: "Failed to generate policy. AI flow did not return a policy." };
    }
  } catch (e) {
    console.error("Error generating policy:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to generate policy: ${errorMessage}` };
  }
}
