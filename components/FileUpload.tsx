
'use client';

import React from 'react';

interface FileUploadProps {
  label: string;
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onFileSelect }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</label>
      <div className="mt-1 flex justify-center px-4 py-6 border-2 border-gray-200 dark:border-gray-700 border-dashed rounded-xl hover:border-brand dark:hover:border-brand transition-colors cursor-pointer group">
        <div className="space-y-2 text-center">
          <svg className="mx-auto h-10 w-10 text-gray-400 group-hover:text-brand transition-colors" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <div className="flex text-sm text-gray-600 dark:text-gray-400">
            <label htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`} className="relative cursor-pointer bg-transparent rounded-md font-medium text-brand hover:text-brand-hover focus-within:outline-none">
              <span>Upload a file</span>
              <input 
                id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`} 
                name="file-upload" 
                type="file" 
                className="sr-only" 
                onChange={handleFileChange} 
                accept=".pdf"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PDF up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
