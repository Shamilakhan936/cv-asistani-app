"use client"

import type { FC } from "react"
import { ResumeData, HeaderData } from "../../types/datatypes";
import { FaStar } from "react-icons/fa"

interface TemplateProps extends Omit<ResumeData, "header"> {
  header: HeaderData
  profileImage: string
}

const ProductManagerTemplate: FC<TemplateProps> = ({
  header,
  experience,
  education,
  languages,
  skills,
  achievements,
  certifications,
  projects,
  passion,
  profileImage,
}) => {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className=" text-white">
        <div className="max-w-[1100px] mx-auto px-8 pt-6">
          <h1 className="text-[34px] font-bold  uppercase mb-1">{header.name}</h1>
          <h2 className="text-[18px] text-[#1e90ff] mb-2">
            {header.title} {header.role && <span className="mx-2">|</span>} {header.role}
          </h2>
          <div className="text-[13px] text-black flex items-center gap-6">
            {header.email && <span>{header.email}</span>}
            {header.github && <span>{header.github}</span>}
            {header.location && <span>{header.location}</span>}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row">
        {/* Main content */}
        <div className="flex-1 p-6">
          {/* Summary Section */}
          {header.summary && (
            <section className="mb-4">
              <h2 className="text-[18px] font-semibold uppercase text-black border-b-[3px] border-black ">
                Summary
              </h2>
              <p className="text-sm leading-relaxed text-[#323232] mt-2">{header.summary}</p>
            </section>
          )}

          {/* Experience Section */}
          <section className="mb-4">
            <h2 className="text-[18px] font-semibold uppercase text-black border-b-[3px] border-black">
              Experience
            </h2>
            <div className="space-y-6 mt-2">
              {experience.map((exp, index) => (
                <div key={index} className="text- border-b border-dashed pb-2 ">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-[16px] text-[#323232]">{exp.position}</h3>
                      <div className="text-[#1e90ff] text-[14px]">{exp.company}</div>
                    <div className="text-[#323232] flex gap-4">
                      <div>{exp.city}</div>
                      <div>{exp.date}</div>
                    </div>
                    </div>
                  </div>
                  <ul className="list-disc ml-5 text-[#323232] space-y-1 mt-2">
                    {exp.responsibilities?.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className="mb-4">
            <h2 className="text-[18px] font-semibold uppercase text-black border-b-[3px] border-black">
              Education
            </h2>
            <div className="space-y-4 mt-2">
              {education.map((edu, index) => (
                <div key={index} className="border-b border-dashed pb-[2px]">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-[16px]">{edu.degree}</h3>
                      <div className="text-[#1e90ff] text-[14px]">{edu.institution}</div>
                    </div>
                  </div>
                    <div className="text-slate-600 flex gap-4">
                      <div>{edu.city}</div>
                      <div>{edu.date}</div>
                    </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-[320px] bg-white p-6 space-y-8">
          {/* Key Achievements Section */}
          <section>
            <h2 className="text-[18px] font-semibold uppercase text-black border-b-[3px] border-black">
              Key Achievements
            </h2>
            <div className="space-y-4 mt-2">
              {achievements?.map((achievement, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3 border-b border-dashed pb-1">
                    <FaStar className="text-teal-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-[14px] font-semibold ">{achievement.title}</h3>
                      <p className="text-[12px] leading-relaxed ">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="text-[18px] font-semibold uppercase text-black border-b-[3px] border-black">
              Skills
            </h2>
            <div className="space-y-4 mt-2">
              {skills?.map((category, index) => (
                <div key={index}>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex px-2.5 py-1  text-[14px] font-medium  border-b border-black"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Certification Section */}
          <section>
            <h2 className="text-[18px] font-semibold uppercase text-black border-b-[3px] border-black">
              Certification
            </h2>
            <div className="space-y-4 mt-2">
              {certifications?.map((cert, index) => (
                <div key={index}>
                  <h3 className="text-[14px] font-semibold text-[#1e90ff]">{cert.title}</h3>
                  <p className="text-[13px] leading-relaxed border-b border-dashed">{cert.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductManagerTemplate
