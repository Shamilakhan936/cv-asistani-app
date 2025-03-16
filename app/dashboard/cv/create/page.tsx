'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// Oluşturduğumuz bileşenleri import ediyoruz
import PersonalInfoForm from './components/PersonalInfoForm';
import SummaryForm from './components/SummaryForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import LanguagesForm from './components/LanguagesForm';
import SkillsForm from './components/SkillsForm';
import PreviewCV from './components/PreviewCV';
import { toast } from 'sonner';
import { ArrowLeft, Save, Download, Eye } from 'lucide-react';

// Form için tip tanımlamaları
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

// Form için varsayılan boş değerler
const DEFAULT_CV_DATA: CVData = {
  personalInfo: {
    name: '',
    title: '',
    phone: '',
    email: '',
    linkedin: '',
    location: '',
  },
  summary: '',
  experience: [
    {
      title: '',
      company: '',
      period: '',
      location: '',
      responsibilities: ['']
    }
  ],
  education: [
    {
      degree: '',
      university: '',
      location: '',
      duration: ''
    }
  ],
  languages: [
    {
      name: '',
      level: '',
      filledDots: 3
    }
  ],
  skills: '',
  achievements: [
    {
      title: '',
      description: ''
    }
  ],
  courses: [
    {
      title: '',
      description: ''
    }
  ],
  passions: [
    {
      title: '',
      description: ''
    }
  ],
  profileImage: '/images/avatar.jpg',
  template: 'elegant'
};

export default function CreateCVPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('personal-info');
  const [cvData, setCvData] = useState<CVData>(DEFAULT_CV_DATA);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Form verilerini güncelleme fonksiyonu
  const updateFormData = (section: string, data: any) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  // CV'yi kaydetme fonksiyonu
  const saveCV = async () => {
    try {
      // Veri doğrulama
      if (!cvData.personalInfo.name || !cvData.personalInfo.email) {
        toast.error('Lütfen gerekli kişisel bilgileri doldurun.');
        setActiveTab('personal-info');
        return;
      }

      // API'ye gönder
      const response = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) {
        throw new Error('CV kaydedilemedi');
      }

      const data = await response.json();
      toast.success('CV başarıyla kaydedildi!');
      
      // Dashboard CV sayfasına yönlendir
      router.push(`/dashboard/cv/edit/${data.id}`);
    } catch (error) {
      console.error('CV kaydetme hatası:', error);
      toast.error('CV kaydedilirken bir hata oluştu.');
    }
  };

  // PDF önizleme fonksiyonu
  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  // PDF indirme fonksiyonu
  const handleDownloadPDF = async () => {
    try {
      // PDF indirme işlemini başlat
      const response = await fetch('/api/cv/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cvData),
      });

      if (!response.ok) {
        throw new Error('PDF oluşturulamadı');
      }

      // İndirme işlemi
      // HTML içeriğini alıp HTML2PDF ile client tarafında işleyeceğiz
      const htmlContent = await response.text();
      
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
      
      toast.success('PDF indirme işlemi başlatılıyor...');
    } catch (error) {
      console.error('PDF indirme hatası:', error);
      toast.error('PDF indirme sırasında bir hata oluştu.');
    }
  };

  // Bir sonraki sekmeye geçiş fonksiyonu
  const goToNextTab = () => {
    const tabs = ['personal-info', 'summary', 'experience', 'education', 'languages', 
                  'skills', 'achievements', 'courses', 'passions', 'preview'];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  // Bir önceki sekmeye geçiş fonksiyonu
  const goToPrevTab = () => {
    const tabs = ['personal-info', 'summary', 'experience', 'education', 'languages', 
                  'skills', 'achievements', 'courses', 'passions', 'preview'];
    const currentIndex = tabs.indexOf(activeTab);
    
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Geçici olarak henüz oluşturmadığımız form bileşenleri için mesaj gösteriyoruz
  const PlaceholderComponent = ({ title }: { title: string }) => (
    <div className="p-6 text-center">
      <h3 className="text-xl font-semibold mb-4">{title} Formu</h3>
      <p className="text-gray-500">Bu bileşen yakında eklenecek.</p>
    </div>
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Panele Dön</span>
          </Button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#d946ef] inline-block text-transparent bg-clip-text">
            Yeni CV Oluştur
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handlePreview}
            className="flex items-center gap-2"
          >
            <Eye size={16} />
            <span>Önizle</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            <span>PDF İndir</span>
          </Button>
          <Button
            onClick={saveCV}
            className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white flex items-center gap-2"
          >
            <Save size={16} />
            <span>Kaydet</span>
          </Button>
        </div>
      </div>

      <form ref={formRef} className="space-y-6">
        <Card className="p-6 shadow-lg border rounded-xl bg-white/50 backdrop-blur-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-10 mb-8">
              <TabsTrigger value="personal-info">Kişisel Bilgiler</TabsTrigger>
              <TabsTrigger value="summary">Özet</TabsTrigger>
              <TabsTrigger value="experience">Deneyim</TabsTrigger>
              <TabsTrigger value="education">Eğitim</TabsTrigger>
              <TabsTrigger value="languages">Diller</TabsTrigger>
              <TabsTrigger value="skills">Beceriler</TabsTrigger>
              <TabsTrigger value="achievements">Başarılar</TabsTrigger>
              <TabsTrigger value="courses">Kurslar</TabsTrigger>
              <TabsTrigger value="passions">İlgi Alanları</TabsTrigger>
              <TabsTrigger value="preview">Önizleme</TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
              <PersonalInfoForm 
                data={cvData.personalInfo} 
                updateData={(data) => updateFormData('personalInfo', data)} 
              />
            </TabsContent>

            <TabsContent value="summary">
              <SummaryForm 
                data={cvData.summary} 
                updateData={(data) => updateFormData('summary', data)} 
              />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceForm 
                data={cvData.experience} 
                updateData={(data) => updateFormData('experience', data)} 
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationForm 
                data={cvData.education} 
                updateData={(data) => updateFormData('education', data)} 
              />
            </TabsContent>

            <TabsContent value="languages">
              <LanguagesForm 
                data={cvData.languages} 
                updateData={(data) => updateFormData('languages', data)} 
              />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsForm 
                data={cvData.skills} 
                updateData={(data) => updateFormData('skills', data)} 
              />
            </TabsContent>

            <TabsContent value="achievements">
              <PlaceholderComponent title="Başarılar" />
            </TabsContent>

            <TabsContent value="courses">
              <PlaceholderComponent title="Kurslar" />
            </TabsContent>

            <TabsContent value="passions">
              <PlaceholderComponent title="İlgi Alanları" />
            </TabsContent>

            <TabsContent value="preview">
              <PreviewCV data={cvData} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={goToPrevTab}
              disabled={activeTab === 'personal-info'}
            >
              Önceki
            </Button>
            <Button
              type="button"
              onClick={activeTab === 'preview' ? saveCV : goToNextTab}
              className={activeTab === 'preview' ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white' : ''}
            >
              {activeTab === 'preview' ? 'Kaydet' : 'Sonraki'}
            </Button>
          </div>
        </Card>
      </form>

      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] h-[90%] overflow-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-2xl font-bold">CV Önizleme</h2>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleDownloadPDF}>
                  PDF İndir
                </Button>
                <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                  Kapat
                </Button>
              </div>
            </div>
            <PreviewCV data={cvData} />
          </div>
        </div>
      )}
    </div>
  );
} 