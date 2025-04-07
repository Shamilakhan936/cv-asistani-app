"use client";

import { FC, useRef, useEffect, useState, useMemo } from 'react';
import { ResumeData } from '../types/datatypes';
import { getTemplateById, TemplateId } from './templates';
import dynamic from 'next/dynamic';

interface ResumeWrapperProps extends ResumeData {
  templateId: TemplateId;
}

// Component that wraps around the selected template
const ResumeWrapper: FC<ResumeWrapperProps> = (props) => {
  const { templateId, ...resumeData } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [pages, setPages] = useState(1);
  
  // Get the selected template component
  const selectedTemplate = getTemplateById(templateId);
  const TemplateComponent = selectedTemplate.component;

  // Handle client-side initialization
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the pagination check function
  const checkPagination = useMemo(() => {
    if (!mounted) return () => 1;
    
    return () => {
      const content = wrapperRef.current;
      if (!content) return 1;
      
      const A4_HEIGHT_MM = 297;
      const MM_TO_PX = 3.78125;
      const contentHeight = content.scrollHeight;
      const contentHeightMM = contentHeight / MM_TO_PX;
      const numberOfPages = Math.ceil(contentHeightMM / A4_HEIGHT_MM);
      return Math.max(1, numberOfPages);
    };
  }, [mounted]);

  // Handle pagination
  useEffect(() => {
    if (!mounted) return;

    let timeoutId: NodeJS.Timeout;
    const observer = new ResizeObserver(() => {
      // Debounce the pagination check
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const newPages = checkPagination();
        setPages(prev => prev !== newPages ? newPages : prev);
      }, 100);
    });

    if (wrapperRef.current) {
      observer.observe(wrapperRef.current);
      
      // Initial check after a short delay to ensure content is properly rendered
      timeoutId = setTimeout(() => {
        const initialPages = checkPagination();
        if (initialPages !== pages) {
          setPages(initialPages);
        }
      }, 100);
    }

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [checkPagination, mounted, pages]);

  const additionalPages = useMemo(() => {
    if (!mounted || pages <= 1) return null;
    
    return Array.from({ length: pages - 1 }, (_, index) => (
      <div
        key={index + 1}
        className="page-break"
        data-template-id={templateId}
      >
        <TemplateComponent {...resumeData} isFirstPage={false} />
      </div>
    ));
  }, [mounted, pages, templateId, resumeData, TemplateComponent]);
  
  return (
    <div className="resume-pages">
      <div
        ref={wrapperRef}
        className="template-wrapper"
        data-template-id={templateId}
      >
        <TemplateComponent {...resumeData} isFirstPage={true} />
      </div>
      {additionalPages}
    </div>
  );
};

// Export with NoSSR to prevent hydration issues
export default dynamic(() => Promise.resolve(ResumeWrapper), {
  ssr: false
}); 