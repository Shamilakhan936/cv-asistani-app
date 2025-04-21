"use client";

import { FC } from 'react';
import { ResumeData, HeaderData } from '../../types/datatypes';
import Experience from '../../parentComponents/ExperiencesMain';
import Education from '../../parentComponents/EducationMain';
import SummaryNew from '../../parentComponents/SummaryMain';
import AchievementsNew from '../../parentComponents/AchievementsNew';
import CertificationMain from '../../parentComponents/CertificationMain';
import Languages from '../Languages';

interface TemplateProps extends Omit<ResumeData, 'header'> {
  header: HeaderData;
  profileImage: string;
}

const TeacherTemplate: FC<TemplateProps> = ({ 
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
        <div className="mb-[24px] text-start">
          <h1 className="text-[38px] font-bold uppercase text-black leading-[34px] pb-2">{header.name}</h1>
          <h2 className="text-[21px] leading-[25px] font-normal text-[#3e3e3e] mb-[2px]">
            {header.title} {header.role && <span className="mx-2">|</span>} {header.role}
          </h2>
          <div className="text-[13px] text-[#8a0202] flex items-center justify-start gap-4">
            {/* {header.phone && <span>{header.phone}</span>} */}
            {header.email && <span>{header.email} </span>}
            {header.github && <span>{header.github}</span>}
            {header.location && <span>{header.location}</span>}
          </div>
        </div>

        {/* Summary Section */}
        {header.summary && (
          <div className="mb-[24px]">
            <h2 className="text-[16px] leading-[19px] font-semibold text-[#65696d] text-start uppercase mb-1">
              Summary
            </h2>
            <p className="text-[14px] text-[#3e3e3e] leading-relaxed">
              {header.summary}
            </p>
          </div>
        )}
        
        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mb-[24px]">
            <h2 className="text-[16px] leading-[19px] font-semibold text-[#65696d] text-start uppercase mb-[7px]">
              Skills
            </h2>
            <div className="">
              {skills.map((category, index) => (
                <div key={index} className="text-[14px] leading-[17px] font-normal flex gap-[10px] ">
                  <div className="text-[#3e3e3e]">
                    {category.skills.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        <div className="mb-[24px]">
          <h2 className="text-[16px] leading-[19px] font-semibold text-[#65696d] text-start uppercase pb-1">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="text-[14px]">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-[#8a0202] leading-[25px] text-[21px]">{exp.position}</h3>
                    <div className="text-[#f96b07] text-[17px] leading-[20px] font-normal">{exp.company}</div>
                  </div>
                  <div className="text-[#3e3e3e] text-[12px] leading-[15px] text-right">
                    <div>{exp.city}</div>
                    <div>{exp.date}</div>
                  </div>
                </div>
                <ul className="list-disc ml-4 text-[#3e3e3e] text-[14px] leading-[17px] space-y-1">
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
          <h2 className="text-[16px] leading-[19px] font-semibold text-[#65696d] text-start uppercase mb-[7px]">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between gap-[12px] items-start">
                  <div>
                    <h3 className="font-normal text-[#8a0202] leading-[25px] text-[21px]">{edu.degree}</h3>
                    <div className="text-black leading-[20px] text-[17px]">{edu.institution}</div>
                  </div>
                  <div className="text-[#3e3e3e] text-[12px] text-right">
                    <div>{edu.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Key Achievements Section */}
        {achievements && achievements.length > 0 && (
          <div className="mb-[24px]">
            <h2 className="text-[16px] font-semibold text-[#65696d] text-start uppercase pb-1">
              Key Achievements
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-[14px]">
                  <h3 className="font-semibold text-[#f96b07] text-[16px] mb-1">{achievement.title}</h3>
                  <p className="text-[#3e3e3e] text-[14px] leading-[17px]">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTemplate; 