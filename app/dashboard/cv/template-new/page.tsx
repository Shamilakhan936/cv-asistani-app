"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import ResumeWrapper from "./components/ResumeWrapper"
import HeaderForm from "./components/forms/HeaderForm"
import ExperienceForm from "./components/forms/ExperienceForm"
import EducationForm from "./components/forms/EducationForm"
import AboutForm from "./components/forms/AboutForm"
import TemplateSelector from "./components/TemplateSelector"
import DownloadButton from "./components/DownloadButton"
import type {
  HeaderData,
  Experience,
  Education,
  SkillCategory,
  Achievement,
  Certification,
  Language,
  Project,
  Passion,
} from "./types/datatypes"
import {
  experience as initialExperience,
  education as initialEducation,
  languages as initialLanguages,
  skills as initialSkills,
  achievements as initialAchievements,
  certifications as initialCertifications,
  projects as initialProjects,
  passion as initialPassion,
} from "./lib/data"
import { type TemplateId, TEMPLATES } from "./components/templates"

type TabType = "template" | "header" | "experience" | "education" | "skills"

const tabs: { id: TabType; label: string }[] = [
  { id: "template", label: "TEMPLATE" },
  { id: "header", label: "HEADER" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "education", label: "EDUCATION" },
  { id: "skills", label: "OTHERS" },
]

