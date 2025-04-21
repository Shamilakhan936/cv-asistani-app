"use client";

import { FC } from 'react';
import { ResumeData, HeaderData } from '../../types/datatypes';
import Experience from '../../parentComponents/ExperiencesMain';
import Education from '../../parentComponents/EducationMain';
import SummaryNew from '../../parentComponents/SummaryMain';
import AchievementsNew from '../../parentComponents/AchievementsNew';
import CertificationMain from '../../parentComponents/CertificationMain';
import Languages from '../Languages';
import SkillsMain from "../../parentComponents/SkillsMain"; 

interface TemplateProps extends Omit<ResumeData, 'header'> {
  header: HeaderData;
  profileImage: string;
}

const SingleColumnTemplate: FC<TemplateProps> = ({ 
  header, 
  experience, 
  education, 
  languages, 
  skills, 
  achievements,
  certifications,
  projects,
  passion,
  profileImage 
}) => {
  return (
    <div className="bg-white w-full min-h-full p-8 font-[system-ui]">
      <div className="max-w-[800px] mx-auto">
        {/* Header Section */}
        <div className="mb-[24px] text-start ">
          <h1 className="text-[38px] font-bold uppercase text-[#19273c] leading-[34px] py-2">{header.name}</h1>
          <h2 className="text-[20px] leading-[21px] text-[#3c6df0] mb-[2px] py-2">
            {header.title} {header.role && <span className="mx-2">|</span>} {header.role}
          </h2>
          <div className="text-[14px] text-black flex font-medium items-center justify-start gap-6">
            {header.phone && <div className="text-[12px]">{header.phone}</div>}
            {header.email && <span>{header.email} </span>}
            {header.github && <span>{header.github}</span>}
            {header.location && <span>{header.location}</span>}

          </div>
        </div>

        {/* Summary Section */}
        {header.summary && (
          <div className="mb-[24px] ">
            <h2 className="text-[22px]  leading-[16px] font-semibold text-[#19273c] text-start uppercase mb-2">
              Summary
            </h2>
            <p className="text-[13px] border-t-[3px] pt-[8px] border-t-black text-[#3e3e3e] leading-relaxed">
              {header.summary}
            </p>
          </div>
        )}
        {achievements && achievements.length > 0 && (
          <div className="mb-[24px]">
            <h2 className="text-[22px]  leading-[16px] font-semibold text-[#19273c] text-start uppercase pb-1">
              Key Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4 border-t-[3px] border-t-black pt-[8px]">
              {achievements.map((achievement, index) => (
                <div key={index} className="">
                  <h3 className="font-semibold text-black  text-[16px] mb-1">{achievement.title}</h3>
                  <p className=" border-b text-[##3e3e3e] border-dashed text-[14px]">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        <div className="mb-[24px]">
          <h2 className="text-[22px]  leading-[16px] font-semibold text-[#19273c] text-start uppercase pb-1">
            Experience
          </h2>
          <div className="space-y-6 border-t-[3px] border-t-black pt-[8px]">
            {experience.map((exp, index) => (
              <div key={index} className="text-[14px]">
                <div className=" justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold mb-[5px] text-black leading-[21px] text-[19px]">{exp.position}</h3>
                    <div className="text-[#3c6df0] mb-[5px] text-[16px] leading-[18px] font-medium">{exp.company}</div>
                    
                    <div className="text-[#3e3e3e] text-[12px] mb-[5px] leading-[15px] flex items-center gap-[20px]">
                    <div>{exp.city}</div>
                    <div>{exp.date}</div>
                  </div>
                  </div>
                  <p className="font-normal text-black mb-[5px] text-[15px] leading-[16px]">{exp.position}</p>
                 
                </div>
                <ul className="list-disc ml-4 text-[#3e3e3e] text-[13px] leading-[16px] space-y-1">
                  {exp.responsibilities?.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-[24px]">
          <h2 className="text-[22px]  leading-[16px] font-semibold text-[#19273c] text-start uppercase mb-2 ">
            Education
          </h2>
          <div className="space-y-4 border-t-[3px] border-t-black pt-[8px]">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between gap-[12px] items-start border-b-[2px]  border-dashed">
                  <div>
                    <h3 className="font-normal mb-[5px] leading-[21px] text-[19px]">{edu.degree}</h3>
                    <div className="text-[#3c6df0] mb-[5px] leading-[18px] font-medium text-[16px]">{edu.institution}</div>
                  <div className="text-[#384347] mb-[5px] text-[14px]">
                    <div>{edu.date}</div>
                  </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Skills Section */}
          <div className="mb-[24px]">
            <h2 className="text-[22px]  leading-[16px] font-semibold text-[#19273c] text-start uppercase mb-[7px]">
              Skills
            </h2>
            <div className="border-t-[3px] border-t-black pt-[8px]">
              <SkillsMain data={skills} textSize={{ small: 'text-[14px]' }} />
            </div>
          </div>
            {/* language section */}
            <h2 className="text-[22px] border-b-[3px] border-b-black pb-[8px]  leading-[16px] font-semibold text-[#19273c] text-start uppercase mb-[7px]">
            Languages
            </h2>
          {certifications && certifications.length > 0 && (
         <div className="mb-[8px]">
        <div className="space-y-4" data-section="languages">
          <Languages data={languages}/>
        </div>
      </div>
      )}
      </div>
    </div>
  );
};

export default SingleColumnTemplate; 