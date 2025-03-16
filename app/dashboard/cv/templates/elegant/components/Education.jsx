'use client';
import React from "react";

const EducationItem = ({ degree, university, location, duration }) => {
  return (
    <div className="mb-1">
      <div className="flex font-rubik">
        <p className="text-textColor text-sm">{degree}</p>
        <p className="ml-auto text-xs text-textColor">{duration}</p>
      </div>
      <div className="flex font-rubik">
        <p className="text-sm text-light mt-[2px]">{university}</p>
        <p className="ml-auto text-xs text-textColor">{location}</p>
      </div>
    </div>
  );
};

const educationData = [
  {
    degree: "Master of Science in Finance",
    university: "Ohio State University",
    location: "Columbus, OH",
    duration: "01/2007 - 01/2009",
  },
  {
    degree: "Bachelor of Business Administration",
    university: "Miami University",
    location: "Oxford, OH",
    duration: "01/2003 - 01/2007",
  },
];
const Education = () => {
  return (
    <div className="mt-5">
      <h3 className="text-textColor font-rubik border-b border-grayIcon mb-1 pb-1">
        EDUCATION
      </h3>
      {educationData.map((edu, index) => (
        <EducationItem key={index} {...edu} />
      ))}
    </div>
  );
};

export default Education; 