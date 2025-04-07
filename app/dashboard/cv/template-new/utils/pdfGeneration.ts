import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

export async function downloadResumePdf(element: HTMLElement): Promise<void> {
  if (!element) return;
  
  try {
    const originalTransform = element.style.transform;
    const originalPadding = element.style.padding;
    const originalMargin = element.style.margin;
    const originalLeft = element.style.left;
    const originalPosition = element.style.position;
    
    element.style.transform = 'none';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.left = '0';
    element.style.position = 'relative';
    
    const containers = element.querySelectorAll('.pdf-container, .resume-container');
    containers.forEach(container => {
      if (container instanceof HTMLElement) {
        container.style.padding = '0';
        container.style.margin = '0';
        container.style.left = '0';
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const dataUrl = await domtoimage.toPng(element, {
      quality: 1.0,
      bgcolor: '#fff',
      style: {
        transform: 'none',
        padding: '0',
        margin: '0',
        left: '0'
      },
      width: element.offsetWidth,
      height: element.offsetHeight
    });
    
    // Restore original styles
    element.style.transform = originalTransform;
    element.style.padding = originalPadding;
    element.style.margin = originalMargin;
    element.style.left = originalLeft;
    element.style.position = originalPosition;
    
    containers.forEach(container => {
      if (container instanceof HTMLElement) {
        container.style.padding = '';
        container.style.margin = '';
        container.style.left = '';
      }
    });
    
    // Create a new image from the data URL
    const img = new Image();
    img.src = dataUrl;
    
    // Wait for the image to load
    await new Promise((resolve) => {
      img.onload = resolve;
    });
    
    // Create PDF (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Calculate dimensions to fit A4
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    
    // Add the image to the PDF - explicitly set x to 0 to avoid padding
    pdf.addImage(dataUrl, 'PNG', 0, 0, imgWidth, pageHeight);
    
    // Save the PDF
    pdf.save('resume.pdf');
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    tryFallbackMethod(element);
  }
}

async function tryFallbackMethod(element: HTMLElement): Promise<void> {
  try {
    const originalPadding = element.style.padding;
    const originalMargin = element.style.margin;
    const originalLeft = element.style.left;
    
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.left = '0';
    
    const jsPDF = (await import('jspdf')).default;
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const dataUrl = await getElementScreenshot(element);
    
    element.style.padding = originalPadding;
    element.style.margin = originalMargin;
    element.style.left = originalLeft;
    
    if (dataUrl) {
      pdf.addImage(dataUrl, 'JPEG', 0, 0, 210, 297);
    } else {
      pdf.setFontSize(16);
      pdf.text('Resume', 105, 20, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text('Could not generate resume with styling. Please try a different browser.', 20, 40, { maxWidth: 170 });
    }
    
    pdf.save('resume-fallback.pdf');
    
  } catch (error) {
    console.error('Fallback PDF generation failed:', error);
  }
}

async function getElementScreenshot(element: HTMLElement): Promise<string | null> {
  try {
    const htmlToImage = await import('html-to-image');
    return await htmlToImage.toJpeg(element, { 
      quality: 0.8,
      style: {
        padding: '0',
        margin: '0',
        left: '0'
      }
    });
  } catch (e) {
    console.error('Screenshot failed:', e);
    return null;
  }
}