'use client';

import React from 'react';

interface ToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="tone" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Tone
      </label>
      <select
        id="tone"
        name="tone"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-brand focus:ring-brand sm:text-sm p-3 transition-all outline-none border focus:ring-2 dark:text-foreground appearance-none cursor-pointer"
      >
        <option value="Professional">Professional</option>
        <option value="Friendly">Friendly</option>
        <option value="Formal">Formal</option>
        <option value="Enthusiastic">Enthusiastic</option>
      </select>
    </div>
  );
};

export default ToneSelector;
