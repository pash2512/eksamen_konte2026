import React from 'react';

interface RewrittenBulletsProps {
  title: string;
  bullets?: string[];
}

const RewrittenBullets: React.FC<RewrittenBulletsProps> = ({ title, bullets = [] }) => {
  const safeBullets = Array.isArray(bullets) ? bullets : [];

  return (
    <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">{title}</h3>
      <ul className="space-y-4">
        {safeBullets.map((bullet, index) => (
          <li key={index} className="flex items-start p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-brand/30 transition-colors">
            <div className="text-brand mr-4 mt-1 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed">{bullet}</p>
          </li>
        ))}
        {safeBullets.length === 0 && (
          <p className="text-sm text-gray-400 italic">No rewritten points available.</p>
        )}
      </ul>
    </div>
  );
};

export default RewrittenBullets;
