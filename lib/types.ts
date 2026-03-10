
export interface AnalysisInput {
  cvText: string;
  applicationText: string;
  jobDescription: string;
  tone: string;
  seniority: string;
}

export interface AnalysisResult {
  jobTitle: string;
  matchScore: number;
  topKeywords: string[];
  missingKeywords: string[];
  cvSuggestions: string[];
  rewrittenBullets: string[];
  rewrittenApplication: string;
  rewrittenCv: string;
  atsTips: string[];
}
