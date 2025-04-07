import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
export const dynamic = 'force-dynamic';
// CV verilerinin tip tanımlamaları
interface PersonalInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

interface Education {
  degree: string;
  university: string;
  location: string;
  duration: string;
}

interface Language {
  name: string;
  level: string;
  filledDots: number;
}

interface Achievement {
  title: string;
  description: string;
}

interface Course {
  title: string;
  description: string;
}

interface Passion {
  title: string;
  description: string;
}

interface CVData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  languages: Language[];
  skills: string;
  achievements: Achievement[];
  courses: Course[];
  passions: Passion[];
  profileImage: string;
  template: string;
}

export async function POST(req: NextRequest) {
  try {
    // Kullanıcı kimlik doğrulaması
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // İstek gövdesinden CV verilerini al
    const data: CVData = await req.json();

    // CV Template HTML oluştur
    const htmlContent = generateCVHTML(data);

    // Not: Puppeteer kullanmadan doğrudan HTML içeriğini dönüyoruz
    // Gerçek PDF oluşturma işlemi client tarafında yapılacak
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      }
    });
    
  } catch (error) {
    console.error('HTML oluşturma hatası:', error);
    return NextResponse.json({ error: 'HTML oluşturulamadı' }, { status: 500 });
  }
}

// CV verileri için HTML şablonu oluşturma
function generateCVHTML(data: CVData): string {
  const { 
    personalInfo, 
    summary, 
    experience, 
    education, 
    languages, 
    skills, 
    achievements, 
    courses, 
    passions 
  } = data;

  // CSS stilleri
  const styles = `
    :root {
      --font-rubik: 'Rubik', sans-serif;
      --font-inter: 'Inter', sans-serif;
      --color-light: #2ea1ff;
      --color-darkbg: #22405c;
      --color-grayIcon: #b4b9bc;
      --color-textColor: #384347;
      --color-whiteText: #e6ecfa;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: var(--font-inter);
      font-size: 12px;
      line-height: 1.5;
      color: var(--color-textColor);
    }
    
    .cv-container {
      width: 210mm;
      height: 297mm;
      background-color: white;
      display: flex;
    }
    
    .left-section {
      width: 66.66%;
      padding: 24px 24px 24px 32px;
    }
    
    .right-section {
      width: 33.33%;
      background-color: var(--color-darkbg);
      color: white;
      padding: 24px;
    }
    
    h1 {
      font-family: var(--font-rubik);
      font-size: 28px;
      font-weight: bold;
      color: var(--color-textColor);
      margin: 0 0 4px 0;
    }
    
    .title {
      font-family: var(--font-inter);
      color: var(--color-light);
      margin: 0 0 12px 0;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 20px;
    }
    
    .contact-item {
      margin: 0 12px 12px 0;
      display: flex;
      align-items: center;
    }
    
    h3 {
      font-family: var(--font-rubik);
      border-bottom: 1px solid var(--color-grayIcon);
      margin-bottom: 4px;
      padding-bottom: 4px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .right-section h3 {
      color: var(--color-whiteText);
    }
    
    .section {
      margin-top: 20px;
    }
    
    .experience-item {
      margin-bottom: 12px;
    }
    
    .job-header, .edu-header {
      display: flex;
      justify-content: space-between;
      font-family: var(--font-rubik);
    }
    
    .job-title, .degree {
      font-size: 14px;
      color: var(--color-textColor);
    }
    
    .job-company, .university {
      font-size: 14px;
      color: var(--color-light);
      margin-top: 2px;
    }
    
    .job-period, .edu-period {
      font-size: 12px;
      color: var(--color-textColor);
    }
    
    .job-location, .edu-location {
      font-size: 12px;
      color: var(--color-textColor);
      text-align: right;
    }
    
    ul {
      margin: 8px 0 0 20px;
      padding: 0;
    }
    
    li {
      margin-bottom: 2px;
    }
    
    .languages {
      display: flex;
      justify-content: space-between;
    }
    
    .language-item {
      width: 50%;
      display: flex;
      justify-content: space-between;
    }
    
    .language-name {
      font-size: 15px;
    }
    
    .language-level {
      display: flex;
      align-items: center;
      margin: auto;
    }
    
    .language-text {
      font-size: 12px;
      color: var(--color-textColor);
      margin-right: 8px;
    }
    
    .dots {
      display: flex;
    }
    
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin: 0 2px;
    }
    
    .dot.filled {
      background-color: var(--color-light);
    }
    
    .dot.empty {
      background-color: var(--color-grayIcon);
    }
    
    .profile-image {
      width: 112px;
      height: 112px;
      border-radius: 50%;
      object-fit: cover;
      margin: 0 auto 20px;
      display: block;
    }
    
    .achievement-item,
    .course-item,
    .passion-item {
      margin-top: 8px;
    }
    
    .achievement-title,
    .course-title,
    .passion-title {
      font-family: var(--font-rubik);
      font-size: 15px;
      color: var(--color-whiteText);
    }
    
    .achievement-desc,
    .course-desc,
    .passion-desc {
      font-size: 12px;
      color: var(--color-whiteText);
      margin-top: 2px;
    }
    
    .skills {
      font-size: 12px;
      color: var(--color-whiteText);
      margin-top: 4px;
    }
  `;

  // Deneyimler için HTML oluşturma
  const experienceHTML = experience.map(job => `
    <div class="experience-item">
      <div class="job-header">
        <p class="job-title">${job.title}</p>
        <p class="job-period">${job.period}</p>
      </div>
      <div class="job-header">
        <p class="job-company">${job.company}</p>
        <p class="job-location">${job.location}</p>
      </div>
      <ul>
        ${job.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  // Eğitim için HTML oluşturma
  const educationHTML = education.map(edu => `
    <div class="education-item">
      <div class="edu-header">
        <p class="degree">${edu.degree}</p>
        <p class="edu-period">${edu.duration}</p>
      </div>
      <div class="edu-header">
        <p class="university">${edu.university}</p>
        <p class="edu-location">${edu.location}</p>
      </div>
    </div>
  `).join('');

  // Diller için HTML oluşturma
  const languagesHTML = languages.map(lang => `
    <div class="language-item">
      <p class="language-name">${lang.name}</p>
      <div class="language-level">
        <small class="language-text">${lang.level}</small>
        <div class="dots">
          ${Array(5).fill(0).map((_, i) => 
            `<div class="dot ${i < lang.filledDots ? 'filled' : 'empty'}"></div>`
          ).join('')}
        </div>
      </div>
    </div>
  `).join('');

  // Başarılar için HTML oluşturma
  const achievementsHTML = achievements.map(ach => `
    <div class="achievement-item">
      <p class="achievement-title">${ach.title}</p>
      <p class="achievement-desc">${ach.description}</p>
    </div>
  `).join('');

  // Kurslar için HTML oluşturma
  const coursesHTML = courses.map(course => `
    <div class="course-item">
      <p class="course-title">${course.title}</p>
      <p class="course-desc">${course.description}</p>
    </div>
  `).join('');

  // Tutkular için HTML oluşturma
  const passionsHTML = passions.map(passion => `
    <div class="passion-item">
      <p class="passion-title">${passion.title}</p>
      <p class="passion-desc">${passion.description}</p>
    </div>
  `).join('');

  // Ana HTML şablonu
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${personalInfo.name} CV</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Rubik:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>${styles}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <script>
        // Sayfa yüklendiğinde PDF dönüşümünü otomatik başlat
        window.onload = function() {
          const element = document.getElementById('cv-container');
          const opt = {
            margin: 0,
            filename: '${personalInfo.name.replace(/\s+/g, '_')}_CV.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          
          html2pdf().set(opt).from(element).save();
        };
      </script>
    </head>
    <body>
      <div id="cv-container" class="cv-container">
        <div class="left-section">
          <h1>${personalInfo.name}</h1>
          <p class="title">${personalInfo.title}</p>
          
          <div class="contact-info">
            ${personalInfo.phone ? `<p class="contact-item">${personalInfo.phone}</p>` : ''}
            ${personalInfo.email ? `<p class="contact-item">${personalInfo.email}</p>` : ''}
            ${personalInfo.linkedin ? `<p class="contact-item">${personalInfo.linkedin}</p>` : ''}
            ${personalInfo.location ? `<p class="contact-item">${personalInfo.location}</p>` : ''}
          </div>
          
          <div class="section">
            <h3>SUMMARY</h3>
            <p>${summary}</p>
          </div>
          
          <div class="section">
            <h3>EXPERIENCE</h3>
            ${experienceHTML}
          </div>
          
          <div class="section">
            <h3>EDUCATION</h3>
            ${educationHTML}
          </div>
          
          <div class="section">
            <h3>LANGUAGES</h3>
            <div class="languages">
              ${languagesHTML}
            </div>
          </div>
        </div>
        
        <div class="right-section">
          <img class="profile-image" src="${data.profileImage}" alt="Profile" />
          
          <div class="section">
            <h3>KEY ACHIEVEMENTS</h3>
            ${achievementsHTML}
          </div>
          
          <div class="section">
            <h3>SKILLS</h3>
            <p class="skills">${skills}</p>
          </div>
          
          <div class="section">
            <h3>COURSES</h3>
            ${coursesHTML}
          </div>
          
          <div class="section">
            <h3>PASSIONS</h3>
            ${passionsHTML}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
} 