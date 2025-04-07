"use client";

import React from "react";
import { SkillCategory } from "../types/datatypes";

interface SkillsProps {
  data: SkillCategory[];
  textColor?: string;
}

export default function Skills({ data, textColor = "black" }: SkillsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4">
      {data.map((category) => (
        <div key={category.id} className="mb-4">
          {category.name && (
            <h4 className={`font-medium mb-2 uppercase text-sm tracking-wider text-${textColor}`}>
              {category.name}
            </h4>
          )}
          <div className={`text-sm text-${textColor}`}>
            {category.skills.map((skill, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="mx-1">-</span>}
                <span>{skill}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
