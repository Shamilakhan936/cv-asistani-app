import { useState } from 'react';
import { downloadResumePdf } from '../utils/pdfGeneration';

interface DownloadButtonProps {
  contentRef: React.RefObject<HTMLDivElement>;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ contentRef }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!contentRef.current || isDownloading) return;
    
    setIsDownloading(true);
    try {
      await downloadResumePdf(contentRef.current);
    } catch (e) {
      console.error('Download failed:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="px-4 py-2 bg-[#1a4977] text-white rounded-md hover:bg-[#153a5f] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
    >
      {isDownloading ? (
        <>
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Download PDF</span>
        </>
      )}
    </button>
  );
};

export default DownloadButton;