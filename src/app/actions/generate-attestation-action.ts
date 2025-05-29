"use server";

import { generateAttestationReport, type GenerateAttestationReportInput, type GenerateAttestationReportOutput } from "@/ai/flows/generate-attestation-report";
import { z } from "zod";

const InputSchema = z.object({
  agentId: z.string().min(1, "Agent ID is required."),
  complianceRequirements: z.string().min(1, "Compliance requirements are required."),
  reportFormatInstructions: z.string().optional(),
});

export interface GenerateAttestationActionState {
  message?: string;
  error?: string;
  report?: string;
  fields?: Record<string, string>;
  issues?: string[];
}

export async function generateAttestationAction(
  prevState: GenerateAttestationActionState,
  formData: FormData
): Promise<GenerateAttestationActionState> {
  const rawInput = {
    agentId: formData.get("agentId"),
    complianceRequirements: formData.get("complianceRequirements"),
    reportFormatInstructions: formData.get("reportFormatInstructions"),
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
    const input: GenerateAttestationReportInput = {
        agentId: validatedFields.data.agentId,
        complianceRequirements: validatedFields.data.complianceRequirements,
        ...(validatedFields.data.reportFormatInstructions && { reportFormatInstructions: validatedFields.data.reportFormatInstructions }),
    };
    const result = await generateAttestationReport(input);
    
    if (result.report) {
      return { 
        message: "Attestation report generated successfully.",
        report: result.report 
      };
    } else {
      return { error: "Failed to generate report. AI flow did not return a report." };
    }
  } catch (e) {
    console.error("Error generating attestation report:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to generate attestation report: ${errorMessage}` };
  }
}
