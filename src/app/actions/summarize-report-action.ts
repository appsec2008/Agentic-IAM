"use server";

import { summarizeIncidentReport, type SummarizeIncidentReportInput, type SummarizeIncidentReportOutput } from "@/ai/flows/summarize-incident-report";
import { z } from "zod";

const InputSchema = z.object({
  report: z.string().min(1, "Incident report content is required."),
});

export interface SummarizeReportActionState {
  message?: string;
  error?: string;
  summary?: string;
  fields?: Record<string, string>;
  issues?: string[];
}

export async function summarizeReportAction(
  prevState: SummarizeReportActionState,
  formData: FormData
): Promise<SummarizeReportActionState> {
  const rawInput = {
    report: formData.get("report"),
  };

  const validatedFields = InputSchema.safeParse(rawInput);

  if (!validatedFields.success) {
    return {
      error: "Invalid input. Report content cannot be empty.",
      fields: rawInput as Record<string, string>,
      issues: validatedFields.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const input: SummarizeIncidentReportInput = validatedFields.data;
    const result = await summarizeIncidentReport(input);
    
    if (result.summary) {
      return { 
        message: "Incident report summarized successfully.",
        summary: result.summary 
      };
    } else {
      return { error: "Failed to summarize report. AI flow did not return a summary." };
    }
  } catch (e) {
    console.error("Error summarizing report:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Failed to summarize report: ${errorMessage}` };
  }
}
