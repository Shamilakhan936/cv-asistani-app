"use client";

import { FC } from 'react';

const ProfessionalThumbnail: FC = () => {
  return (
    <div className="w-full aspect-[210/297] bg-white rounded-lg overflow-hidden shadow-sm">
      <div className="flex h-full">
        {/* Left Sidebar */}
        <div className="w-[30%] bg-[#0D6B5E] p-3">
          <div className="w-full h-3 bg-white/80 rounded mb-2"></div>
          <div className="w-2/3 h-2 bg-white/60 rounded mb-4"></div>
          
          {/* Fake sections */}
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="w-full h-2 bg-white/30 rounded mb-2"></div>
                <div className="w-5/6 h-1.5 bg-white/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-3">
          {/* Fake content sections */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="w-full h-2 bg-gray-200 rounded mb-2"></div>
                <div className="w-5/6 h-1.5 bg-gray-100 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalThumbnail; 