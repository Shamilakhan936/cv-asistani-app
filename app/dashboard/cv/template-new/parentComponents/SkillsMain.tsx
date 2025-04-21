"use client";

import React from 'react';
import { SkillCategory } from '../types/datatypes';

interface TextSizeConfig {
  small: string;
  base?: string;
  large?: string;
  xl?: string;
}

interface SkillsProps {
  data: SkillCategory[];
  textSize: TextSizeConfig;
}

export default function Skills({ data, textSize }: SkillsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      {data.map((category) => (
        <div key={category.id} className="py-2">
          {/* Uncomment if you want to show category name */}
          {/* <h3 className={`${textSize.large || 'text-lg'} font-semibold text-black mb-2`}>
            {category.name}
          </h3> */}
          <div className="flex flex-wrap gap-[12px]">
            {category.skills.map((skill, index) => (
              <span
                key={index}
                className={`px-2 font-medium py-1 ${textSize.small || 'text-sm'} border-b-2 border-gray-400`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
