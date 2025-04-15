"use client";

import { FC } from "react";
import { ResumeData, HeaderData } from "../../types/datatypes";
import { FaEnvelope, FaGithub, FaMapMarkerAlt } from "react-icons/fa";

import { IoDiamondOutline } from "react-icons/io5";
import ProfileImage from "../ProfileImage";

interface TemplateProps extends Omit<ResumeData, "header"> {
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
  profileImage,
}) => {
  return (
    <div className="bg-white w-full ">
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 py-[44px] pl-[44px] pr-[24px]">
          <div className=" text-[13px] mb-[32px]">
            <div className="mt-[20px]">
              <h1 className="text-[28px] leading-[33px] pb-[2px] uppercase font-medium text-[#3e3e3e]">
                {header.name}
              </h1>
            </div>
            <div>
              <h2 className="text-[16px] leading-[19px] text-[#1ab0b3] font-normal">
                {header.title}
              </h2>
            </div>
            <div className="flex items-center justify-between text-[12px] leading-[15px] gap-[8px]">
              <div className="flex items-center gap-[4px]">
                <FaEnvelope className="text-[#3e3e3e] shrink-0" />
                {header.email}
              </div>
              {/* <div>{header.phone}</div> */}
              <div className="flex items-center gap-[4px]">
                <FaMapMarkerAlt className="text-[#3e3e3e] text-[13px] shrink-0" />
                {header.location}
              </div>
              {header.github && (
                <div className="flex items-center gap-[4px]">
                  <FaGithub className="text-[#3e3e3e] shrink-0" />
                  {header.github}
                </div>
              )}
            </div>
          </div>
          {/* Summary Section */}
          <div className="mb-[8px]">
            <h2 className="text-[16px] leading-[19px] font-normal text-[#3e3e3e] uppercase mb-[6px] border-b border-[#bdbdbd] pb-[8px]">
              Summary
            </h2>
            <p className="text-[12px] leading-[15px] text-[#3e3e3e] font-normal">
              {header.summary}
            </p>
          </div>

          {/* Experience Section */}
          <div className="mb-[8px] mt-[15px]">
            <h2 className="text-[16px] font-normal leading-[19px] text-[#384347] uppercase border-b mb-[6px] border-[#bdbdbd] pb-[8px]">
              Experience
            </h2>
            <div className="space-y-6">
              {experience?.map((exp, index) => (
                <div key={index} className="text-[13px]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-normal text-[15px] leading-[18px] text-[#384347] whitespace-nowrap">
                        {exp.position}
                      </h3>
                      <div className="text-[#1ab0b3] leading-[17px] mt-[6px] text-[14px]">
                        {exp.company}
                      </div>
                    </div>
                    <div className="text-[#384347] leading-[15px] text-[12px] text-right">
                      <div>{exp.city}</div>
                      <div>{exp.date}</div>
                    </div>
                  </div>
                  <ul className="list-disc ml-4 text-[#384347] text-[12px] leading-[15px] space-y-1">
                    {exp.responsibilities?.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="mb-[8px] mt-[15px]">
            <h2 className="text-[16px] font-normal leading-[19px] text-[#384347] uppercase mb-[6px] border-b border-[#bdbdbd] pb-[8px]">
              Education
            </h2>
            <div className="space-y-4">
              {education?.map((edu, index) => (
                <div key={index} className="text-[15px] leading-[18px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[15px] leading-[18px] font-normal text-[#384347] whitespace-nowrap">
                        {edu.degree}
                      </h3>
                      <div className="text-[#1ab0b3] text-[14px] leading-[17px]">
                        {edu.institution}
                      </div>
                    </div>
                    <div className="text-[#384347] text-[12px] leading-[15px] text-right">
                      <div>{edu.date}</div>
                      <div>{edu.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Left Sidebar - Teal colored */}
        <div className="w-[250px] bg-[#106166] text-white pl-[34px] pr-[44px] py-[44px] border-t-[20px] border-[#10484d]">
          <div className="flex items-center justify-center mb-[26px]">
            <div className="w-[115px] h-[115px]">
              <ProfileImage src={profileImage} variant="square" />
            </div>
          </div>
          {/* Key Achievements Section */}
          <div className="">
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
                        <h3 className="font-medium text-[15px] text-white mb-[3px]">
                          {achievement.title}
                        </h3>
                        <p className=" leading-15px text-[12px] mt-[2px]">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Skills Section */}
          <div className="mb-[24px]">
            <h2 className="text-[16px] font-normal leading-[19px] text-[white] uppercase mb-[6px] border-b border-[#bdbdbd] pb-[8px]">
              Skills
            </h2>
            <div className="text-[15px] text-[white]">
              {skills?.map((category, index) => (
                <div key={index} className="mb-2">
                  <span className="font-normal leading-[18px] text-[15px]">
                    {category.name}:
                  </span>{" "}
                  <span className="text-[12px]">
                    {category.skills.join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Section */}
          <div className="mb-[8px]">
            <h2 className="text-[16px] font-normal uppercase leading-[19px] text-white text-[##1ab0b3] border-b border-white pb-[8px]">
              Certification
            </h2>
            <div className="py-[6px]">
              {projects?.map((cert, index) => (
                <div key={index} className=" pb-[24px]">
                  <h3 className="font-medium text-[15px] text-white mb-[3px]">
                    {cert.title}
                  </h3>
                  <p className=" leading-15px text-[12px] mt-[2px]">
                    {cert.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Languages Section */}
          {/* <div className="mb-[8px] mt-[15px]">
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
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
