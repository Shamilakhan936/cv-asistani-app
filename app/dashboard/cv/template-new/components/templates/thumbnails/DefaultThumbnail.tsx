"use client";

import React from 'react';

const DefaultThumbnail: React.FC = () => {
  return (
    <div className="w-full aspect-[210/297] bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="h-[20%] bg-gray-800 p-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
          <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
        </div>
      </div>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-3 w-full bg-gray-100 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-3 w-full bg-gray-100 rounded"></div>
          <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default DefaultThumbnail; 