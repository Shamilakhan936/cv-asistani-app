'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Zarif şablonunu dinamik olarak import et
const ElegantCV = dynamic(
  () => import('../../templates/elegant/CV'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[297mm] w-[210mm] bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">CV şablonu yükleniyor...</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

// CV verileri için tip tanımlaması
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
  icon?: React.ReactNode;
}

interface Course {
  title: string;
  description: string;
}

interface Passion {
  title: string;
  description: string;
  icon?: React.ReactNode;
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

interface PreviewCVProps {
  data: CVData;
}

export default function PreviewCV({ data }: PreviewCVProps) {
  // Kullanıcının girdiği veriler var mı kontrol et
  const hasData = Boolean(
    data.personalInfo.name ||
    data.summary ||
    data.experience.some(exp => exp.title || exp.company) ||
    data.education.some(edu => edu.degree || edu.university) ||
    data.languages.some(lang => lang.name) ||
    data.skills ||
    data.achievements.some(ach => ach.title) ||
    data.courses.some(course => course.title) ||
    data.passions.some(passion => passion.title)
  );

  // Henüz veri girilmemişse bilgi mesajı göster
  if (!hasData) {
    return (
      <Card className="p-8 flex flex-col items-center justify-center h-[500px] text-center">
        <img 
          src="/images/cv-illustration.svg" 
          alt="CV İllüstrasyonu"
          className="w-48 h-48 mb-6 opacity-70"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">CV Önizleme</h3>
        <p className="text-gray-500 max-w-md">
          CV önizlemeniz burada görünecek. Verilerinizi girdikçe önizleme gerçek zamanlı olarak güncellenecektir.
        </p>
      </Card>
    );
  }

  // Şablona göre verileri render et
  return (
    <div className="cv-preview border border-gray-200 shadow-lg rounded-lg overflow-hidden">
      <div className="flex justify-center bg-gray-50 p-4 scale-[0.7] origin-top transform-gpu">
        <div className="cv-content">
          <ElegantCV data={data} />
        </div>
      </div>
    </div>
  );
} 