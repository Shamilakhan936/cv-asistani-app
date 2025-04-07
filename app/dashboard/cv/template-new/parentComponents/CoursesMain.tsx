"use client";

import { Passion } from "../types/datatypes";

interface CoursesProps {
  data: Passion[];
  border?: boolean; 
}

const Courses: React.FC<CoursesProps> = ({ data, border = true }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-[8px]">
      <ul className="mt-[8px] text-[12px]">
        {data.map((course) => (
          <li 
            key={course.id} 
            className={`py-1 ${border ? "border-b-2 border-dashed border-[#ccc]" : ""}`}
          >
            <span className="font-medium text-[#235986] text-[16px] font-semibold">{course.title}</span>
            <p className="text-black text-[13px] py-1">{course.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