// A4 dimensions in mm
const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("template")
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>("default")
  const [profileImage, setProfileImage] = useState<string>("/images/default-avatar.jpg")
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [showTabletPreviewModal, setShowTabletPreviewModal] = useState(false)
  const resumeRef = useRef<HTMLDivElement>(null)

  // Store data for each template separately
  const [templateData, setTemplateData] = useState<
    Record<
      TemplateId,
      {
        header: HeaderData
        experience: Experience[]
        education: Education[]
        languages: Language[]
        skills: SkillCategory[]
        achievements: Achievement[]
        certifications: Certification[]
        projects: Project[]
        passion: Passion[]
      }
    >
  >({
    default: {
      header: {
        name: "Johnathan Alexander Doe",
        title: "Senior Full Stack Developer",
        role: "Senior Full Stack Developer",
        phone: "+1 800 555 1234",
        email: "john.doe@example.com",
        github: "https://github.com/john-doe",
        location: "San Francisco, CA, USA",
        summary:
          "Experienced Full Stack Developer with a proven track record in developing scalable web applications and leading development teams. Proficient in modern web technologies and best practices.",
        image: "",
      },
      experience: initialExperience,
      education: initialEducation,
      languages: initialLanguages,
      skills: initialSkills.map((category) => ({
        ...category,
        name:
          category.id === 1
            ? "Backend & DevOps"
            : category.id === 2
              ? "Frontend & JavaScript"
              : category.id === 3
                ? "Databases"
                : category.id === 5
                  ? "Mobile Development"
                  : "Other",
      })),
      achievements: initialAchievements,
      certifications: initialCertifications,
      projects: initialProjects,
      passion: initialPassion,
    },
    modern: {
      header: {
        name: "Johnathan Alexander Doe",
        title: "Senior Full Stack Developer",
        role: "Senior Full Stack Developer",
        phone: "+1 800 555 1234",
        email: "john.doe@example.com",
        github: "https://github.com/john-doe",
        location: "San Francisco, CA, USA",
        summary:
          "Experienced Full Stack Developer with a proven track record in developing scalable web applications and leading development teams. Proficient in modern web technologies and best practices.",
        image: "",
      },
      experience: initialExperience,
      education: initialEducation,
      languages: initialLanguages,
      skills: initialSkills.map((category) => ({
        ...category,
        name:
          category.id === 1
            ? "Backend & DevOps"
            : category.id === 2
              ? "Frontend & JavaScript"
              : category.id === 3
                ? "Databases"
                : category.id === 5
                  ? "Mobile Development"
                  : "Other",
      })),
      achievements: initialAchievements,
      certifications: initialCertifications,
      projects: initialProjects,
      passion: initialPassion,
    },
    template3: {
      header: {
        name: "Johnathan Alexander Doe",
        title: "Senior Full Stack Developer",
        role: "Senior Full Stack Developer",
        phone: "+1 800 555 1234",
        email: "john.doe@example.com",
        github: "https://github.com/john-doe",
        location: "San Francisco, CA, USA",
        summary:
          "Experienced Full Stack Developer with a proven track record in developing scalable web applications and leading development teams. Proficient in modern web technologies and best practices.",
        image: "",
      },
      experience: initialExperience,
      education: initialEducation,
      languages: initialLanguages,
      skills: initialSkills.map((category) => ({
        ...category,
        name:
          category.id === 1
            ? "Backend & DevOps"
            : category.id === 2
              ? "Frontend & JavaScript"
              : category.id === 3
                ? "Databases"
                : category.id === 5
                  ? "Mobile Development"
                  : "Other",
      })),
      achievements: initialAchievements,
      certifications: initialCertifications,
      projects: initialProjects,
      passion: initialPassion,
    },
    minimal: {
      header: {
        name: "Johnathan Alexander Doe",
        title: "Senior Full Stack Developer",
        role: "Senior Full Stack Developer",
        phone: "+1 800 555 1234",
        email: "john.doe@example.com",
        github: "https://github.com/john-doe",
        location: "San Francisco, CA, USA",
        summary:
          "Experienced Full Stack Developer with a proven track record in developing scalable web applications and leading development teams. Proficient in modern web technologies and best practices.",
        image: "",
      },
      experience: initialExperience,
      education: initialEducation,
      languages: initialLanguages,
      skills: initialSkills.map((category) => ({
        ...category,
        name:
          category.id === 1
            ? "Backend & DevOps"
            : category.id === 2
              ? "Frontend & JavaScript"
              : category.id === 3
                ? "Databases"
                : category.id === 5
                  ? "Mobile Development"
                  : "Other",
      })),
      achievements: initialAchievements,
      certifications: initialCertifications,
      projects: initialProjects,
      passion: initialPassion,
    },
    professional: {
      header: {
        name: "Johnathan Alexander Doe",
        title: "Senior Full Stack Developer",
        role: "Senior Full Stack Developer",
        phone: "+1 800 555 1234",
        email: "john.doe@example.com",
        github: "https://github.com/john-doe",
        location: "San Francisco, CA, USA",
        summary:
          "Experienced Full Stack Developer with a proven track record in developing scalable web applications and leading development teams. Proficient in modern web technologies and best practices.",
        image: "",
      },
      experience: initialExperience,
      education: initialEducation,
      languages: initialLanguages,
      skills: initialSkills.map((category) => ({
        ...category,
        name:
          category.id === 1
            ? "Backend & DevOps"
            : category.id === 2
              ? "Frontend & JavaScript"
              : category.id === 3
                ? "Databases"
                : category.id === 5
                  ? "Mobile Development"
                  : "Other",
      })),
      achievements: initialAchievements,
      certifications: initialCertifications,
      projects: initialProjects,
      passion: initialPassion,
    },
    classic: {
      header: {
        name: "Johnathan Alexander Doe",
        title: "Senior Full Stack Developer",
        role: "Senior Full Stack Developer",
        phone: "+1 800 555 1234",
        email: "john.doe@example.com",
        github: "https://github.com/john-doe",
        location: "San Francisco, CA, USA",
        summary:
          "Experienced Full Stack Developer with a proven track record in developing scalable web applications and leading development teams. Proficient in modern web technologies and best practices.",
        image: "",
      },
      experience: initialExperience,
      education: initialEducation,
      languages: initialLanguages,
      skills: initialSkills.map((category) => ({
        ...category,
        name:
          category.id === 1
            ? "Backend & DevOps"
            : category.id === 2
              ? "Frontend & JavaScript"
              : category.id === 3
                ? "Databases"
                : category.id === 5
                  ? "Mobile Development"
                  : "Other",
      })),
      achievements: initialAchievements,
      certifications: initialCertifications,
      projects: initialProjects,
      passion: initialPassion,
    },
    singleColumn: {
      header: {
        name: "Johnathan Alexander Doe",
        title: "Senior Full Stack Developer",
        role: "Senior Full Stack Developer",
        phone: "+1 800 555 1234",
        email: "john.doe@example.com",
        github: "https://github.com/john-doe",
        location: "San Francisco, CA, USA",
        summary:
          "Experienced Full Stack Developer with a proven track record in developing scalable web applications and leading development teams. Proficient in modern web technologies and best practices.",
        image: "",
      },
      experience: initialExperience,
      education: initialEducation,
      languages: initialLanguages,
      skills: initialSkills.map((category) => ({
        ...category,
        name:
          category.id === 1
            ? "Backend & DevOps"
            : category.id === 2
              ? "Frontend & JavaScript"
              : category.id === 3
                ? "Databases"
                : category.id === 5
                  ? "Mobile Development"
                  : "Other",
      })),
      achievements: initialAchievements,
      certifications: initialCertifications,
      projects: initialProjects,
      passion: initialPassion,
    },
    software: {
      header: {
        name: "Johnathan Alexander Doe",
        title: "Senior Full Stack Developer",
        role: "Senior Full Stack Developer",
        phone: "+1 800 555 1234",
        email: "john.doe@example.com",
        github: "https://github.com/john-doe",
        location: "San Francisco, CA, USA",
        summary:
          "Experienced Full Stack Developer with a proven track record in developing scalable web applications and leading development teams. Proficient in modern web technologies and best practices.",
        image: "",
      },
      experience: initialExperience,
      education: initialEducation,
      languages: initialLanguages,
      skills: initialSkills.map((category) => ({
        ...category,
        name:
          category.id === 1
            ? "Backend & DevOps"
            : category.id === 2
              ? "Frontend & JavaScript"
              : category.id === 3
                ? "Databases"
                : category.id === 5
                  ? "Mobile Development"
                  : "Other",
      })),
      achievements: initialAchievements,
      certifications: initialCertifications,
      projects: initialProjects,
      passion: initialPassion,
    },
  })

  // Get current template data
  const currentTemplateData = templateData[selectedTemplateId]
  console.log("currentTemplateData one", currentTemplateData)

  // Load data from localStorage if available
  useEffect(() => {
    // Load projects for each template
    Object.keys(templateData).forEach((templateId) => {
      const savedProjects = localStorage.getItem(`resumeProjects_${templateId}`)
      if (savedProjects) {
        try {
          const parsedProjects = JSON.parse(savedProjects)
          setTemplateData((prev) => ({
            ...prev,
            [templateId]: {
              ...prev[templateId as TemplateId],
              projects: parsedProjects,
            },
          }))
        } catch (e) {
          console.error("Error parsing saved projects:", e)
        }
      }
    })
  }, [])

  const handleHeaderChange = (data: HeaderData) => {
    setTemplateData((prev) => ({
      ...prev,
      [selectedTemplateId]: {
        ...prev[selectedTemplateId],
        header: data,
      },
    }))
  }

  const handleProfileImageChange = (image: string) => {
    setProfileImage(image)
  }

  const handleExperienceChange = (data: Experience[]) => {
    setTemplateData((prev) => ({
      ...prev,
      [selectedTemplateId]: {
        ...prev[selectedTemplateId],
        experience: data,
      },
    }))
  }

  const handleEducationChange = (data: Education[]) => {
    setTemplateData((prev) => ({
      ...prev,
      [selectedTemplateId]: {
        ...prev[selectedTemplateId],
        education: data,
      },
    }))
  }

  const handleAboutChange = (data: {
    achievements: Achievement[]
    certifications: Certification[]
    languages: Language[]
    projects: Project[]
    passion: Passion[]
    skills: SkillCategory[]
  }) => {
    setTemplateData((prev) => ({
      ...prev,
      [selectedTemplateId]: {
        ...prev[selectedTemplateId],
        achievements: data.achievements,
        certifications: data.certifications,
        languages: data.languages,
        projects: data.projects,
        passion: data.passion,
        skills: data.skills,
      },
    }))
  }

  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplateId(templateId)
    // Save selected template to localStorage
    localStorage.setItem("selectedTemplateId", templateId)
  }

  // Load selected template from localStorage
  useEffect(() => {
    const savedTemplate = localStorage.getItem("selectedTemplateId") as TemplateId | null
    if (savedTemplate && TEMPLATES.find((t) => t.id === savedTemplate)) {
      setSelectedTemplateId(savedTemplate)
    } else {
      setSelectedTemplateId("default") // Set default template if saved one is not valid
      localStorage.setItem("selectedTemplateId", "default")
    }
  }, [])

  const renderForm = () => {
    switch (activeTab) {
      case "template":
        return <TemplateSelector selectedTemplateId={selectedTemplateId} onSelectTemplate={handleTemplateChange} />
      case "header":
        return (
          <HeaderForm
            data={currentTemplateData.header}
            onChange={handleHeaderChange}
            profileImage={profileImage}
            onProfileImageChange={handleProfileImageChange}
          />
        )
      case "experience":
        return <ExperienceForm data={currentTemplateData.experience} onChange={handleExperienceChange} />
      case "education":
        return <EducationForm data={currentTemplateData.education} onChange={handleEducationChange} />
      case "skills":
        return (
          <AboutForm
            achievements={currentTemplateData.achievements}
            certifications={currentTemplateData.certifications}
            languages={currentTemplateData.languages}
            projects={currentTemplateData.projects}
            passion={currentTemplateData.passion}
            skills={currentTemplateData.skills}
            onChange={handleAboutChange}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-red-50 p-6">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8">
        {/* Sidebar - Always visible */}
        <div className="w-full md:w-[40%] flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="sticky top-6 overflow-y-auto">
              <div className="border-b border-gray-200">
                <nav className="flex" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        grow py-4 px-1 text-center border-b-2 font-medium text-sm
                        ${
                          activeTab === tab.id
                            ? "border-[#1a4977] text-[#1a4977]"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }
                      `}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-6">{renderForm()}</div>
              {/* Preview & Download Buttons for Mobile */}
              <div className="p-6 border-t border-gray-200 md:hidden">
                <div className="space-y-4">
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="w-full px-4 py-2 bg-[#1a4977] text-white rounded-md hover:bg-[#153a5f] transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <span>Preview Resume</span>
                  </button>
                  <DownloadButton contentRef={resumeRef as React.RefObject<HTMLDivElement>} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Preview Modal */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 md:hidden bg-gray-100">
            <div className="min-h-screen flex flex-col">
              {/* Modal Header */}
              <div className="bg-white px-4 py-3 flex justify-between items-center border-b sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <DownloadButton contentRef={resumeRef as React.RefObject<HTMLDivElement>} />
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Preview Content */}
              <div className="flex-1 overflow-auto bg-gray-100">
                <div className="p-4 mx-auto">
                  <div
                    ref={resumeRef}
                    id="mobile-resume-content"
                    className="bg-white mx-auto origin-top pdf-container"
                    style={{
                      width: "210mm",
                      minHeight: "293mm",
                      transform: `scale(${Math.min(0.9, window.innerWidth / (210 * 3.78125))})`,
                      transformOrigin: "top center",
                      marginBottom: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <ResumeWrapper
                      header={currentTemplateData.header}
                      experience={currentTemplateData.experience}
                      education={currentTemplateData.education}
                      languages={currentTemplateData.languages}
                      skills={currentTemplateData.skills}
                      achievements={currentTemplateData.achievements}
                      certifications={currentTemplateData.certifications}
                      projects={currentTemplateData.projects}
                      passion={currentTemplateData.passion}
                      profileImage={profileImage}
                      templateId={selectedTemplateId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tablet Preview Modal */}
        {showTabletPreviewModal && (
          <div className="fixed inset-0 z-50 hidden sm:block md:hidden bg-gray-100">
            <div className="min-h-screen flex flex-col">
              {/* Modal Header */}
              <div className="bg-white px-4 py-3 flex justify-between items-center border-b sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <DownloadButton contentRef={resumeRef as React.RefObject<HTMLDivElement>} />
                  <button
                    onClick={() => setShowTabletPreviewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tablet Preview Content */}
              <div className="flex-1 overflow-auto bg-gray-100">
                <div className="p-4 mx-auto">
                  <div
                    id="tablet-resume-content"
                    className="bg-white mx-auto origin-top pdf-container"
                    style={{
                      width: "210mm",
                      minHeight: "293mm",
                      transform: `scale(${Math.min(0.9, window.innerWidth / (210 * 3.78125))})`,
                      transformOrigin: "top center",
                      marginBottom: "20px",
                      overflow: "hidden",
                    }}
                  >
                    <ResumeWrapper
                      header={currentTemplateData.header}
                      experience={currentTemplateData.experience}
                      education={currentTemplateData.education}
                      languages={currentTemplateData.languages}
                      skills={currentTemplateData.skills}
                      achievements={currentTemplateData.achievements}
                      certifications={currentTemplateData.certifications}
                      projects={currentTemplateData.projects}
                      passion={currentTemplateData.passion}
                      profileImage={profileImage}
                      templateId={selectedTemplateId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="hidden sm:block md:hidden lg:block flex-1">
          <div className="flex justify-end gap-4 mb-4">
            {/* Preview Button for Tablet View Only */}
            <button
              onClick={() => setShowTabletPreviewModal(true)}
              className="hidden sm:flex md:hidden px-4 py-2 bg-[#1a4977] text-white rounded-md hover:bg-[#153a5f] transition-colors items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>Preview Resume</span>
            </button>
            <DownloadButton contentRef={resumeRef as React.RefObject<HTMLDivElement>} />
          </div>
          <div
            ref={resumeRef}
            id="desktop-resume-content"
            className="bg-white print:shadow-none pdf-container"
            style={{
              width: "210mm",
              minHeight: "293mm",
              margin: "0 auto",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <ResumeWrapper
              header={currentTemplateData?.header}
              experience={currentTemplateData?.experience}
              education={currentTemplateData?.education}
              languages={currentTemplateData?.languages}
              skills={currentTemplateData?.skills}
              achievements={currentTemplateData?.achievements}
              certifications={currentTemplateData?.certifications}
              projects={currentTemplateData?.projects}
              passion={currentTemplateData?.passion}
              profileImage={profileImage}
              templateId={selectedTemplateId}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
