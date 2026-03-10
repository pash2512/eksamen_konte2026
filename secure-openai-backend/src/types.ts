import { DateTime, Str } from "chanfana";
import type { Context } from "hono";
import { z } from "zod";

export type AppContext = Context<{ Bindings: Env }>;

export const AnalysisInput = z.object({
	cvText: z.string().optional().default(""),
	applicationText: z.string().optional().default(""),
	jobDescription: z.string(),
	tone: z.string().default("Professional"),
	seniority: z.string().default("Junior"),
	language: z.string().default("Auto-Detect"),
});

export const AnalysisResult = z.object({
	jobTitle: z.string().default("Job Analysis"),
	matchScore: z.number().default(0),
	topKeywords: z.array(z.string()).default([]),
	missingKeywords: z.array(z.string()).default([]),
	atsTips: z.array(z.string()).default([]),
	cvSuggestions: z.array(z.string()).default([]),
	rewrittenBullets: z.array(z.string()).default([]),
	rewrittenApplication: z.string().default(""),
	rewrittenCv: z.string().default(""),
});
