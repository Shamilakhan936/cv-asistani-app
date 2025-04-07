"use client";

import { Education as EducationType } from "../types/datatypes";

interface EducationProps {
  data: EducationType[];
}

const Education: React.FC<EducationProps> = ({ data }) => {
  return (
    <div className="">
      <h2 className="text-[18px] font-semibold max-sm:font-bold text-[#384347] border-b-[1px] border-[#bdbdbd] pb-[5px]">
        EDUCATION
      </h2>
      <div className="mt-2">
        {data.map((edu) => (
          <div key={edu.id} className="mb-4">
            <div className="flex justify-between items-center">
              <p className="text-[#008CFF] text-[16px] font-semibold whitespace-nowrap">
                {edu.institution}
              </p>
              <p className="text-[14px]">{edu.city}</p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-[15px] text-[#2c2a2a]">{edu.degree}</p>
              <p className="text-[14px] text-[#2c2a2a]">{edu.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Education;
