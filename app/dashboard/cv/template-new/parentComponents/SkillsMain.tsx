"use client";

import React from 'react';
import { SkillCategory } from '../types/datatypes';

interface SkillsProps {
  data: SkillCategory[];
}

export default function Skills({ data }: SkillsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="">
      {data.map((category) => (
        <div key={category.id} className="py-4  ">
          {/* <h3 className="text-lg font-semibold text-black mb-2">{category.name}</h3> */}
          <div className="flex flex-wrap gap-[12px]">
            {category.skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 text-sm border-b-2 border-gray-400">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
