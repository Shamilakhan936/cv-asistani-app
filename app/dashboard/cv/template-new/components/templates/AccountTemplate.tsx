"use client"

import type { FC } from "react"
import { ResumeData, HeaderData } from "../../types/datatypes";
import { FaStar } from "react-icons/fa"

interface TemplateProps extends Omit<ResumeData, "header"> {
  header: HeaderData
  profileImage: string
}

const AccountTemplate: FC<TemplateProps> = ({
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
      <div className="bg-teal-500 text-white">
        <div className="max-w-[1100px] mx-auto px-8 py-6">
          <h1 className="text-3xl font-bold text-white uppercase mb-1">{header.name}</h1>
          <h2 className="text-xl text-white mb-2">
            {header.title} {header.role && <span className="mx-2">|</span>} {header.role}
          </h2>
          <div className="text-sm flex items-center gap-6">
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
            <section className="mb-8">
              <h2 className="text-lg font-semibold uppercase text-[#323232] pb-1 border-b-2 border-teal-500 mb-3">
                Summary
              </h2>
              <p className="text-sm leading-relaxed text-[#323232] mt-4">{header.summary}</p>
            </section>
          )}

          {/* Experience Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold uppercase text-[#323232] pb-1 border-b-2 border-teal-500 mb-3">
              Experience
            </h2>
            <div className="space-y-6 mt-4">
              {experience.map((exp, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-base text-[#323232]">{exp.position}</h3>
                      <div className="text-teal-600">{exp.company}</div>
                    </div>
                    <div className="text-[#323232] text-right">
                      <div>{exp.city}</div>
                      <div>{exp.date}</div>
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
          <section className="mb-8">
            <h2 className="text-lg font-semibold uppercase text-slate-800 pb-1 border-b-2 border-teal-500 mb-3">
              Education
            </h2>
            <div className="space-y-4 mt-4">
              {education.map((edu, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base text-slate-800">{edu.degree}</h3>
                      <div className="text-teal-600">{edu.institution}</div>
                    </div>
                    <div className="text-slate-600 text-right">
                      <div>{edu.city}</div>
                      <div>{edu.date}</div>
                    </div>
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
            <h2 className="text-lg font-semibold uppercase text-slate-800 pb-1 border-b-2 border-teal-500 mb-3">
              Key Achievements
            </h2>
            <div className="space-y-4 mt-4">
              {achievements?.map((achievement, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3">
                    <FaStar className="text-teal-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{achievement.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-600 mt-1">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section>
            <h2 className="text-lg font-semibold uppercase text-slate-800 pb-1 border-b-2 border-teal-500 mb-3">
              Skills
            </h2>
            <div className="space-y-4 mt-4">
              {skills?.map((category, index) => (
                <div key={index}>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="inline-flex px-2.5 py-1 bg-white text-teal-600 text-xs font-medium rounded-md border border-teal-100"
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
            <h2 className="text-lg font-semibold uppercase text-slate-800 pb-1 border-b-2 border-teal-500 mb-3">
              Certification
            </h2>
            <div className="space-y-4 mt-4">
              {certifications?.map((cert, index) => (
                <div key={index}>
                  <h3 className="text-sm font-semibold text-teal-600">{cert.title}</h3>
                  <p className="text-xs leading-relaxed text-slate-600 mt-1">{cert.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default AccountTemplate
