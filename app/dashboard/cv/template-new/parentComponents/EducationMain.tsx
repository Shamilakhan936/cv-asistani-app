"use client";

import { Education as EducationType } from "../types/datatypes";
import { FaRegCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface EducationProps {
  data: EducationType[];
  border?: boolean;
  layout?: "single" | "separate"; 
}

const Education: React.FC<EducationProps> = ({ data, border = true, layout = "single" }) => {
  return (
    <div className="relative">
      <div className="mt-2">
        {data.map((edu) => (
          <div
            key={edu.id}
            className={`mb-[8px] py-[6px] ${border ? "border-b-2 border-dashed border-[#ccc]" : ""}`}
          >
            <div>
              <p className="text-[20px] text-[#235986]">{edu.degree}</p>
            </div>

            {layout === "single" ? (
              // Single div layout
              <div className="flex flex-col gap-2 mt-1">
                <p className="text-[#14324c] text-[16px] font-semibold">{edu.institution}</p>
                <div className="flex gap-[20px]">
                  <p className="text-[12px] text-[#2c2a2a] flex items-center gap-1">
                    <FaRegCalendarAlt className="text-[14px] text-[#2c2a2a]" />
                    {edu.date}
                  </p>
                  <p className="text-[12px] text-[#2c2a2a] flex items-center gap-1">
                    <FaMapMarkerAlt className="text-[14px] text-[#2c2a2a]" />
                    {edu.city}
                  </p>
                </div>
              </div>
            ) : (
              // Separate divs layout
              <div className="mt-1 flex justify-between">
                <p className="text-[#14324c] text-[16px] font-semibold">{edu.institution}</p>
                <p className="text-[12px] text-[#2c2a2a] flex items-center gap-1 mt-1">
                  <FaRegCalendarAlt className="text-[14px] text-[#2c2a2a]" />
                  {edu.date}
                </p>
                <p className="text-[12px] text-[#2c2a2a] flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="text-[14px] text-[#2c2a2a]" />
                  {edu.city}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
