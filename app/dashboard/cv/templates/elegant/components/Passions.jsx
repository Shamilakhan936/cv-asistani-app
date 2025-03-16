'use client';
import React from "react";
import { DollarSign } from "lucide-react";

function Passions() {
  const passions = [
    {
      icon: <DollarSign size={16} />,
      title: "Process Efficiency Optimization",
      description:
        "Applied Lean Six Sigma principles to revamp treasury processes, resulting in a 25% boost in department efficiency.",
    },
  ];

  return (
    <div className="mt-5">
      <h3 className="text-whiteText font-rubik border-b border-grayIcon mb-1 pb-1">
        PASSIONS
      </h3>
      {passions.map((passion, index) => (
        <div key={index} className="flex mt-2">
          <div className="mr-2 text-whiteText">{passion.icon}</div>
          <div>
            <p className="text-whiteText font-rubik text-[15px]">
              {passion.title}
            </p>
            <p className="text-xs text-whiteText mt-1 font-inter">
              {passion.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Passions; 