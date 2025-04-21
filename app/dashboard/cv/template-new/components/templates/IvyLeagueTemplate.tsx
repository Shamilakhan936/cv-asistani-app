"use client";

import { FC } from 'react';
import { ResumeData, HeaderData } from '../../types/datatypes';
import Experience from '../../parentComponents/ExperiencesMain';
import Education from '../../parentComponents/EducationMain';
import SummaryNew from '../../parentComponents/SummaryMain';
import AchievementsNew from '../../parentComponents/AchievementsNew';
import CertificationMain from '../../parentComponents/CertificationMain';

interface TemplateProps extends Omit<ResumeData, 'header'> {
  header: HeaderData;
  profileImage: string;
}

const LeagueTemplate: FC<TemplateProps> = ({ 
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
        <div className="mb-[8px] text-center">
          <h1 className="text-[22px] font-bold uppercase text-[#002b7f] mb-1">{header.name}</h1>
          <h2 className="text-[18px] text-[#56acf2] mb-2">
            {header.title} {header.role && <span className="mx-2">|</span>} {header.role}
          </h2>
          <div className="text-[14px] text-black flex items-center justify-center gap-4">
            {/* {header.phone && <span>{header.phone}</span>} */}
            {header.email && <span>{header.email} </span>}
            {header.github && <span>{header.github}</span>}
            {header.location && <span>{header.location}</span>}
          </div>
        </div>

        {/* Summary Section */}
        {header.summary && (
          <div className="mb-[8px]">
            <h2 className="text-[18px] font-bold text-[#002b7f] text-center uppercase mb-2 border-b border-[#3e3e3e] pb-[2px]">
              Summary
            </h2>
            <p className="text-[14px] text-black leading-relaxed">
              {header.summary}
            </p>
          </div>
        )}

        {/* Experience Section */}
        <div className="mb-[8px]">
          <h2 className="text-[18px] font-bold text-[#002b7f] text-center uppercase mb-2 border-b border-[#3e3e3e] pb-[2px]">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="text-[14px]">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="text-[#56acf2] text-[18px]">{exp.company}</div>
                    <h3 className="font-semibold text-[#002b7f]  text-[16px]">{exp.position}</h3>
                  </div>
                  <div className="text-[#384347] text-[15px] text-right">
                    <div>{exp.city}</div>
                    <div>{exp.date}</div>
                  </div>
                </div>
                <ul className="list-disc ml-4 text-[#444] text-[14px] space-y-1">
                  {exp.responsibilities?.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-[8px]">
          <h2 className="text-[18px] font-bold text-[#002b7f] text-center uppercase mb-2 border-b border-[#3e3e3e] pb-[2px]">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="text-[14px]">
                <div className="">
                  <div>
                    <div className="text-[#56acf2] text-[18px]">{edu.institution}</div>
                  </div>
                  <div className="text-[#384347] text-[15px] flex justify-between w-full">
                    <h3 className="font-semibold text-[15px]">{edu.degree}</h3>
                    <div>{edu.date}</div>
                    
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Achievements Section */}
        {achievements && achievements.length > 0 && (
          <div className="mb-[8px]">
            <h2 className="text-[18px] font-bold text-[#002b7f] text-center uppercase mb-2 border-b border-[#3e3e3e] pb-[2px]">
              Key Achievements
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-[14px]">
                  <h3 className="font-semibold  text-[16px] mb-1 text-[#002b7f]">{achievement.title}</h3>
                  <p className="text-[#444] text-[14px]">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {skills && skills.length > 0 && (
          <div className="mb-[8px]">
            <h2 className="text-[18px] font-bold text-[#002b7f] text-center uppercase mb-2 border-b border-[#3e3e3e] pb-[2px]">
              Skills
            </h2>
            <div className="">
              {skills.map((category, index) => (
                <div key={index} className="text-[16px] flex gap-[10px] ">
                  {/* <h3 className="font-semibold  mb-1">{category.name}</h3> */}
                  <div className="text-[#444]">
                    {category.skills.join('- ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
          {/* Skills Section */}
          {certifications && certifications.length > 0 && (
  <div className="mb-[8px]">
    <h2 className="text-[18px] font-bold text-[#002b7f] text-center uppercase mb-2 border-b border-[#3e3e3e] pb-[2px]">
      Certifications
    </h2>
    <div className="space-y-4">
      {certifications.map((cert, index) => (
        <div key={index} className="text-[16px] flex gap-2">
          <h3 className="font-medium  text-[15px] text-[#002b7f]">{cert.title}</h3>
          {/* <p className="text-[#444]">{cert.organization}</p> */}
          {/* <p className="text-[#666] text-sm">{cert.issuer} | {cert.date}</p> */}
          <p className="text-[#444] text-[14px]">{cert.description}</p>
        </div>
      ))}
    </div>
  </div>
)}


      </div>
    </div>
  );
};

export default LeagueTemplate; 