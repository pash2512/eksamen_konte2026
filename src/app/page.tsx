import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden transition-colors duration-300">
      {/* Top Header - Minimalist */}
      <header className="flex items-center justify-between p-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
           <span className="font-bold text-lg tracking-tight px-2">jobfit 4.0</span>
        </div>
        <div className="flex gap-2">
           {/* Sign In removed to maintain Zero-Retention branding */}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-6 pb-24">
        <div className="mb-12 text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
           <div className="w-12 h-12 bg-white dark:bg-[#303030] border border-[#e5e5e5] dark:border-[#303030] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm ring-4 ring-gray-50 dark:ring-gray-900">
             <svg className="w-6 h-6 text-brand dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           </div>
           <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">How can I help you today?</h1>
        </div>

        {/* Suggestion Grid - The ChatGPT "Buttons" Look */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <Link href="/analyze" className="group p-4 border border-[#e5e5e5] dark:border-[#303030] rounded-xl hover:bg-card-hover transition-all cursor-pointer relative overflow-hidden">
            <div className="flex flex-col h-full">
              <span className="text-sm font-medium mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                 <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 Analyze Resume
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Match your CV against a job description.</span>
            </div>
          </Link>

          <Link href="/analyze" className="group p-4 border border-[#e5e5e5] dark:border-[#303030] rounded-xl hover:bg-card-hover transition-all cursor-pointer">
            <div className="flex flex-col h-full">
              <span className="text-sm font-medium mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                 <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                 Rewrite Bullet Points
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Improve your experience with AI-powered phrasing.</span>
            </div>
          </Link>

          <Link href="/analyze" className="group p-4 border border-[#e5e5e5] dark:border-[#303030] rounded-xl hover:bg-card-hover transition-all cursor-pointer">
            <div className="flex flex-col h-full">
              <span className="text-sm font-medium mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                 <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 Tailor Cover Letter
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Draft a personalized letter in your desired tone.</span>
            </div>
          </Link>

          <Link href="/analyze" className="group p-4 border border-[#e5e5e5] dark:border-[#303030] rounded-xl hover:bg-card-hover transition-all cursor-pointer">
            <div className="flex flex-col h-full">
              <span className="text-sm font-medium mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-200">
                 <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                 Keyword Discovery
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Extract essential keywords from any job posting.</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Floating Bottom Prompt Bar - ChatGPT Style */}
      <div className="fixed bottom-0 left-64 right-0 p-4 md:p-8 bg-gradient-to-t from-background via-background/95 to-transparent flex justify-center z-20">
        <Link href="/analyze" className="w-full max-w-3xl">
          <div className="relative group chat-input-shadow bg-white dark:bg-[#2f2f2f] border border-[#e5e5e5] dark:border-[#383838] rounded-2xl overflow-hidden p-2 transition-all hover:border-[#d1d1d1] dark:hover:border-[#4d4d4d]">
            <div className="flex items-center px-4 py-3 min-h-[52px]">
              <span className="text-gray-400 dark:text-gray-500 text-sm md:text-base flex-1">Start a new analysis...</span>
              <div className="flex gap-2">
                 <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#383838] hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.415a6 6 0 108.486 8.486L20.5 13" /></svg>
                 </div>
                 <div className="p-2 rounded-lg bg-black dark:bg-white text-white dark:text-black">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                 </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none z-30">
        <p className="text-[10px] text-gray-400 font-medium">jobfit can make mistakes. Check important info.</p>
      </div>
    </div>
  );
}
