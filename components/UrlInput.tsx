'use client';

import React from 'react';

interface UrlInputProps {
  onUrlChange: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlChange }) => {
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUrlChange(event.target.value);
  };

  return (
    <div className="w-full">
      <label htmlFor="job-url" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Job Ad URL
      </label>
      <div className="mt-1 flex rounded-xl shadow-sm">
        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 text-sm">
          https://
        </span>
        <input
          type="text"
          name="job-url"
          id="job-url"
          className="flex-1 block w-full rounded-none rounded-r-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm focus:border-brand focus:ring-brand sm:text-sm p-3 transition-all outline-none border focus:ring-2 dark:text-foreground"
          placeholder="example.com/job-opening"
          onChange={handleUrlChange}
        />
      </div>
    </div>
  );
};

export default UrlInput;
