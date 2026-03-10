'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { AnalysisResult } from '@/lib/types';
import MatchScoreCard from '@/components/MatchScoreCard';
import KeywordList from '@/components/KeywordList';
import SuggestionPanel from '@/components/SuggestionPanel';
import RewrittenBullets from '@/components/RewrittenBullets';
import RewrittenLetter from '@/components/RewrittenLetter';
import RewrittenCv from '@/components/RewrittenCv';

function ResultsDisplay() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check sessionStorage for transient data
    const data = sessionStorage.getItem('jobfit_analysis_result');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setTimeout(() => setResult(parsed), 0);
      } catch (err) {
        console.error("Failed to parse results data:", err);
        setTimeout(() => setError(true), 0);
      }
    } else {
      setTimeout(() => setError(true), 0);
    }

    // Optional: Clear data from sessionStorage immediately after loading into state?
    // For now, keeping it until tab close or explicit new analysis is better UX,
    // but clearing it on "New Analysis" is key.
  }, []);

  const handleNewAnalysis = () => {
    // Explicitly clear sensitive data
    sessionStorage.removeItem('jobfit_analysis_result');
    router.push('/analyze');
  };

  if (error || (!result && !error)) {
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl">!</div>
              <h1 className="text-2xl font-bold">No analysis data found.</h1>
              <p className="text-gray-500">For security, data is deleted after your session ends.</p>
              <button onClick={handleNewAnalysis} className="bg-brand hover:bg-brand-hover text-white px-6 py-2 rounded-lg transition-colors">
                Start New Analysis
              </button>
            </div>
          );
    }
    return <div className="flex items-center justify-center h-screen animate-pulse text-gray-400">Loading secure analysis...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto w-full py-10 px-6 space-y-12">
      {/* Non-print UI */}
      <div className="print:hidden space-y-12">
        <header className="border-b border-gray-200 dark:border-gray-700 pb-8 text-center">
          <div className="inline-block px-3 py-1 bg-brand/10 text-brand text-xs font-bold rounded-full mb-4 uppercase tracking-widest flex items-center gap-2 w-fit mx-auto">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            Secure Analysis Report
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {result?.jobTitle}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto text-sm">
            This report is generated ephemerally and will be permanently deleted when you close this tab.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <section className="bg-card-hover dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 text-center">Overall Match</h2>
              {result && <MatchScoreCard score={result.matchScore} />}
            </section>
            
            <div className="space-y-6">
              {result && <KeywordList title="Matched Skills" keywords={result.topKeywords} color="green" />}
              {result && <KeywordList title="Gaps to Fill" keywords={result.missingKeywords} color="red" />}
            </div>
          </div>

          <div className="md:col-span-2 space-y-10">
            <section className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-brand rounded-full" />
                <h2 className="text-xl font-bold">Strategic Recommendations</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {result && <SuggestionPanel title="ATS & Formatting" suggestions={result.atsTips} />}
                {result && <SuggestionPanel title="Content Strategy" suggestions={result.cvSuggestions} />}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-brand rounded-full" />
                <h2 className="text-xl font-bold">AI Rewrites</h2>
              </div>
              <div className="space-y-8">
                {result && <RewrittenCv title="ATS-Optimized CV Draft" content={result.rewrittenCv} />}
                {result && <RewrittenBullets title="Optimized Experience Bullets" bullets={result.rewrittenBullets} />}
                {result && <RewrittenLetter title="Tailored Cover Letter Draft" content={result.rewrittenApplication} />}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Print-only View (Hidden on Screen) */}
      <div className="hidden print:block bg-white text-black p-0 m-0 w-full">
        <div className="whitespace-pre-wrap font-serif text-[12pt] leading-relaxed">
          {result?.rewrittenApplication}
        </div>
      </div>
      
      <footer className="print:hidden pt-12 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          Securely processed. No data stored on servers.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print PDF
          </button>
          <button 
            onClick={handleNewAnalysis}
            className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg shadow-md transition-all font-bold uppercase text-xs tracking-widest hover:opacity-80"
          >
            Clear & New Analysis
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <div className="min-h-full bg-background">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
        </div>
      }>
        <ResultsDisplay />
      </Suspense>
    </div>
  );
}
