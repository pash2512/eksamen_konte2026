import React from 'react';

interface RewrittenCvProps {
  title: string;
  content?: string;
}

const RewrittenCv: React.FC<RewrittenCvProps> = ({ title, content = "" }) => {
  const safeContent = typeof content === 'string' ? content : "";

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">{title}</h3>
        {safeContent && (
            <button 
                onClick={() => navigator.clipboard.writeText(safeContent)}
                className="p-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center gap-1.5"
                title="Copy to clipboard"
            >
                <svg className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Copy</span>
            </button>
        )}
      </div>
      <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl border border-gray-100 dark:border-gray-800 relative">
        {safeContent ? (
          <div className="text-gray-700 dark:text-gray-300 text-[13px] leading-relaxed whitespace-pre-wrap font-sans">
            {safeContent}
          </div>
        ) : (
          <p className="text-gray-400 italic text-sm">No rewritten content available.</p>
        )}
      </div>
      <div className="mt-4 flex items-center gap-2">
         <div className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-[9px] font-bold uppercase tracking-widest rounded">ATS Optimized</div>
         <div className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-widest rounded">Keyword Targeted</div>
      </div>
    </div>
  );
};

export default RewrittenCv;
