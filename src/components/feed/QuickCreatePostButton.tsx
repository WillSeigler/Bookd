'use client';

import React from 'react';

export function QuickCreatePostButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('openCreatePost'))}
      className="flex items-center w-full p-3 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-colors"
    >
      <div className="p-2 bg-yellow-100 rounded-lg">
        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="ml-3 text-sm font-medium text-gray-900">Create Post</span>
    </button>
  );
}


