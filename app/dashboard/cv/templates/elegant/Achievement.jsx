'use client';
import React from "react";
import { Star } from "lucide-react";

const Achievement = ({ data = [] }) => {
  // Veri yoksa veya boş bir dizi ise mesaj göster
  if (!data || data.length === 0) {
    return (
      <div className="mt-5">
        <h3 className="text-whiteText font-rubik border-b border-grayIcon mb-1 pb-1">
          KEY ACHIEVEMENTS
        </h3>
        <p className="text-whiteText text-xs italic mt-2">No achievement data available.</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="text-whiteText font-rubik border-b border-grayIcon mb-1 pb-1">
        KEY ACHIEVEMENTS
      </h3>
      {data.map((achievement, index) => (
        <div key={index} className="flex mt-2">
          <div className="mr-2 text-whiteText">
            {achievement.icon || <Star size={16} />}
          </div>
          <div>
            <p className="text-whiteText font-rubik text-[15px]">
              {achievement.title}
            </p>
            <p className="text-xs text-whiteText mt-[2px] font-inter">
              {achievement.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Achievement; 