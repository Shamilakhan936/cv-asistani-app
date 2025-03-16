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

// Varsayılan eğitim verileri
const defaultEducation = [
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

const Education = ({ data = [] }) => {
  // Veri yoksa veya boş bir dizi ise mesaj göster
  if (!data || data.length === 0) {
    return (
      <div className="mt-5">
        <h3 className="text-textColor font-rubik border-b border-grayIcon mb-1 pb-1">
          EDUCATION
        </h3>
        <p className="text-gray-500 text-xs italic mt-2">No education data available.</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h3 className="text-textColor font-rubik border-b border-grayIcon mb-1 pb-1">
        EDUCATION
      </h3>
      {data.map((edu, index) => (
        <EducationItem key={index} {...edu} />
      ))}
    </div>
  );
};

export default Education; 