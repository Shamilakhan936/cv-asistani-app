'use client';
import React from "react";
import { DollarSign } from "lucide-react";

// Varsayılan tutku verileri
const defaultPassions = [
  {
    icon: <DollarSign size={16} />,
    title: "Process Efficiency Optimization",
    description:
      "Applied Lean Six Sigma principles to revamp treasury processes, resulting in a 25% boost in department efficiency.",
  },
];

function Passions({ data = [] }) {
  // Veri yoksa veya boş bir dizi ise mesaj göster
  if (!data || data.length === 0) {
    return (
      <div className="mt-5">
        <h3 className="text-whiteText font-rubik border-b border-grayIcon mb-1 pb-1">
          PASSIONS
        </h3>
        <p className="text-whiteText text-xs italic mt-2">No passion data available.</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="text-whiteText font-rubik border-b border-grayIcon mb-1 pb-1">
        PASSIONS
      </h3>
      {data.map((passion, index) => (
        <div key={index} className="flex mt-2">
          <div className="mr-2 text-whiteText">
            {passion.icon || <DollarSign size={16} />}
          </div>
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