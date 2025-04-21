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

const StylishTemplate: FC<TemplateProps> = ({
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
          <div className=" text-white p-6 flex items-center flex-row-reverse justify-between">
            <div className="mr-6">
              <div className="w-[100px] h-[100px]">
                <ProfileImage src={profileImage} />
              </div>
            </div>
            <div>
              <h1 className="text-[38px] font-bold text-black">{header.name}</h1>
              <h2 className="text-[20px] text-black mb-[8px] font-medium whitespace-nowrap  ">
                {header.title} <span className="text-[19px] mb-[4px] font-medium text-black">|</span> {header.title}
              </h2>
              <div className="text-[14px] flex flex-wrap gap-x-[20px] gap-y-[5px]  font-medium  text-black">
                <div>{header.phone}</div>
                <div>{header.email}</div>
                {header.github && <div>{header.github}</div>}
                <div>{header.location}</div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex p-6 pt-0 gap-6">
            {/* Left column - 60% */}
            <div className="w-[40%]">
            <div className="mb-4">
                <h2 className="text-[18px] text-[#65696d] uppercase font-medium border-b-[3px]  border-[#65696d80] mb-2">
                  Skills
                </h2>
                <SkillsMain data={skills} textSize={{ small: 'text-[14px]' }} />

              </div>
              <div className="section mt-4" data-section="projects">
                 <h2 className="text-[18px] text-[#65696d] uppercase font-medium border-b-[3px]  border-[#65696d80] mb-2">
                 PROJECTS
                 </h2>
                 <Projects
  data={projects}
  color={{ title: 'text-black', description: 'text-gray-600' }}
  textSize={{ title: 'text-[18px]', description: 'text-[14px]' }}
/>


                  </div>
                  <div className="mb-4">
                <h2 className="text-[18px] text-[#65696d] uppercase font-medium border-b-[3px]  border-[#65696d80] mb-2 ">Key Achievements</h2>
                <AchievementsNew
  data={achievements}
  border={false}
  textStyle={{
    title: {
      fontSize: '18px',
      color: 'black',
    },
    description: {
      fontSize: '14px',
      color: '#3e3e3e',
    },
  }}
/>


              </div>
              <div className="mb-4">
                <h2 className="text-[18px] text-[#65696d] uppercase font-medium border-b-[3px]  border-[#65696d80] mb-2">certifications</h2>
                <CertificationMain
  data={certifications}
  textStyle={{
    title: {
      fontSize: '18px',
      color: 'black',
    },
    description: {
      fontSize: '14px',
      color: '#3e3e3e',
    },
  }}
/>
              </div>
              <h2 className="text-[18px] text-[#65696d] uppercase font-medium border-b-[3px]  border-[#65696d80] mb-2">Languages</h2>
              <div className="mt-4" data-section="languages">
                <Languages data={languages} />
              </div>
            </div>

            {/* Right column - 40% */}
            <div className="w-[60%]">
              <div className="mb-4">
                <h2 className="text-[18px] text-[#65696d] uppercase font-medium border-b-[3px]  border-[#65696d80] mb-2">Summary</h2>
                <SummaryNew title="" description={header.summary || ""} />
              </div>

              <div className="mb-4">
                <h2 className="text-[18px] text-[#65696d] uppercase font-medium border-b-[3px]  border-[#65696d80] mb-2">Experience</h2>
                <Experience
  data={experience}
  border={false}
  layout="separate"
  textStyle={{
    role: {
      fontSize: '20px',
      color: 'black',
    },
    company: {
      fontSize: '16px',
      color: '#1e90ff',
    },
    date: {
      fontSize: '13px',
      color: '#60696c',
    },
    location: {
      fontSize: '13x',
      color: '#60696c',
    },
    responsibilities: {
      fontSize: '14px',
      color: 'black',
    },
  }}
/>

              </div>
              <div className="mb-4">
                <h2 className="text-[18px] text-[#65696d] uppercase font-medium border-b-[3px]  border-[#65696d80] mb-2">Education</h2>
                <Education
  data={education}
  layout="separate"
  border={false}
  textStyle={{
    degree: {
      fontSize: "18px",
      color: "black",
    },
    institution: {
      fontSize: "16px",
      color: "#1e90ff",
    },
    date: {
      fontSize: "13px",
      color: "#60696c",
    },
    city: {
      fontSize: "13px",
      color: "#60696c",
    },
  }}
/>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StylishTemplate;
