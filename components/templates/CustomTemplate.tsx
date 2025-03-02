import React from 'react';
import { CVData } from '@/types/cv';

interface CustomTemplateProps {
  data: CVData;
}

const CustomTemplate: React.FC<CustomTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-[210mm] mx-auto bg-white p-[30px] font-['Arial'] break-words">
      {/* Header */}
      <header className="text-center mb-8 break-inside-avoid">
        <h1 className="text-[28px] font-bold text-black tracking-wide mb-1">{data.personal.fullName}</h1>
        <p className="text-[15px] text-gray-600 mb-1">{data.personal.title}</p>
        <div className="text-[13px] text-gray-600">
          {data.personal.email} <span className="mx-2">•</span> 
          {data.personal.website} <span className="mx-2">•</span> 
          {data.personal.location}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3">Summary</h2>
        <p className="text-[13px] text-gray-700 leading-[1.6]">
          {data.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-8 break-inside-avoid-page">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3">Experience</h2>
        {data.experience.map((exp) => (
          <div key={exp.id} className="mb-6 last:mb-0">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="text-[15px] font-semibold text-black">{exp.company}</h3>
                <p className="text-[14px] text-gray-700">{exp.title}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-[13px] text-gray-600">{exp.location}</p>
                <p className="text-[13px] text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
              </div>
            </div>
            {exp.description && (
              <ul className="mt-2 text-[13px] text-gray-700 list-disc pl-5 space-y-1">
                {typeof exp.description === 'string' ? (
                  <li>{exp.description}</li>
                ) : (
                  exp.description.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))
                )}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* Education */}
      <section className="mb-8 break-inside-avoid-page">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3">Education</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4 last:mb-0">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="text-[15px] font-semibold text-black">{edu.school}</h3>
                <p className="text-[14px] text-gray-700">{edu.degree}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <p className="text-[13px] text-gray-600">{edu.location}</p>
                <p className="text-[13px] text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Key Achievements */}
      <section className="mb-8 break-inside-avoid-page">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3">Key Achievements</h2>
        <div className="grid grid-cols-3 gap-6">
          {data.achievements.map((achievement) => (
            <div key={achievement.id} className="text-[13px]">
              <h3 className="font-semibold text-black mb-2">{achievement.title}</h3>
              <p className="text-gray-700">{achievement.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-8 break-inside-avoid-page">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3">Skills</h2>
        <p className="text-[13px] text-gray-700">
          {data.skills.map((skill, index) => (
            <React.Fragment key={skill.id}>
              {skill.name}
              {index < data.skills.length - 1 && <span className="mx-2">•</span>}
            </React.Fragment>
          ))}
        </p>
      </section>

      {/* Languages */}
      {data.languages?.length > 0 && (
        <section className="mb-8 break-inside-avoid-page">
          <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3">Languages</h2>
          <div className="text-[13px] text-gray-700">
            {data.languages.map((lang, index) => (
              <React.Fragment key={lang.id}>
                <span className="font-semibold">{lang.name}</span> ({lang.level})
                {index < data.languages.length - 1 && <span className="mx-2">•</span>}
              </React.Fragment>
            ))}
          </div>
        </section>
      )}

      {/* Certification */}
      {data.certificates?.length > 0 && (
        <section className="mb-8 break-inside-avoid-page">
          <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3">Certification</h2>
          <div className="text-[13px] text-gray-700">
            {data.certificates.map((cert) => (
              <p key={cert.id} className="mb-2 last:mb-0">
                <span className="font-semibold">{cert.name}</span> — {cert.description}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="flex justify-between items-center text-[12px] text-gray-500 mt-12 break-inside-avoid">
        <a href="www.enhancv.com" className="hover:text-gray-700">www.enhancv.com</a>
        <div className="flex items-center gap-2">
          <span>Powered by</span>
          <span className="font-semibold">Enhancv</span>
        </div>
      </footer>
    </div>
  );
};

export default CustomTemplate; 