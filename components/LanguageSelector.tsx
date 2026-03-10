'use client';

import React from 'react';

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="language" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Language
      </label>
      <select
        id="language"
        name="language"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-brand focus:ring-brand sm:text-sm p-3 transition-all outline-none border focus:ring-2 dark:text-foreground appearance-none cursor-pointer"
      >
        <option value="Auto-Detect">Auto-Detect (Match Job)</option>
        <option value="English">English</option>
        <option value="Norwegian">Norwegian</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
