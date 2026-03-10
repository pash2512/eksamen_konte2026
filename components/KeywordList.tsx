import React from 'react';

interface KeywordListProps {
  title: string;
  keywords?: string[];
  color: 'green' | 'red';
}

const KeywordList: React.FC<KeywordListProps> = ({ title, keywords = [], color }) => {
  const getColors = () => {
    if (color === 'green') {
      return 'bg-brand/10 text-brand border-brand/20';
    }
    return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20';
  };

  const safeKeywords = Array.isArray(keywords) ? keywords : [];

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {safeKeywords.map((keyword, index) => (
          <span key={index} className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all hover:scale-105 cursor-default ${getColors()}`}>
            {keyword}
          </span>
        ))}
        {safeKeywords.length === 0 && (
          <p className="text-sm text-gray-400 italic font-medium">No keywords identified.</p>
        )}
      </div>
    </div>
  );
};

export default KeywordList;
