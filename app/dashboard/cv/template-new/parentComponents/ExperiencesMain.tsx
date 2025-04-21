"use client";

import { Experience as ExperienceType } from "../types/datatypes";
import { FaRegCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface ExperienceProps {
  data: ExperienceType[];
  border?: boolean;
  layout?: "single" | "separate";
  textStyle?: {
    role?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
    company?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
    date?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
    location?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
    responsibilities?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
  };
}

const Experience: React.FC<ExperienceProps> = ({
  data,
  border = true,
  layout = "single",
  textStyle,
}) => {
  return (
    <div className="relative">
      <div>
        {data.map((exp) => (
          <div key={exp.id}>
            {/* Role */}
            <div className="flex justify-between items-center">
              <h3
                style={{
                  fontSize: textStyle?.role?.fontSize || "20px",
                  color: textStyle?.role?.color || "#235986",
                  fontFamily: textStyle?.role?.fontFamily || "inherit",
                }}
                className="font-normal"
              >
                {exp.role}
              </h3>
            </div>

            {/* Layout switch: single or separate */}
            {layout === "single" ? (
              <div className="flex flex-col gap-2 mt-[6px]">
                {/* Company */}
                <p
                  style={{
                    fontSize: textStyle?.company?.fontSize || "15px",
                    color: textStyle?.company?.color || "#14324c",
                    fontFamily: textStyle?.company?.fontFamily || "inherit",
                  }}
                  className="font-bold whitespace-nowrap"
                >
                  {exp.company}
                </p>

                {/* Date + City */}
                <div className="flex gap-[20px]">
                  {/* Date */}
                  <p
                    style={{
                      fontSize: textStyle?.date?.fontSize || "12px",
                      color: textStyle?.date?.color || "#2c2a2a",
                      fontFamily: textStyle?.date?.fontFamily || "inherit",
                    }}
                    className="flex items-center gap-1"
                  >
                    <FaRegCalendarAlt className="text-[#2c2a2a] text-[14px]" />
                    {exp.date}
                  </p>

                  {/* City */}
                  <p
                    style={{
                      fontSize: textStyle?.location?.fontSize || "12px",
                      color: textStyle?.location?.color || "#2c2a2a",
                      fontFamily: textStyle?.location?.fontFamily || "inherit",
                    }}
                    className="flex items-center gap-1"
                  >
                    <FaMapMarkerAlt className="text-[#2c2a2a] text-[12px]" />
                    {exp.city}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-[6px] flex justify-between">
                {/* Company */}
                <p
                  style={{
                    fontSize: textStyle?.company?.fontSize || "15px",
                    color: textStyle?.company?.color || "#14324c",
                    fontFamily: textStyle?.company?.fontFamily || "inherit",
                  }}
                  className="font-bold whitespace-nowrap"
                >
                  {exp.company}
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
                  <FaRegCalendarAlt className="text-[#2c2a2a] text-[14px]" />
                  {exp.date}
                </p>

                {/* City */}
                <p
                  style={{
                    fontSize: textStyle?.location?.fontSize || "12px",
                    color: textStyle?.location?.color || "#2c2a2a",
                    fontFamily: textStyle?.location?.fontFamily || "inherit",
                  }}
                  className="flex items-center gap-1 mt-1"
                >
                  <FaMapMarkerAlt className="text-[#2c2a2a] text-[12px]" />
                  {exp.city}
                </p>
              </div>
            )}

            {/* Responsibilities */}
            <ul
              className={`list-disc my-2 py-[5px] pl-5 ${
                border ? "border-b-2 border-dashed border-[#ccc]" : ""
              }`}
              style={{
                fontSize: textStyle?.responsibilities?.fontSize || "13px",
                color: textStyle?.responsibilities?.color || "#2c2a2a",
                fontFamily: textStyle?.responsibilities?.fontFamily || "inherit",
              }}
            >
              {exp.responsibilities.map((task, index) => (
                <li key={index} className="pl-1 mb-1">
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experience;
