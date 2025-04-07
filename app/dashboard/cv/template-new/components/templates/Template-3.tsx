"use client";

import { FC } from "react";
import { ResumeData, HeaderData } from "../../types/datatypes";
import Header from "../Header";
import SummaryNew from "../../parentComponents/SummaryMain";
import Experience from "../../parentComponents/ExperiencesMain";
import Education from "../../parentComponents/EducationMain";
import Languages from "../Languages";
import Skills from "../Skills";
import AchievementsNew from "../../parentComponents/AchievementsNew";
import ProfileImage from "../ProfileImage";
import Projects from "../Projects";
import PassionMain from "../../parentComponents/PassionsMain";
import CoursesMain from "../../parentComponents/CoursesMain";
import CertificationMain from "../../parentComponents/CertificationMain"; 
import SkillsMain from "../../parentComponents/SkillsMain"; 


interface TemplateProps extends Omit<ResumeData, "header"> {
  header: HeaderData;
  profileImage: string;
}

const Template3: FC<TemplateProps> = ({
  header,
  experience,
  education,
  languages,
  skills,
  achievements,
  projects,
  passion,
  profileImage,
  certifications,
}) => {
  return (
    <div className="bg-white w-full h-full rounded-[30px]">
      <div className="resume-container w-[210mm] h-[297mm]">
        <div className="bg-white w-[210mm] h-[297mm] relative">
          {/* Header with image and contact info */}
          <div className="bg-[#] text-white p-8 flex items-center flex-row-reverse justify-between">
            <div className="mr-6">
              <div className="w-[100px] h-[100px]">
                <ProfileImage src={profileImage} />
              </div>
            </div>
            <div>
              <h1 className="text-[38px] font-bold text-[#343334]">{header.name}</h1>
              <h2 className="text-[20px] text-[#00b6cb] mb-[8px] font-medium whitespace-nowrap  ">
                {header.title} <span className="text-[19px] mx-[4px] text-black">|</span> {header.title}
              </h2>
              <div className="text-[14px] flex flex-wrap gap-[30px] text-black">
                <div>{header.phone}</div>
                <div>{header.email}</div>
                {header.github && <div>{header.github}</div>}
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex p-8 pt-0 gap-6">
            {/* Left column - 60% */}
            <div className="w-[60%]">
              <div className="mb-6">
                <h2 className="text-[#65696d] text-[22px] font-semibold uppercase border-b-[2px] border-[#65696d80]  mb-[8px]">Experience</h2>
                <Experience data={experience} border={false} layout="separate" />
              </div>

              <div className="mb-6">
                <h2 className="text-[#65696d] text-[22px] font-semibold uppercase border-b-[2px] border-[#65696d80]  mb-[8px]">Education</h2>
                <Education data={education} border={false}  />
              </div>

              <div className="mt-4" data-section="languages">
              

                <Languages data={languages} />
              </div>
            </div>

            {/* Right column - 40% */}
            <div className="w-[40%]">
              <div className="mb-6">
                <h2 className="text-[#65696d] text-[22px] font-semibold uppercase border-b-[2px] border-[#65696d80]  mb-[8px]">Summary</h2>
                <SummaryNew title="" description={header.summary || ""} />
              </div>

              <div className="mb-6">
                <h2 className="text-[#65696d] text-[22px] font-semibold uppercase border-b-[2px] border-[#65696d80] ">Key Achievements</h2>
                <AchievementsNew data={achievements} border={false} />
              </div>

              <div className="mb-6">
                <h2 className="text-[#65696d] text-[22px] font-semibold uppercase border-b-[2px] border-[#65696d80]  mb-[8px]">
                  Skills
                </h2>
                <SkillsMain data={skills} />
              </div>

              <div className="mb-6">
                <h2 className="text-[#65696d] text-[22px] font-semibold uppercase border-b-[2px] border-[#65696d80]  mb-[8px]">certifications</h2>
                <CertificationMain data={certifications} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template3;
