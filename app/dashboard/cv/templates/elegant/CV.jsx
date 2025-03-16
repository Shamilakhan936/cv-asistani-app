'use client';
import React from "react";
import "@fontsource/rubik";
import "@fontsource/inter";

// Dinamik import yerine doğrudan bileşenleri import ediyoruz
import Experience from "./components/experience.jsx";
import Education from "./components/Education.jsx";
import Languages from "./components/Languages.jsx";
import Personal_Info from "./components/Personal_Info.jsx";
import Achievement from "./components/Achievement.jsx";
import Courses from "./components/Courses.jsx";
import Passions from "./components/Passions.jsx";

// Veri dönüşümü için yardımcı fonksiyon
function adaptData(data) {
  // Eğer data CVData türünde ise düzenleme sayfasından geliyor demektir
  if (data.personal) {
    return {
      personalInfo: {
        name: data.personal?.fullName || '',
        title: data.personal?.title || '',
        phone: data.personal?.phone || '',
        email: data.personal?.email || '',
        linkedin: data.personal?.linkedin || '',
        location: data.personal?.location || '',
      },
      summary: data.summary || '',
      experience: Array.isArray(data.experience) ? data.experience.map(exp => ({
        title: exp.position || '',
        company: exp.company || '',
        period: `${exp.startDate || ''} - ${exp.current ? 'Present' : (exp.endDate || '')}`,
        location: exp.location || '',
        responsibilities: exp.description ? exp.description.split('. ').filter(s => s.trim()) : ['']
      })) : [],
      education: Array.isArray(data.education) ? data.education.map(edu => ({
        degree: edu.degree || '',
        university: edu.school || '',
        location: edu.location || '',
        duration: `${edu.startDate || ''} - ${edu.endDate || ''}`
      })) : [],
      languages: Array.isArray(data.languages) ? data.languages.map(lang => ({
        name: lang.language || '',
        level: lang.proficiency || '',
        filledDots: lang.proficiency === 'Ana dil' ? 5 : lang.proficiency === 'İleri' ? 4 : 3
      })) : [],
      skills: typeof data.skills === 'string' ? data.skills : (Array.isArray(data.skills) ? data.skills.map(s => s.name).join(', ') : ''),
      achievements: Array.isArray(data.achievements) ? data.achievements.map(ach => ({
        title: ach.title || '',
        description: ach.description || ''
      })) : [],
      courses: Array.isArray(data.certifications) ? data.certifications.map(cert => ({
        title: cert.name || '',
        description: cert.description || ''
      })) : [],
      passions: Array.isArray(data.interests) ? data.interests.map(int => ({
        title: int.title || '',
        description: int.description || ''
      })) : [],
      profileImage: '/images/avatar.jpg'
    };
  }
  
  // Eğer zaten zarif şablonu için uygun formattaysa, doğrudan kullan
  return data;
}

// data parametresini alıp kullanılabilir hale getiriyoruz
function CV({ data = {} }) {
  // Adaptasyon işlemi
  const adaptedData = adaptData(data);
  
  return (
    <div className="w-[210mm] h-[297mm] bg-white m-8 shadow mx-auto flex">
      {/* Left Section */}
      <div className="w-2/3 pr-6 py-6 pl-8">
        <Personal_Info data={adaptedData.personalInfo} />
        <div className="mt-5">
          <h3 className="text-textColor font-rubik border-b border-grayIcon mb-1 pb-1">
            SUMMARY
          </h3>
          <p className="text-gray-600 mt-2 text-xs font-inter">
            {adaptedData.summary || "Accomplished Senior Project Manager with over 6 years of experience in leading high-priority treasury and expense management initiatives. Proficient in PeopleSoft Cash Management, budget planning, and implementing technology solutions."}
          </p>
        </div>

        <Experience data={adaptedData.experience} />
        <Education data={adaptedData.education} />
        <Languages data={adaptedData.languages} />
      </div>

      {/* Right Section */}
      <div className="w-1/3 bg-darkbg text-white p-6">
        <img
          src={adaptedData.profileImage || "/images/avatar.jpg"}
          alt="Profile"
          className="rounded-full w-28 h-28 m-auto text-center object-cover"
        />
        <Achievement data={adaptedData.achievements} />
        <h3 className="text-whiteText font-rubik border-b border-grayIcon mb-1 pb-1 mt-5">
          SKILLS
        </h3>
        <p className="text-xs text-whiteText mt-1 font-inter">
          {adaptedData.skills || "Project Management, Business Process Improvement, PeopleSoft Cash Management, Expense Management, Data Analytics, Risk Management"}
        </p>
        <Courses data={adaptedData.courses} />
        <Passions data={adaptedData.passions} />
      </div>
    </div>
  );
}

export default CV; 