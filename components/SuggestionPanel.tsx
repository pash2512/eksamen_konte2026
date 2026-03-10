import React from 'react';

interface SuggestionPanelProps {
  title: string;
  suggestions?: string[];
}

const SuggestionPanel: React.FC<SuggestionPanelProps> = ({ title, suggestions = [] }) => {
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">{title}</h3>
      <ul className="space-y-4">
        {safeSuggestions.map((suggestion, index) => (
          <li key={index} className="flex items-start group">
            <div className="w-6 h-6 rounded-full bg-brand/10 text-brand flex items-center justify-center mr-4 flex-shrink-0 mt-0.5 group-hover:bg-brand group-hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{suggestion}</p>
          </li>
        ))}
         {safeSuggestions.length === 0 && (
          <p className="text-sm text-gray-400 italic">No specific suggestions at this time.</p>
        )}
      </ul>
    </div>
  );
};

export default SuggestionPanel;
