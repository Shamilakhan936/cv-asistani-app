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

const DoubleColumn: FC<TemplateProps> = ({
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
          <div className=" text-white p-6  flex-row-reverse justify-between">
            <div>
              <h1 className="text-[34px] font-bold text-[#002b7f] uppercase">{header.name}</h1>
              <h2 className="text-[20px] text-[#56acf2] capitalize  font-medium whitespace-nowrap  ">
                {header.title} <span className="text-[19px] mb-[4px] font-medium text-[#56acf2]">|</span> {header.title}
              </h2>
              <div className="text-[14px] flex flex-wrap justify-between gap-x-[20px] gap-y-[5px]  font-medium  text-black">
                {/* <div>{header.phone}</div> */}
                <div>{header.email}</div>
                {header.github && <div>{header.github}</div>}
                <div>{header.location}</div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex p-6 pt-0 gap-6">
            {/* Left column - 60% */}
            <div className="w-[60%]">
            <div className="mb-4">
                <h2 className="text-[18px] text-[#002b7f] uppercase font-semibold border-b-[3px]  border-[#002b7f] mb-2">Summary</h2>
                <SummaryNew title="" description={header.summary || ""} />
              </div>
              <div className="mb-4">
                <h2 className="text-[18px] text-[#002b7f] uppercase font-semibold border-b-[3px]  border-[#002b7f] mb-2">Experience</h2>
                <Experience
  data={experience}
  border={false}
  layout="single"
  textStyle={{
    role: {
      fontSize: '18px',
      color: '#002b7f',
    },
    company: {
      fontSize: '15px',
      color: '#56acf2',
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
                <h2 className="text-[18px] text-[#002b7f] uppercase font-semibold border-b-[3px]  border-[#002b7f] mb-2">Education</h2>
                <Education
  data={education}
  layout="single"
  border={false}
  textStyle={{
    degree: {
      fontSize: "18px",
      color: "#002b7f",
    },
    institution: {
      fontSize: "15px",
      color: "##56acf2",
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
              <div className="text-[18px] text-[#002b7f] uppercase font-semibold border-b-[3px]  border-[#002b7f] mb-2">Languages</div>
              <div className="mt-4" data-section="languages">
                <Languages data={languages} />
              </div>

            
             
               
              
              
            </div>

            {/* Right column - 40% */}
            <div className="w-[40%]">
            <div className="section " data-section="projects">
                 <h2 className="text-[18px] text-[#002b7f] uppercase font-semibold border-b-[3px]  border-[#002b7f] mb-2">
                 PROJECTS
                 </h2>
                 <Projects
  data={projects}
  color={{ title: 'text-[#002b7f]', description: 'text-black' }}
  textSize={{ title: 'text-[18px]', description: 'text-[15px]' }}
/>


                  </div>
                  <div className="mb-4">
                <h2 className="text-[18px] text-[#002b7f] uppercase font-semibold border-b-[3px]  border-[#002b7f] mb-2">
                  Skills
                </h2>
                <SkillsMain data={skills} textSize={{ small: 'text-[16px]' }} />

              </div>
              <div className="mb-4">
                <h2 className="text-[18px] text-[#002b7f] uppercase font-semibold border-b-[3px]  border-[#002b7f] mb-2">certifications</h2>
                <CertificationMain
  data={certifications}
  textStyle={{
    title: {
      fontSize: '18px',
      color: '#002b7f',
    },
    description: {
      fontSize: '15px',
      color: '#3e3e3e',
    },
  }}
/>
              </div>
              <div className="mb-4">
                <h2 className="text-[18px] text-[#002b7f] uppercase font-semibold border-b-[3px]  border-[#002b7f] mb-2 ">Key Achievements</h2>
                <AchievementsNew
  data={achievements}
  border={false}
  textStyle={{
    title: {
      fontSize: '18px',
      color: '#002b7f',
    },
    description: {
      fontSize: '15px',
      color: '#3e3e3e',
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

export default DoubleColumn;
