'use client';

import React from 'react';

interface SenioritySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const SenioritySelector: React.FC<SenioritySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label htmlFor="seniority" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Seniority Level
      </label>
      <select
        id="seniority"
        name="seniority"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-brand focus:ring-brand sm:text-sm p-3 transition-all outline-none border focus:ring-2 dark:text-foreground appearance-none cursor-pointer"
      >
        <option value="Student / Intern">Student / Intern</option>
        <option value="Junior">Junior</option>
        <option value="Mid-level">Mid-level</option>
        <option value="Senior">Senior</option>
        <option value="Lead / Principal">Lead / Principal</option>
      </select>
    </div>
  );
};

export default SenioritySelector;
