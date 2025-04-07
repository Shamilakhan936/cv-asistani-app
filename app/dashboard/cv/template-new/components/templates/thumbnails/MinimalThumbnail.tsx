"use client";

import React from 'react';

const MinimalThumbnail: React.FC = () => {
  return (
    <div className="w-full aspect-[210/297] bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-800 rounded"></div>
          <div className="h-4 w-32 bg-gray-400 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-gray-600 rounded"></div>
          <div className="h-3 w-full bg-gray-100 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
        </div>
        <div className="space-y-3">
          <div className="h-4 w-24 bg-gray-600 rounded"></div>
          <div className="h-3 w-full bg-gray-100 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default MinimalThumbnail; 