"use server";

import { analyzeAgentBehavior, type AnalyzeAgentBehaviorInput, type AnalyzeAgentBehaviorOutput } from "@/ai/flows/analyze-agent-behavior";
import { z } from "zod";

const InputSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required."),
  logs: z.string().min(1, "Logs are required."),
  threshold: z.coerce.number().min(0).max(1, "Threshold must be between 0 and 1."),
});

export interface AnalyzeBehaviorActionState {
  message?: string;
  error?: string;
  analysisResult?: AnalyzeAgentBehaviorOutput;
  fields?: Record<string, string | number>;
  issues?: string[];
}

export async function analyzeBehaviorAction(
  prevState: AnalyzeBehaviorActionState,
  formData: FormData
): Promise<AnalyzeBehaviorActionState> {
  const rawInput = {
    agentId: formData.get("agentId"),
    logs: formData.get("logs"),
    threshold: formData.get("threshold"),
  };

  const validatedFields = InputSchema.safeParse(rawInput);

  if (!validatedFields.success) {
    return {
      error: "Invalid input. Please check the fields.",
      fields: rawInput as Record<string, string | number>,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const input: AnalyzeAgentBehaviorInput = validatedFields.data;
    const result = await analyzeAgentBehavior(input);
    
    if (result) {
      return { 
        message: "Agent behavior analyzed successfully.",
        analysisResult: result 
      };
    } else {
      return { error: "Failed to analyze behavior. AI flow did not return a result." };
    }
  } catch (e) {
    console.error("Error analyzing behavior:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to analyze behavior: ${errorMessage}` };
  }
}
