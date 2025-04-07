"use client";

import { FC, useEffect, useRef, useState, useMemo } from 'react';
import { ResumeData, HeaderData } from '../../types/datatypes';
import ProfileImage from '../ProfileImage';
import Experience from '../../parentComponents/ExperiencesMain';
import Education from '../../parentComponents/EducationMain';
import SummaryNew from '../../parentComponents/SummaryMain';
import AchievementsNew from '../../parentComponents/AchievementsNew';
import PassionMain from '../../parentComponents/PassionsMain';
import CoursesMain from '../../parentComponents/CoursesMain';
import Skills from '../Skills';

// Default empty header data
const defaultHeader: HeaderData = {
  name: '',
  title: '',
  location: '',
  email: '',
  phone: '',
  image: '',
  role: '',
  github: '',
  summary: ''
};

interface TemplateProps {
  header?: HeaderData;
  experience?: any[];
  education?: any[];
  languages?: any[];
  skills?: any[];
  achievements?: any[];
  projects?: any[];
  passion?: any[];
  profileImage?: string;
}

const PageContent: FC<TemplateProps & { isFirstPage: boolean }> = ({ 
  isFirstPage,
  header = defaultHeader, 
  experience = [], 
  education = [], 
  skills = [], 
  achievements = [], 
  passion = [],
  profileImage = '' 
}) => {
  // Early return if header is undefined
  if (!header) {
    return <div>Loading resume data...</div>;
  }

  return (
    <div className="bg-white w-full h-full rounded-[30px]">
      <div className="resume-container w-[210mm] h-[297mm]">
        <div className="bg-white w-[210mm] h-[297mm] relative">
          {/* Only show header on first page */}
          {isFirstPage && (
            <div className="bg-[#14324c] text-white p-8 flex items-center flex-row-reverse justify-between">
              <div className="mr-6">
                <div className="w-[100px] h-[100px]">
                  <ProfileImage src={profileImage || '/images/default-avatar.png'} />
                </div>
              </div>
              <div>
                <h1 className="text-[38px] font-bold text-white">{header.name || 'Your Name'}</h1>
                <h2 className="text-[19px] font-medium whitespace-nowrap text-white">
                  {header.title || 'Your Title'} 
                  {header.title && <span className="text-[19px] mx-[4px] text-gray-300">|</span>}
                  {header.role || header.title || 'Your Role'}
                </h2>
                <div className="mt-2 text-sm flex flex-wrap gap-[120px]">
                  <div>
                    {header.phone && <div className="text-[12px]">{header.phone}</div>}
                    {header.email && <div className="text-[12px]">{header.email}</div>}
                  </div>
                  <div className="text-[12px]">
                    {header.location && <div className="text-[12px]">{header.location}</div>}
                    {header.github && <div>{header.github}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main content area */}
          <div className="flex p-8 gap-6">
            {/* Left column - 60% */}
            <div className="w-[60%]">
              <div className="mb-6">
                <h2 className="text-[#235986] text-[20px] font-semibold uppercase border-b-[3px] border-[#235986] pb-1 mb-[8px]">
                  Experience
                </h2>
                <Experience data={experience} />
              </div>

              <div className="mb-6">
                <h2 className="text-[#235986] text-[20px] font-semibold uppercase border-b-[3px] border-[#235986] pb-1 mb-[8px]">
                  Education
                </h2>
                <Education data={education} />
              </div>

              <div className="mb-6">
                <h2 className="text-[#235986] text-[20px] font-semibold uppercase border-b-[3px] border-[#235986] pb-1 mb-4">
                  Skills
                </h2>
                <Skills data={skills} />
              </div>
            </div>

            {/* Right column - 40% */}
            <div className="w-[40%]">
              <div>
                <h2 className="text-[#235986] text-[20px] font-semibold uppercase border-b-[3px] border-[#235986] pb-1 mb-[8px]">
                  Summary
                </h2>
                <SummaryNew title="" description={header.summary || ''} />
              </div>

              <div className="mb-6">
                <h2 className="text-[#235986] text-[20px] font-semibold uppercase border-b-[3px] border-[#235986] pb-1">
                  Key Achievements
                </h2>
                <AchievementsNew data={achievements} />
              </div>

              <div className="mb-6">
                <h2 className="text-[#235986] text-[20px] font-semibold uppercase border-b-[3px] border-[#235986] pb-1 mb-[8px]">
                  Courses
                </h2>
                <CoursesMain data={passion} />
              </div>

              <div className="mb-6">
                <h2 className="text-[#235986] text-[20px] font-semibold uppercase border-b-[3px] border-[#235986] pb-1 mb-4">
                  PASSIONS
                </h2>
                <PassionMain data={passion} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModernTemplate: FC<TemplateProps> = (props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsSecondPage, setNeedsSecondPage] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize props with default values
  const safeProps = useMemo(() => ({
    header: props.header || defaultHeader,
    experience: props.experience || [],
    education: props.education || [],
    skills: props.skills || [],
    achievements: props.achievements || [],
    passion: props.passion || [],
    profileImage: props.profileImage || '/images/default-avatar.png'
  }), [props]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the content height check function
  const checkOverflow = useMemo(() => {
    return () => {
      const element = contentRef.current;
      if (element) {
        const A4_HEIGHT_MM = 297;
        const MM_TO_PX = 3.78125;
        const contentHeight = element.scrollHeight;
        const contentHeightMM = contentHeight / MM_TO_PX;
        return contentHeightMM > A4_HEIGHT_MM;
      }
      return false;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const observer = new ResizeObserver(() => {
      const needsPage = checkOverflow();
      if (needsPage !== needsSecondPage) {
        setNeedsSecondPage(needsPage);
      }
    });

    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => observer.disconnect();
  }, [checkOverflow, needsSecondPage, mounted]);

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

  return (
    <div ref={contentRef}>
      {/* First Page */}
      <PageContent isFirstPage={true} {...safeProps} />
      
      {/* Second Page (if needed) */}
      {needsSecondPage && (
        <div className="page-break">
          <PageContent isFirstPage={false} {...safeProps} />
        </div>
      )}
    </div>
  );
};

export default ModernTemplate; 