'use client';
import React from "react";

function Courses() {
  const courses = [
    {
      title: "Certification in Project Management",
      description:
        "Obtained PMP certification through PMI, focusing on advanced project management.",
    },
    {
      title: "Certified Lean Six Sigma Green Belt",
      description: "Completed Lean Six Sigma Green Belt course.",
    },
  ];

  return (
    <div className="mt-5">
      <h3 className="text-whiteText font-rubik border-b border-grayIcon mb-1 pb-1">
        COURSES
      </h3>
      {courses.map((course, index) => (
        <div key={index} className="mt-2">
          <p className="text-whiteText font-rubik text-[15px]">
            {course.title}
          </p>
          <p className="text-xs text-whiteText mt-[2px] font-inter">
            {course.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Courses; 