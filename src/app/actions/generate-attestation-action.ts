
"use server";

import { generateAttestationReport, type GenerateAttestationReportInput } from "@/ai/flows/generate-attestation-report";
import { z } from "zod";

const InputSchema = z.object({
  agentId: z.string().optional(), // Made optional
  complianceRequirements: z.string().optional(), // Made optional
  reportFormatInstructions: z.string().optional(),
});

export interface GenerateAttestationActionState {
  message?: string;
  error?: string;
  report?: string;
  fields?: {
    agentId?: string;
    complianceRequirements?: string;
    reportFormatInstructions?: string;
  };
  issues?: string[];
}

export async function generateAttestationAction(
  prevState: GenerateAttestationActionState,
  formData: FormData
): Promise<GenerateAttestationActionState> {
  const rawInput = {
    agentId: formData.get("agentId") || undefined, // Ensure undefined if empty for Zod optional
    complianceRequirements: formData.get("complianceRequirements") || undefined, // Ensure undefined if empty
    reportFormatInstructions: formData.get("reportFormatInstructions") || undefined, // Ensure undefined if empty
  };

  const validatedFields = InputSchema.safeParse(rawInput);

  if (!validatedFields.success) {
    return {
      error: "Invalid input. Please check the fields.",
      fields: rawInput as GenerateAttestationActionState['fields'],
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    // Prepare input for the flow, ensuring optional fields are passed correctly
    const input: GenerateAttestationReportInput = {
      ...(validatedFields.data.agentId && { agentId: validatedFields.data.agentId }),
      ...(validatedFields.data.complianceRequirements && { complianceRequirements: validatedFields.data.complianceRequirements }),
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
