'use client';
import React from "react";
import List from "./List.jsx";

// Varsayılan deneyim verileri
const defaultExperience = [
  {
    title: "Senior Project Manager - Treasury Systems",
    company: "JPMorgan Chase",
    period: "01/2018 - Present",
    location: "Columbus, OH",
    responsibilities: [
      "Oversaw the strategic implementation of an enterprise-wide Expense Management system.",
      "Managed cross-functional teams to deliver critical treasury projects.",
      "Drove process optimization using Lean Six-Sigma methodologies.",
      "Collaborated with IT and Treasury stakeholders to integrate banking systems",
      "Developed comprehensive risk management protocols that decreased project risks by 40%",
    ]
  },
  {
    title: "Treasury Systems Analyst",
    company: "Nationwide Insurance",
    period: "06/2014 - 12/2017",
    location: "Columbus, OH",
    responsibilities: [
      "Led a successful upgrade of the PeopleSoft Cash Management module",
      "Conducted in-depth business process analyses ",
      "Managed vendor relationships for the procurement of Treasury IT solutions, optimizing costs by 10%",
      "Authored project proposals for senior management, securing approvals for three high- impact projects",
      "Facilitated user acceptance testing and trainings, achieving a 95% user satisfaction rate",
    ]
  },
  {
    title: "Project Coordinator - Banking Systems",
    company: "KeyBank",
    period: "03/2010- 05/2014",
    location: "Columbus, OH",
    responsibilities: [
      "Spearheaded the analysis of banking systems that enhanced fraud detection measures by 10%",
      "Delivered monthly reports on project status, driving alignment across stakeholders ",
      "Championed necessary system changes, ensuring compliance with updated financial regulations",
    ]
  }
];

const Experience = ({ data = [] }) => {
  // Eğer data boşsa varsayılan deneyimleri kullan
  const experiences = data && data.length > 0 ? data : defaultExperience;

  return (
    <div className="mt-5">
      <h3 className="text-textColor font-rubik border-b border-grayIcon mb-1 pb-1">
        EXPERIENCE
      </h3>

      {experiences.map((exp, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <div className="flex font-rubik mt-2">
            <p className="text-textColor font-rubik text-sm">
              {exp.title}
            </p>
            <p className="ml-auto text-xs text-textColor">{exp.period}</p>
          </div>
          <div className="flex font-rubik">
            <p className="text-sm text-light mt-1 font-rubik">
              {exp.company}
            </p>
            <p className="ml-auto text-xs text-textColor">{exp.location}</p>
          </div>
          <List items={exp.responsibilities} className="font-inter text-textColor" />
        </div>
      ))}
    </div>
  );
};

export default Experience; 