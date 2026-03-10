'use client';

import React from 'react';

interface TextAreaInputProps {
  label?: string;
  placeholder: string;
  onTextChange: (text: string) => void;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, placeholder, onTextChange }) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value);
  };

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>}
      <div className="mt-1">
        <textarea
          rows={4}
          className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-brand focus:ring-brand sm:text-sm p-3 transition-all outline-none border focus:ring-2 dark:text-foreground"
          placeholder={placeholder}
          onChange={handleTextChange}
        />
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Paste the content directly for quick analysis.
      </p>
    </div>
  );
};

export default TextAreaInput;
