import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="flex-shrink-0 w-64 bg-sidebar border-r border-[#e5e5e5] dark:border-[#303030] h-screen flex flex-col p-3 transition-colors duration-300">
      <div className="mb-2">
        <Link 
          href="/analyze" 
          className="flex items-center justify-between p-2 rounded-lg hover:bg-card-hover text-sm font-medium group transition-all"
        >
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 bg-white dark:bg-[#303030] border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
             </div>
             <span>New Analysis</span>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 space-y-1">
        {/* History removed for privacy/cleanliness */}
      </div>

      <div className="mt-auto pt-4 pb-4 border-t border-[#e5e5e5] dark:border-[#303030]">
        <div className="px-2 py-3">
            <p className="text-[10px] text-gray-400 text-center flex flex-col items-center gap-1.5 leading-relaxed">
                <span className="flex items-center justify-center gap-1 font-bold text-gray-500 uppercase tracking-widest">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    <span>Zero Retention</span>
                </span>
                All data is ephemeral and deleted when you close this tab.
            </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
