import { OpenAPIRoute } from "chanfana";
import { AnalysisInput, AnalysisResult, AppContext } from "../types";
import OpenAI from "openai";

export class JobAnalysis extends OpenAPIRoute {
	schema = {
		tags: ["Analysis"],
		summary: "Analyze CV and Cover Letter against Job Description",
		request: {
			body: {
				content: {
					"application/json": {
						schema: AnalysisInput,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns the analysis result",
				content: {
					"application/json": {
						schema: AnalysisResult,
					},
				},
			},
		},
	};

	async handle(c: AppContext) {
		const data = await this.getValidatedData<typeof this.schema>();
		const input = data.body;

		const openai = new OpenAI({
			apiKey: c.env.OPENAI_API_KEY,
		});

		const systemPrompt = `CRITICAL: You MUST respond ENTIRELY in the Target Language specified in the context. This applies to EVERY SINGLE FIELD in the JSON, including tips, suggestions, CV, and cover letter. If the target language is "Norwegian", do NOT use any English words. Translate all concepts, roles, and skills from the source CV/CL into the Target Language.

You are an elite career strategist. Your goal is to create a "Perfect Application" (Full CV + Full Cover Letter) by merging a user's real-world data with AI-driven ATS optimization.

CORE DIRECTIVE:
- Use the provided CV/CL text as your absolute source of truth for facts (names, dates, roles).
- If a document is missing (e.g., CV is provided but Cover Letter is not), you MUST CREATE the missing document from scratch based on the other provided data and the Job Description.
- NEVER provide a summary or a blurb. You must ALWAYS provide a full, ready-to-use document for both the CV and the Cover Letter.
- LANGUAGE RULE: Every field must be in the Target Language. Default to the language of the Job Description if Target Language is "Match Job Description".

OUTPUT REQUIREMENTS:
1. Optimized CV (rewrittenCv): A full, professional reconstruction of the user's CV.
2. Tailored Cover Letter (rewrittenApplication): A FULL-PAGE (500-700 words), formal business letter. 
   HEADER LAYOUT IS MANDATORY:
   - Line 1: [User's Full Name]
   - Line 2: [User's Address]
   - Line 3: [User's Phone Number]
   - Line 4: [Right-aligned current date using spaces for alignment]
   - Line 5: [Empty Line]
   - Line 6: [Recipient Name/Title]
   - Line 7: [Company Name]
   - Line 8: [Empty Line]
   - Line 9: [Formal Subject Line]
   - Line 10: [Empty Line]
   - Follow with 4-5 detailed paragraphs.
3. Match Analysis: Populate all other JSON fields (score, keywords, tips).

JSON structure (Every field must be populated):
{
  "jobTitle": "string",
  "matchScore": number,
  "topKeywords": ["string"],
  "missingKeywords": ["string"],
  "atsTips": ["string"],
  "cvSuggestions": ["string"],
  "rewrittenBullets": ["string"],
  "rewrittenApplication": "string",
  "rewrittenCv": "string"
}
`;

		const isCvEmpty = !input.cvText || input.cvText.trim().length < 10 || input.cvText === "No text content found.";
		const isClEmpty = !input.applicationText || input.applicationText.trim().length < 10 || input.applicationText === "No text content found.";

		const cvTextToUse = isCvEmpty ? "NOT PROVIDED" : input.cvText;
		const clTextToUse = isClEmpty ? "NOT PROVIDED" : input.applicationText;

		const userPrompt = `
STRICT LANGUAGE MANDATE: You MUST output everything in ${input.language === "Auto-Detect" ? "the language of the Job Description" : input.language}. 

TARGET JOB DESCRIPTION:
${input.jobDescription}

USER CV (Characters: ${input.cvText?.length || 0}):
${cvTextToUse}

USER COVER LETTER (Characters: ${input.applicationText?.length || 0}):
${clTextToUse}

CONTEXT:
- Tone: ${input.tone}
- Seniority: ${input.seniority}
- Target Language: ${input.language === "Auto-Detect" ? "Match Job Description" : input.language}

TASK:
1. REWRITTEN CV (rewrittenCv) in ${input.language === "Auto-Detect" ? "Job Language" : input.language}: YOU MUST PROVIDE A FULL, PROFESSIONAL CV DRAFT HERE. Use the USER CV as your data source. Format it as an ATS-optimized CV.
2. TAILORED COVER LETTER (rewrittenApplication) in ${input.language === "Auto-Detect" ? "Job Language" : input.language}: Provide a FULL-PAGE (500-700 words) formal business letter. Use the mandatory header layout.
3. MATCH ANALYSIS in ${input.language === "Auto-Detect" ? "Job Language" : input.language}: Populate matchScore, keywords, and tips.
4. IMPORTANT: If Target Language is Norwegian, do NOT use English. If it is English, do NOT use Norwegian.
5. If CV data is provided, but you leave 'rewrittenCv' empty, you have FAILED the task.`;

		const response = await openai.chat.completions.create({
			model: "gpt-4-turbo-preview",
			max_tokens: 4000,
			response_format: { type: "json_object" },
			messages: [
				{ role: "system", content: systemPrompt },
				{ role: "user", content: userPrompt },
			],
		});

		const content = response.choices[0].message.content;
		if (!content) {
			throw new Error("OpenAI returned an empty response.");
		}

		return JSON.parse(content);
	}
}
