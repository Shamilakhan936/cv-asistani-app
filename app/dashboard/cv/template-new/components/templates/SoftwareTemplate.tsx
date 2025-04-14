"use client";

import { FC } from 'react';
import { ResumeData, HeaderData } from '../../types/datatypes';
import { FaEnvelope, FaGithub, FaMapMarkerAlt } from "react-icons/fa";

import { IoDiamondOutline } from "react-icons/io5";
import ProfileImage from '../ProfileImage';



interface TemplateProps extends Omit<ResumeData, 'header'> {
  header: HeaderData;
  profileImage: string;
  isFirstPage: boolean;
}

const ProfessionalTemplate: FC<TemplateProps> = ({ 
  header, 
  experience, 
  education, 
  languages, 
  skills, 
  achievements,
  projects,
  passion,
  profileImage 
}) => {
  return (
    <div className="bg-white w-full ">
      <div className="flex">

        {/* Main Content Area */}
        <div className="flex-1 py-[44px] pl-[44px] pr-[24px]">
        <div className=" text-[13px] mb-[20px]">
        <div className="mt-[20px]">
            <h1 className="text-[28px] font-bold text-black">{header.name}</h1>
          </div>
          <div>
            <h2 className="text-[18px] text-[#1ab0b3] font-semibold ">{header.title}</h2>
          </div>
          <div className="flex items-center justify-between text-[12px] gap-[8px]">
              <div className="flex items-center gap-[4px]"><FaEnvelope className="text-gray-500 shrink-0" />{header.email}</div>
              {/* <div>{header.phone}</div> */}
              <div className="flex items-center gap-[4px]">
              <FaMapMarkerAlt className="text-gray-500 shrink-0" />
              {header.location}</div>
              {header.github && <div className="flex items-center gap-[4px]">
              <FaGithub className="text-gray-500 shrink-0" />
              {header.github}</div>}
          </div>
            </div>
          {/* Summary Section */}
          <div className="mb-[8px]">
            <h2 className="text-[20px] font-semibold text-[#384347] uppercase mb-3 border-b border-[#bdbdbd] pb-1">
              Summary
            </h2>
            <p className="text-[15px] text-[#444] leading-relaxed">
              {header.summary}
            </p>
          </div>

          {/* Experience Section */}
          <div className="mb-[8px] mt-[15px]">
            <h2 className="text-[20px] font-semibold text-[#384347] uppercase mb-3 border-b border-[#bdbdbd] pb-1">
              Experience
            </h2>
            <div className="space-y-6">
              {experience?.map((exp, index) => (
                <div key={index} className="text-[13px]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[18px] text-[#333] whitespace-nowrap">{exp.position}</h3>
                      <div className="text-[#1ab0b3] text-[18px] ">{exp.company}</div>
                    </div>
                    <div className="text-[#666] text-[14px] text-right">
                      <div>{exp.city}</div>
                      <div>{exp.date}</div>
                    </div>
                  </div>
                  <ul className="list-disc ml-4 text-[#444] text-[15px] space-y-1">
                    {exp.responsibilities?.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

           {/* Skills Section */}
           <div className="mb-[8px] mt-[15px]">
            <h2 className="text-[20px] font-semibold text-[#384347] uppercase mb-3 border-b border-[#bdbdbd] pb-1">
              Skills
            </h2>
            <div className="text-[15px] text-[#444]">
              {skills?.map((category, index) => (
                <div key={index} className="mb-2">
                  <span className="font-semibold text-[16px]">{category.name}:</span>{' '}
                  <span>{category.skills.join('- ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-[8px] mt-[15px]">
            <h2 className="text-[20px] font-semibold text-[#384347] uppercase mb-3 border-b border-[#bdbdbd] pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {education?.map((edu, index) => (
                <div key={index} className="text-[13px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-[18px] text-[#384347] whitespace-nowrap">{edu.degree}</h3>
                      <div className="text-[#1ab0b3] text-[18px]">{edu.institution}</div>
                    </div>
                    <div className="text-[#666] text-[14px] text-right">
                      <div>{edu.city}</div>
                      <div>{edu.date}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Sidebar - Teal colored */}
        <div className="w-[250px] bg-[#106166] text-white pl-[34px] pr-[44px] py-[44px] border-t-[20px] border-[#10484d]">
            <div className='flex items-center justify-center mb-[26px]'>
        <div className="w-[115px] h-[115px]">
                  <ProfileImage src={profileImage} variant="square"/>
                </div>
                </div>
          {/* Key Achievements Section */}
          <div className="mb-[8px]">
            <h2 className="text-[16px] font-normal uppercase leading-[19px] text-white border-b border-white pb-[8px]">
              Key Achievements
            </h2>
            <div className="py-[6px]">
              {achievements?.map((achievement, index) => (
                <div key={index} className="">
                  <div className="flex items-center flex-cols gap-2">
                    {/* <span className="mt-1">✓</span> */}
                    <div className="flex gap-2">
                      <div className="pb-[24px]">
                      <h3 className="font-medium text-[15px] text-white mb-[3px]">{achievement.title}</h3>
                      <p className=" leading-15px text-[12px] mt-[2px]">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Section */}
          <div className="mb-[8px] mt-[15px]">
            <h2 className="text-[20px] font-bold uppercase mb-3 text-white text-[##1ab0b3] border-b border-white pb-1">
              Certification
            </h2>
            <div className="space-y-3">
              {projects?.map((cert, index) => (
                <div key={index} className="text-[13px]">
                  <h3 className="font-semibold text-[16px] mb-1 text-white">{cert.title}</h3>
                  <p className="text-[14px] leading-snug">{cert.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Passions Section */}
          <div className="mb-[8px] mt-[15px]">
            <h2 className="text-[20px] font-bold uppercase mb-3 text-[##1ab0b3] text-white border-b border-white pb-1">
              Passions
            </h2>
            <div className="space-y-3">
              {passion?.map((item, index) => (
                <div key={index} className="text-[13px]">
                  <div className="flex items-start gap-2">
                    <span className="mt-1">⚡</span>
                    <div>
                      <h3 className="font-semibold text-[16px] mb-1 text-white">{item.title}</h3>
                      <p className="text-[14px] leading-snug">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Languages Section */}
          <div className="mb-[8px] mt-[15px]">
            <h2 className="text-[20px] font-bold uppercase mb-3 text-white border-b border-white pb-1">
              Languages
            </h2>
            <div className="space-y-2">
              {languages?.map((lang, index) => (
                <div key={index} className="text-[14px] flex justify-between">
                  <span>{lang.name}</span>
                  <span className="opacity-90">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
         {/* Favorite Quote Section */}
         <div className="mt-[15px] mb-[8px]">
            <h2 className="text-[20px] font-bold uppercase mb-3 text-white border-b border-white pb-1">
              Favorite Quote
            </h2>
            <div className="text-[16px] ">
              "Quality means doing it right when no one is looking."
              <div className="mt-1 text-[14px]">- Henry Ford</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate; 