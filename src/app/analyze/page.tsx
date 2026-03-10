'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import ToneSelector from '@/components/ToneSelector';
import SenioritySelector from '@/components/SenioritySelector';
import LanguageSelector from '@/components/LanguageSelector';

export default function AnalyzePage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: CV, 1: CL, 2: Final
  const [cvText, setCvText] = useState('');
  const [cvFileName, setCvFileName] = useState('');
  const [coverLetterText, setCoverLetterText] = useState('');
  const [clFileName, setClFileName] = useState('');
  const [jobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [tone, setTone] = useState('Professional');
  const [seniority, setSeniority] = useState('Junior');
  const [language, setLanguage] = useState('Auto-Detect');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  
  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 0) {
        router.push('/');
    } else {
        setStep(step - 1);
    }
  };

  const handlePdfUpload = async (file: File, type: 'cv' | 'cl') => {
    const formData = new FormData();
    formData.append('file', file);
    setIsExtracting(true);
    
    try {
      const response = await fetch('/api/extract-pdf', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();

      if (response.ok) {
        if (type === 'cv') {
          setCvText(data.text);
          setCvFileName(file.name);
        } else {
          setCoverLetterText(data.text);
          setClFileName(file.name);
        }
      } else {
        alert(`Extraction Error: ${data.details || data.error || 'Unknown server error'}`);
      }
    } catch (err) {
      console.error('PDF upload error:', err);
      alert(`Network Error: ${err instanceof Error ? err.message : 'Failed to connect to server'}`);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async (urlOnly = false) => {
    setIsLoading(true);
    try {
      let finalJobDescription = jobDescription;

      if (jobUrl) {
        try {
          const extractResponse = await fetch('/api/extract-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: jobUrl }),
          });
          if (extractResponse.ok) {
            const extractedData = await extractResponse.json();
            finalJobDescription = extractedData.content;
          }
        } catch (err) {
          console.warn('Failed to extract from URL', err);
        }
      }

      if (!finalJobDescription) {
        throw new Error('Please provide a valid Job URL first.');
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: urlOnly ? 'URL ONLY ANALYSIS' : cvText,
          applicationText: urlOnly ? '' : coverLetterText,
          jobDescription: finalJobDescription,
          tone: tone,
          seniority: seniority,
          language: language,
        }),
      });
      
      const results = await response.json();
      
      if (!response.ok) {
        throw new Error(results.error || 'Failed to analyze');
      }
      
      sessionStorage.setItem('jobfit_analysis_result', JSON.stringify(results));
      router.push('/results');
    } catch (error) {
      console.error('Analysis failed:', error);
      alert(error instanceof Error ? error.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full bg-background px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        
        {/* Brand Name */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold tracking-tighter text-black dark:text-white uppercase">jobfit</h1>
        </div>

        {/* The "Super Box" - ChatGPT Style Input */}
        <div className="relative bg-white dark:bg-[#2f2f2f] border border-[#e5e5e5] dark:border-[#383838] rounded-[28px] chat-input-shadow overflow-hidden transition-all duration-500 ease-in-out">
          
          {/* Top Section: Always URL */}
          <div className="p-6 border-b border-[#f0f0f0] dark:border-[#383838]">
             <div className="flex items-center gap-3">
                <div className="text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Paste Job URL here..." 
                    className="flex-1 bg-transparent outline-none text-sm md:text-base font-medium placeholder-gray-400"
                    onChange={(e) => setJobUrl(e.target.value)}
                />
                {jobUrl && step === 0 && (
                    <button 
                        onClick={() => handleAnalyze(true)}
                        className="text-[10px] font-bold uppercase tracking-widest bg-gray-100 dark:bg-[#383838] px-3 py-1.5 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                        Analyze URL Only
                    </button>
                )}
             </div>
          </div>

          {/* Middle Section: Sequential Step Content */}
          <div className="p-8 min-h-[200px] flex flex-col justify-center animate-in fade-in duration-500">
             {step === 0 && (
               <div className="space-y-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-semibold tracking-tight">Upload your CV</span>
                    <span className="text-xs text-gray-400 font-medium">PDF Format Only</span>
                  </div>
                  <FileUpload label="" onFileSelect={(f) => f && handlePdfUpload(f, 'cv')} />
                  {isExtracting && <div className="text-[10px] text-gray-400 animate-pulse font-bold uppercase tracking-widest">Reading PDF...</div>}
                  
                  {/* Manual Paste / Edit Fallback */}
                  <div className="space-y-4">
                    {!isExtracting && (cvFileName || cvText.length > 0) && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">CV Content Preview:</div>
                                <div className="text-[10px] text-gray-400 font-medium">{cvText.length} chars</div>
                            </div>
                            <textarea 
                                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400 min-h-[120px] focus:ring-1 focus:ring-brand outline-none transition-all"
                                value={cvText}
                                onChange={(e) => setCvText(e.target.value)}
                                placeholder="Paste your CV text here if the PDF upload didn't work..."
                            />
                            {cvText.length === 0 && (
                                <p className="mt-2 text-[10px] text-red-400 font-bold uppercase tracking-wider">
                                    No text found in PDF. Please paste your CV text above.
                                </p>
                            )}
                        </div>
                    )}
                  </div>
               </div>
             )}

             {step === 1 && (
               <div className="space-y-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-lg font-semibold tracking-tight">Upload Cover Letter</span>
                    <span className="text-xs text-gray-400 font-medium">PDF Format Only</span>
                  </div>
                  <FileUpload label="" onFileSelect={(f) => f && handlePdfUpload(f, 'cl')} />
                  {isExtracting && <div className="text-[10px] text-gray-400 animate-pulse font-bold uppercase tracking-widest">Reading PDF...</div>}
                  
                  {/* Manual Paste / Edit Fallback */}
                  <div className="space-y-4">
                    {!isExtracting && (clFileName || coverLetterText.length > 0) && (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cover Letter Preview:</div>
                                <div className="text-[10px] text-gray-400 font-medium">{coverLetterText.length} chars</div>
                            </div>
                            <textarea 
                                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-xs text-gray-600 dark:text-gray-400 min-h-[120px] focus:ring-1 focus:ring-brand outline-none transition-all"
                                value={coverLetterText}
                                onChange={(e) => setCoverLetterText(e.target.value)}
                                placeholder="Paste your cover letter text here if the PDF upload didn't work..."
                            />
                        </div>
                    )}
                  </div>
               </div>
             )}

             {step === 2 && (
               <div className="space-y-6">
                  <div className="text-center">
                    <span className="text-lg font-semibold tracking-tight">Final Adjustments</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <ToneSelector value={tone} onChange={setTone} />
                    <SenioritySelector value={seniority} onChange={setSeniority} />
                    <div className="col-span-2">
                        <LanguageSelector value={language} onChange={setLanguage} />
                    </div>
                  </div>
               </div>
             )}
          </div>

          {/* Bottom Footer: Navigation & Actions */}
          <div className="p-4 bg-gray-50/50 dark:bg-[#2a2a2a] border-t border-[#f0f0f0] dark:border-[#383838] flex items-center justify-between">
            <button 
                onClick={handleBack}
                className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all hover:bg-gray-200 dark:hover:bg-[#383838]"
            >
                {step === 0 ? 'Home' : 'Back'}
            </button>
            
            <div className="flex gap-3">
                {step < 2 ? (
                    <>
                        <button 
                            onClick={handleNext}
                            className="text-xs font-bold uppercase tracking-widest px-6 py-2.5 border border-[#e5e5e5] dark:border-[#4d4d4d] rounded-full hover:bg-white dark:hover:bg-[#383838] transition-all shadow-sm"
                        >
                            Skip (Enter)
                        </button>
                        <button 
                            onClick={handleNext}
                            className="text-xs font-bold uppercase tracking-widest px-8 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-all shadow-md"
                        >
                            Continue
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={() => handleAnalyze()}
                        disabled={isLoading}
                        className="text-xs font-bold uppercase tracking-widest px-10 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-80 transition-all shadow-lg flex items-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                        ) : (
                            <span>Generate Analysis</span>
                        )}
                    </button>
                )}
            </div>
          </div>
        </div>

        {/* Keyboard Hint */}
        <div className="text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Press Enter to confirm or skip</p>
        </div>

      </div>
    </div>
  );
}
