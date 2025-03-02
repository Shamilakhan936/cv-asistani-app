import React from 'react';
import { CVData } from '@/types/cv';

interface PamukkaleTemplateProps {
  data: CVData;
}

const PamukkaleTemplate: React.FC<PamukkaleTemplateProps> = ({ data }) => {
  return (
    <div className="max-w-[210mm] mx-auto bg-white p-[30px] font-['Arial']">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-[28px] font-bold text-black tracking-wide mb-1">{data.personal.fullName}</h1>
        <p className="text-[16px] text-gray-600 mb-1">{data.personal.title}</p>
        <div className="text-[13px] text-gray-600">
          {data.personal.email} 
          {data.personal.phone && (
            <><span className="mx-2">•</span>{data.personal.phone}</>
          )}
          {data.personal.location && (
            <><span className="mx-2">•</span>{data.personal.location}</>
          )}
          {data.personal.website && (
            <>
              <span className="mx-2">•</span>
              <a 
                href={data.personal.website.startsWith('http') ? data.personal.website : `https://${data.personal.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {data.personal.website}
              </a>
            </>
          )}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3 text-center">HAKKIMDA</h2>
        <div className="overflow-hidden">
          <p className="text-[13px] text-gray-700 leading-[1.6] break-words whitespace-pre-wrap">
            {data.summary}
          </p>
        </div>
      </section>

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3 text-center">DENEYİM</h2>
        {data.experience
          .filter(exp => !(exp.title === "Senior Business Analyst" && exp.company === "Genentech" && exp.location === "South San Francisco, CA"))
          .map((exp) => (
            <div key={exp.id} className="mb-6 last:mb-0">
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <h3 className="text-[15px] font-semibold text-black">{exp.title}</h3>
                  <p className="text-[14px] text-gray-700">{exp.company} • {exp.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] text-gray-600">
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) : ''} - {exp.current ? 'Devam Ediyor' : (exp.endDate && new Date(exp.endDate).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }))}
                  </p>
                </div>
              </div>
              {Array.isArray(exp.description) && exp.description.length > 0 && (
                <ul className="mt-2 text-[13px] text-gray-700 list-disc pl-5 space-y-1">
                  {exp.description.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3 text-center">EĞİTİM</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4 last:mb-0">
            <div className="flex justify-between items-baseline mb-1">
              <div>
                <h3 className="text-[15px] font-semibold text-black">{edu.school}</h3>
                <p className="text-[14px] text-gray-700">{edu.degree}</p>
              </div>
              <div className="text-right">
                <p className="text-[13px] text-gray-600">{edu.location}</p>
                <p className="text-[13px] text-gray-600">{edu.startDate} - {edu.endDate}</p>
              </div>
            </div>
            {edu.description && (
              <p className="text-[13px] text-gray-700">{edu.description}</p>
            )}
          </div>
        ))}
      </section>

      {/* Key Achievements */}
      <section className="mb-8">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3 text-center">BAŞARILAR</h2>
        <div className="grid grid-cols-3 gap-6">
          {data.achievements.map((achievement) => (
            <div key={achievement.id} className="text-[13px]">
              <h3 className="font-semibold text-black mb-1">{achievement.title}</h3>
              <p className="text-gray-700">{achievement.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-8">
        <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3 text-center">BECERİLER</h2>
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
        <section className="mb-8">
          <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3 text-center">DİLLER</h2>
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
        <section className="mb-8">
          <h2 className="text-[20px] font-semibold text-black border-b border-gray-300 pb-1 mb-3 text-center">SERTİFİKALAR</h2>
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
      <footer className="flex justify-between items-center text-[12px] text-gray-500 mt-12">
      </footer>
    </div>
  );
};

export default PamukkaleTemplate;