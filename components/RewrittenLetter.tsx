import React from 'react';

interface RewrittenLetterProps {
  title: string;
  content?: string;
}

const RewrittenLetter: React.FC<RewrittenLetterProps> = ({ title, content = "" }) => {
  const safeContent = typeof content === 'string' ? content : "";

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">{title}</h3>
      <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-gray-100 dark:border-gray-800 relative group">
        {safeContent && (
            <button 
            onClick={() => navigator.clipboard.writeText(safeContent)}
            className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
            title="Copy to clipboard"
            >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
            </button>
        )}
        {safeContent ? (
          <div className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-serif">
            {safeContent}
          </div>
        ) : (
          <p className="text-gray-400 italic text-sm">No rewritten content available.</p>
        )}
      </div>
    </div>
  );
};

export default RewrittenLetter;
