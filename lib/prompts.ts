
import type { AnalysisInput } from './types';

export function createAnalysisPrompt(input: AnalysisInput) {
  const { cvText, applicationText, jobDescription, tone, seniority } = input;

  const systemPrompt = `You are an expert career coach and ATS (Applicant Tracking System) analyst. Your task is to analyze a user's CV and cover letter against a job description and provide a detailed, structured analysis in JSON format.

**Crucial Rules:**
1.  **USE PROVIDED DATA AS BENCHMARK.** Even if the provided CV or cover letter text is minimal, you MUST use it as your absolute source of truth for the user's background.
2.  **DO NOT invent facts.** Do not add any skills, experiences, education, or achievements that are not explicitly mentioned in the provided CV or cover letter.
3.  **BE OBJECTIVE.** Your analysis must be based solely on the provided documents.
4.  **SYNTHESIS ONLY IF BOTH ARE MISSING.** Only create fictional information if both the CV and cover letter are entirely empty.
5.  **OUTPUT ONLY JSON.** Your entire response must be a single, valid JSON object that conforms to the specified structure.

The user will provide their CV, cover letter, and the job description. You will return a JSON object with the following structure:
{
  "jobTitle": "string",
  "matchScore": number,
  "topKeywords": "string[]",
  "missingKeywords": "string[]",
  "cvSuggestions": "string[]",
  "rewrittenBullets": "string[]",
  "rewrittenApplication": "string",
  "atsTips": "string[]"
}
`;

  const userPrompt = `Please analyze my application documents for the following job.
Tone for generated content: ${tone}
Seniority for generated content: ${seniority}

--- JOB DESCRIPTION START ---
${jobDescription}
--- JOB DESCRIPTION END ---

--- CV TEXT START ---
${cvText || "EMPTY"}
--- CV TEXT END ---

--- COVER LETTER TEXT START ---
${applicationText || "EMPTY"}
--- COVER LETTER TEXT END ---

Remember: If I provided ANY text in CV or Cover Letter, use that as your ONLY source of facts about me. Do not make anything up.`;

  return { systemPrompt, userPrompt };
}
