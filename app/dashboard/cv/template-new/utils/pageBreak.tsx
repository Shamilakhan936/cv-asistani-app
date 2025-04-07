/** @jsxImportSource react */
import { FC, ReactNode } from 'react';

interface PageBreakProps {
  children: ReactNode;
  className?: string;
}

export const PageBreak: FC<PageBreakProps> = ({ children, className = '' }) => {
  return (
    <div className={`page-break ${className}`} style={{ 
      pageBreakBefore: 'always',
      breakBefore: 'page',
      marginTop: '20mm',
      minHeight: '297mm',
      width: '210mm',
      backgroundColor: 'white',
      position: 'relative',
      overflow: 'visible'
    }}>
      {children}
    </div>
  );
};

export const checkContentHeight = (element: HTMLElement): boolean => {
  const A4_HEIGHT_MM = 297;
  const MM_TO_PX = 3.78125; // 1mm = 3.78125px
  const contentHeight = element.scrollHeight;
  const contentHeightMM = contentHeight / MM_TO_PX;
  
  // Add some buffer to account for margins and padding
  const BUFFER_MM = 10;
  return contentHeightMM > (A4_HEIGHT_MM - BUFFER_MM);
};

export const splitContentIntoPages = (content: HTMLElement): HTMLElement[] => {
  const pages: HTMLElement[] = [];
  const A4_HEIGHT_MM = 297;
  const MM_TO_PX = 3.78125;
  const PAGE_HEIGHT_PX = A4_HEIGHT_MM * MM_TO_PX;
  
  let remainingContent = content.cloneNode(true) as HTMLElement;
  
  while (remainingContent.scrollHeight > PAGE_HEIGHT_PX) {
    const page = document.createElement('div');
    page.className = 'page';
    page.style.minHeight = `${A4_HEIGHT_MM}mm`;
    page.style.width = '210mm';
    page.style.position = 'relative';
    page.style.pageBreakAfter = 'always';
    page.style.breakAfter = 'page';
    
    // Clone and append content
    const contentClone = remainingContent.cloneNode(true) as HTMLElement;
    page.appendChild(contentClone);
    
    // Adjust content to fit page
    const elements = Array.from(contentClone.children);
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];
      if (page.scrollHeight > PAGE_HEIGHT_PX) {
        element.remove();
      }
    }
    
    pages.push(page);
    remainingContent = contentClone;
  }
  
  if (remainingContent.children.length > 0) {
    const lastPage = document.createElement('div');
    lastPage.className = 'page';
    lastPage.style.minHeight = `${A4_HEIGHT_MM}mm`;
    lastPage.style.width = '210mm';
    lastPage.appendChild(remainingContent);
    pages.push(lastPage);
  }
  
  return pages;
}; 