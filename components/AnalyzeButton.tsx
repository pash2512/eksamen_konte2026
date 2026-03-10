
'use client';

import React from 'react';

const AnalyzeButton: React.FC = () => {
  const handleClick = () => {
    // Logic to trigger analysis will be added later
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      Analyze
    </button>
  );
};

export default AnalyzeButton;
