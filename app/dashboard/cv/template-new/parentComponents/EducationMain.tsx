"use client";

import { Education as EducationType } from "../types/datatypes";
import { FaRegCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface EducationProps {
  data: EducationType[];
  border?: boolean;
  layout?: "single" | "separate";
  textStyle?: {
    degree?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
    institution?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
    date?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
    city?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
  };
}

const Education: React.FC<EducationProps> = ({
  data,
  border = true,
  layout = "single",
  textStyle,
}) => {
  return (
    <div className="relative">
      <div className="mt-2">
        {data.map((edu) => (
          <div
            key={edu.id}
            className={`mb-[8px] py-[6px] ${border ? "border-b-2 border-dashed border-[#ccc]" : ""}`}
          >
            {/* Degree */}
            <div>
              <p
                style={{
                  fontSize: textStyle?.degree?.fontSize || "20px",
                  color: textStyle?.degree?.color || "#235986",
                  fontFamily: textStyle?.degree?.fontFamily || "inherit",
                }}
              >
                {edu.degree}
              </p>
            </div>

            {/* Layout */}
            {layout === "single" ? (
              <div className="flex flex-col gap-2 mt-1">
                {/* Institution */}
                <p
                  style={{
                    fontSize: textStyle?.institution?.fontSize || "16px",
                    color: textStyle?.institution?.color || "#14324c",
                    fontFamily: textStyle?.institution?.fontFamily || "inherit",
                  }}
                  className="font-semibold"
                >
                  {edu.institution}
                </p>

                {/* Date + City */}
                <div className="flex gap-[20px]">
                  <p
                    style={{
                      fontSize: textStyle?.date?.fontSize || "12px",
                      color: textStyle?.date?.color || "#2c2a2a",
                      fontFamily: textStyle?.date?.fontFamily || "inherit",
                    }}
                    className="flex items-center gap-1"
                  >
                    <FaRegCalendarAlt className="text-[14px] text-[#2c2a2a]" />
                    {edu.date}
                  </p>
                  <p
                    style={{
                      fontSize: textStyle?.city?.fontSize || "12px",
                      color: textStyle?.city?.color || "#2c2a2a",
                      fontFamily: textStyle?.city?.fontFamily || "inherit",
                    }}
                    className="flex items-center gap-1"
                  >
                    <FaMapMarkerAlt className="text-[14px] text-[#2c2a2a]" />
                    {edu.city}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-1 flex justify-between">
                {/* Institution */}
                <p
                  style={{
                    fontSize: textStyle?.institution?.fontSize || "16px",
                    color: textStyle?.institution?.color || "#14324c",
                    fontFamily: textStyle?.institution?.fontFamily || "inherit",
                  }}
                  className="font-semibold"
                >
                  {edu.institution}
                </p>

                {/* Date */}
                <p
                  style={{
                    fontSize: textStyle?.date?.fontSize || "12px",
                    color: textStyle?.date?.color || "#2c2a2a",
                    fontFamily: textStyle?.date?.fontFamily || "inherit",
                  }}
                  className="flex items-center gap-1 mt-1"
                >
                  <FaRegCalendarAlt className="text-[14px] text-[#2c2a2a]" />
                  {edu.date}
                </p>

                {/* City */}
                <p
                  style={{
                    fontSize: textStyle?.city?.fontSize || "12px",
                    color: textStyle?.city?.color || "#2c2a2a",
                    fontFamily: textStyle?.city?.fontFamily || "inherit",
                  }}
                  className="flex items-center gap-1 mt-1"
                >
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
