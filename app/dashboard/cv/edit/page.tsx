'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { CVData } from '@/types/cv';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// PamukkaleTemplate bileşeni yerine Zarif şablonunu dinamik olarak import ediyoruz
const ElegantCVTemplate = dynamic(
  () => import('@/app/dashboard/cv/templates/elegant/CV'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-[297mm] w-[210mm] bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-gray-400 animate-spin mb-4" />
          <p className="text-gray-500 font-medium">CV şablonu yükleniyor...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

// Şablon seçimi için bir bileşen, özellikle Zarif şablonu için
const TemplatePreview = ({ cvData, templateId }: { cvData: CVData, templateId: string }) => {
  if (templateId === 'elegant-template-1') {
    return <ElegantCVTemplate data={cvData} />;
  }
  
  // Diğer şablonlar için fallback
  return (
    <div className="flex items-center justify-center h-[297mm] w-[210mm] bg-gray-100">
      <p className="text-gray-500 font-medium">Şablon bulunamadı</p>
    </div>
  );
};

// Arrow left icon component
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7"/>
    <path d="M19 12H5"/>
  </svg>
);

// CV adımları
const steps = [
  { id: 'personal', title: 'Kişisel Bilgiler', description: 'İletişim ve temel bilgiler' },
  { id: 'summary', title: 'Hakkımda', description: 'Profesyonel özet' },
  { id: 'experience', title: 'Deneyim', description: 'İş deneyimleri' },
  { id: 'education', title: 'Eğitim', description: 'Eğitim geçmişi' },
  { id: 'skills', title: 'Beceriler', description: 'Teknik ve kişisel beceriler' },
  { id: 'languages', title: 'Diller', description: 'Yabancı dil bilgisi' },
  { id: 'achievements', title: 'Başarılar', description: 'Önemli başarılar' },
  { id: 'certificates', title: 'Sertifikalar', description: 'Sertifikalar ve belgeler' }
];

const defaultCVData: CVData = {
  personal: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  languages: [],
  achievements: [],
  certificates: [],
};

export default function EditCVPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState('personal');
  const [cvData, setCvData] = useState<CVData>({
    ...defaultCVData,
    experience: defaultCVData.experience.filter(exp => 
      !(exp.title === "Senior Business Analyst" && 
        exp.company === "Genentech" && 
        exp.location === "South San Francisco, CA")
    )
  });
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!templateId) {
      router.push('/cv/templates');
      return;
    }
    loadTemplateData();
  }, [templateId]);

  const loadTemplateData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/cv-templates/${templateId}`);
      
      if (!response.ok) {
        throw new Error('Şablon yüklenirken bir hata oluştu');
      }
      
      const data = await response.json();
      
      setCvData(data.template.content || defaultCVData);
    } catch (error) {
      console.error('Error loading template:', error);
      setError('Şablon yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cvData.personal.fullName + ' - CV',
          templateId,
          content: cvData
        })
      });

      if (!response.ok) {
        throw new Error('CV kaydedilirken bir hata oluştu');
      }

      toast.success('CV başarıyla kaydedildi');
      router.push('/dashboard/cvs');
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error('CV kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.push('/cv/templates');
  };

  const updatePersonalInfo = (field: keyof CVData['personal'], value: string) => {
    setCvData({
      ...cvData,
      personal: { ...cvData.personal, [field]: value }
    });
  };

  const handleExperienceChange = (index: number, field: keyof CVData['experience'][0], value: string | boolean) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setCvData({ ...cvData, experience: newExperience });
  };

  const handleEducationChange = (index: number, field: keyof CVData['education'][0], value: string) => {
    const newEducation = [...cvData.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setCvData({ ...cvData, education: newEducation });
  };

  const handleLanguageChange = (index: number, field: keyof CVData['languages'][0], value: string) => {
    const newLanguages = [...cvData.languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setCvData({ ...cvData, languages: newLanguages });
  };

  // Helper function to return icons for each section
  function getStepIcon(stepId: string) {
    switch(stepId) {
      case 'personal':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>;
      case 'summary':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>;
      case 'experience':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>;
      case 'education':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 14l9-5-9-5-9 5 9 5z" />
          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>;
      case 'skills':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>;
      case 'languages':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>;
      case 'achievements':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>;
      case 'certificates':
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>;
      default:
        return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
        </svg>;
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="form-group">
              <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</Label>
              <Input
                id="fullName"
                value={cvData.personal.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                placeholder="Tam adınız"
                className="w-full"
              />
            </div>
            
            <div className="form-group">
              <Label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Unvan / Pozisyon</Label>
              <Input
                id="title"
                value={cvData.personal.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                placeholder="Örn: Kıdemli Yazılım Mühendisi"
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Profesyonel unvanınız veya kariyer pozisyonunuz
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={cvData.personal.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  placeholder="ornek@email.com"
                  className="w-full"
                />
              </div>
              
              <div className="form-group">
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefon</Label>
                <Input
                  id="phone"
                  value={cvData.personal.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  placeholder="+90 555 123 4567"
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="form-group">
              <Label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Konum</Label>
              <Input
                id="location"
                value={cvData.personal.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="İstanbul, Türkiye"
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Yaşadığınız şehir ve ülke
              </p>
            </div>
            
            <div className="form-group">
              <Label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</Label>
              <Input
                id="linkedin"
                value={cvData.personal.linkedin || ''}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="linkedin.com/in/kullaniciadi"
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                LinkedIn profil URL'niz
              </p>
            </div>
            
            <div className="form-group">
              <Label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Web Sitesi (Opsiyonel)</Label>
              <Input
                id="website"
                value={cvData.personal.website}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                placeholder="www.example.com"
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">
                Kişisel web siteniz veya portföyünüz
              </p>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-4">
            <div className="form-group">
              <Label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">Profesyonel Özet</Label>
              <Textarea
                id="summary"
                value={cvData.summary}
                onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
                placeholder="Kendinizi kısaca tanıtın. Bu bölüm CV'nizin üst kısmında görünecektir."
                className="min-h-[150px] resize-y"
              />
              <p className="mt-1 text-xs text-gray-500">
                Kısa ve öz bir profesyonel özet yazın. İş deneyiminizi, becerilerinizi ve kariyer hedeflerinizi özetleyin.
              </p>
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            {cvData.experience.map((exp, index) => (
              <Card key={exp.id} className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {index + 1}. İş Deneyimi
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newExperience = [...cvData.experience];
                        newExperience.splice(index, 1);
                        setCvData({ ...cvData, experience: newExperience });
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor={`exp-title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Pozisyon
                      </Label>
                      <Input
                        id={`exp-title-${index}`}
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        placeholder="Örn: Kıdemli Yazılım Mühendisi"
                        className="w-full"
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor={`exp-company-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Şirket
                      </Label>
                      <Input
                        id={`exp-company-${index}`}
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        placeholder="Şirket adı"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor={`exp-location-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Konum
                    </Label>
                    <Input
                      id={`exp-location-${index}`}
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                      placeholder="Örn: İstanbul, Türkiye"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor={`exp-start-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Başlangıç Tarihi
                      </Label>
                      <Input
                        id={`exp-start-${index}`}
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="form-group">
                      <div className="flex justify-between items-center mb-1">
                        <Label htmlFor={`exp-end-${index}`} className="block text-sm font-medium text-gray-700">
                          Bitiş Tarihi
                        </Label>
                        <div className="flex items-center">
                          <input
                            id={`exp-current-${index}`}
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                            className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor={`exp-current-${index}`} className="text-sm text-gray-500">
                            Halen çalışıyorum
                          </label>
                        </div>
                      </div>
                      <Input
                        id={`exp-end-${index}`}
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className={`w-full ${exp.current ? "bg-gray-100" : ""}`}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor={`exp-desc-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      İş Tanımı ve Sorumluluklar
                    </Label>
                    <Textarea
                      id={`exp-desc-${index}`}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      placeholder="Pozisyondaki görev ve sorumluluklarınızı açıklayın. Noktalı liste şeklinde yazarsanız CV'de daha düzenli görünecektir."
                      className="min-h-[120px] resize-y w-full"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      İpucu: Her cümleyi nokta (.) ile sonlandırın. Her cümle ayrı bir madde olarak CV'de görünecektir.
                    </p>
                  </div>
                </div>
              </Card>
            ))}
            
            <Button
              onClick={() => {
                setCvData({
                  ...cvData,
                  experience: [
                    ...cvData.experience,
                    {
                      id: Date.now().toString(),
                      title: '',
                      company: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      current: false,
                      description: ''
                    }
                  ]
                });
              }}
              className="w-full flex items-center justify-center bg-blue-50 border-dashed border-2 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Yeni İş Deneyimi Ekle
            </Button>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            {cvData.education.map((edu, index) => (
              <Card key={edu.id} className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {index + 1}. Eğitim Bilgisi
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newEducation = [...cvData.education];
                        newEducation.splice(index, 1);
                        setCvData({ ...cvData, education: newEducation });
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor={`edu-degree-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Derece / Program
                      </Label>
                      <Input
                        id={`edu-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        placeholder="Örn: Bilgisayar Mühendisliği Lisans"
                        className="w-full"
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor={`edu-school-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Okul / Üniversite
                      </Label>
                      <Input
                        id={`edu-school-${index}`}
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        placeholder="Okul veya üniversite adı"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor={`edu-location-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Konum
                    </Label>
                    <Input
                      id={`edu-location-${index}`}
                      value={edu.location || ''}
                      onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                      placeholder="Örn: İstanbul, Türkiye"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor={`edu-start-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Başlangıç Tarihi
                      </Label>
                      <Input
                        id={`edu-start-${index}`}
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="form-group">
                      <Label htmlFor={`edu-end-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Bitiş Tarihi
                      </Label>
                      <Input
                        id={`edu-end-${index}`}
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor={`edu-desc-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama (Opsiyonel)
                    </Label>
                    <Textarea
                      id={`edu-desc-${index}`}
                      value={edu.description || ''}
                      onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                      placeholder="GPA, tamamladığınız önemli projeler, aldığınız ödüller, vb."
                      className="min-h-[100px] resize-y w-full"
                    />
                  </div>
                </div>
              </Card>
            ))}
            
            <Button
              onClick={() => {
                setCvData({
                  ...cvData,
                  education: [
                    ...cvData.education,
                    {
                      id: Date.now().toString(),
                      degree: '',
                      school: '',
                      location: '',
                      startDate: '',
                      endDate: '',
                      description: ''
                    }
                  ]
                });
              }}
              className="w-full flex items-center justify-center bg-blue-50 border-dashed border-2 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Yeni Eğitim Bilgisi Ekle
            </Button>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Teknik Beceriler</h3>
              <div className="space-y-3">
                {cvData.skills.filter(skill => skill.type === 'hard').map((skill, index) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = [...cvData.skills];
                        const skillIndex = newSkills.findIndex(s => s.id === skill.id);
                        newSkills[skillIndex] = { ...skill, name: e.target.value };
                        setCvData({ ...cvData, skills: newSkills });
                      }}
                      placeholder="Örn: JavaScript, Python, AutoCAD, Office 365"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCvData({
                          ...cvData,
                          skills: cvData.skills.filter(s => s.id !== skill.id)
                        });
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  onClick={() => {
                    setCvData({
                      ...cvData,
                      skills: [
                        ...cvData.skills,
                        {
                          id: Date.now().toString(),
                          name: '',
                          type: 'hard'
                        }
                      ]
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Teknik Beceri Ekle
                </Button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>CV'nizin sağ sütununda "Skills" bölümünde listelenecek teknik becerileriniz.</p>
                <p>Örnek: Programlama dilleri, yazılım araçları, tasarım programları, vb.</p>
              </div>
            </div>

            <div className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Kişisel Beceriler</h3>
              <div className="space-y-3">
                {cvData.skills.filter(skill => skill.type === 'soft').map((skill, index) => (
                  <div key={skill.id} className="flex items-center gap-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => {
                        const newSkills = [...cvData.skills];
                        const skillIndex = newSkills.findIndex(s => s.id === skill.id);
                        newSkills[skillIndex] = { ...skill, name: e.target.value };
                        setCvData({ ...cvData, skills: newSkills });
                      }}
                      placeholder="Örn: İletişim, Liderlik, Problem Çözme"
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setCvData({
                          ...cvData,
                          skills: cvData.skills.filter(s => s.id !== skill.id)
                        });
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  onClick={() => {
                    setCvData({
                      ...cvData,
                      skills: [
                        ...cvData.skills,
                        {
                          id: Date.now().toString(),
                          name: '',
                          type: 'soft'
                        }
                      ]
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Kişisel Beceri Ekle
                </Button>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>Kişisel yetenekleriniz ve karakteristik özellikleriniz.</p>
                <p>Örnek: Ekip çalışması, iletişim becerileri, müzakere, vb.</p>
              </div>
            </div>
          </div>
        );

      case 'languages':
        return (
          <div className="space-y-6">
            {cvData.languages.map((lang, index) => (
              <Card key={lang.id} className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {index + 1}. Dil Bilgisi
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newLanguages = [...cvData.languages];
                        newLanguages.splice(index, 1);
                        setCvData({ ...cvData, languages: newLanguages });
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor={`lang-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Dil
                      </Label>
                      <Input
                        id={`lang-name-${index}`}
                        value={lang.name}
                        onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                        placeholder="Örn: İngilizce, Almanca, İspanyolca"
                        className="w-full"
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor={`lang-level-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Seviye
                      </Label>
                      <Select
                        value={lang.level}
                        onValueChange={(value: string) => handleLanguageChange(index, 'level', value)}
                      >
                        <SelectTrigger id={`lang-level-${index}`} className="w-full">
                          <SelectValue placeholder="Seviye seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A1">A1 - Başlangıç</SelectItem>
                          <SelectItem value="A2">A2 - Temel</SelectItem>
                          <SelectItem value="B1">B1 - Orta Altı</SelectItem>
                          <SelectItem value="B2">B2 - Orta</SelectItem>
                          <SelectItem value="C1">C1 - İleri</SelectItem>
                          <SelectItem value="C2">C2 - Profesyonel</SelectItem>
                          <SelectItem value="Native">Ana Dil</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="mt-1 text-xs text-gray-500">
                        Dil seviyenizi Avrupa Dil Portfolyosu (CEFR) standartlarına göre seçin
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <Button
              onClick={() => {
                setCvData({
                  ...cvData,
                  languages: [
                    ...cvData.languages,
                    {
                      id: Date.now().toString(),
                      name: '',
                      level: 'A1'
                    }
                  ]
                });
              }}
              className="w-full flex items-center justify-center bg-blue-50 border-dashed border-2 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Yeni Dil Bilgisi Ekle
            </Button>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            {cvData.achievements.map((achievement, index) => (
              <Card key={achievement.id} className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {index + 1}. Başarı / Ödül
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newAchievements = [...cvData.achievements];
                        newAchievements.splice(index, 1);
                        setCvData({ ...cvData, achievements: newAchievements });
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor={`achievement-title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Başlık
                    </Label>
                    <Input
                      id={`achievement-title-${index}`}
                      value={achievement.title}
                      onChange={(e) => {
                        const newAchievements = [...cvData.achievements];
                        newAchievements[index] = { ...achievement, title: e.target.value };
                        setCvData({ ...cvData, achievements: newAchievements });
                      }}
                      placeholder="Başarınızın veya ödülünüzün adı"
                      className="w-full"
                    />
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor={`achievement-desc-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama
                    </Label>
                    <Textarea
                      id={`achievement-desc-${index}`}
                      value={achievement.description}
                      onChange={(e) => {
                        const newAchievements = [...cvData.achievements];
                        newAchievements[index] = { ...achievement, description: e.target.value };
                        setCvData({ ...cvData, achievements: newAchievements });
                      }}
                      placeholder="Başarınızı kısaca açıklayın"
                      className="min-h-[100px] resize-y w-full"
                    />
                  </div>
                </div>
              </Card>
            ))}
            
            <Button
              onClick={() => {
                setCvData({
                  ...cvData,
                  achievements: [
                    ...cvData.achievements,
                    {
                      id: Date.now().toString(),
                      title: '',
                      description: ''
                    }
                  ]
                });
              }}
              className="w-full flex items-center justify-center bg-blue-50 border-dashed border-2 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Yeni Başarı / Ödül Ekle
            </Button>
          </div>
        );

      case 'certificates':
        return (
          <div className="space-y-6">
            {cvData.certificates.map((cert, index) => (
              <Card key={cert.id} className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
                <div className="space-y-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">
                      {index + 1}. Sertifika / Kurs
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newCertificates = [...cvData.certificates];
                        newCertificates.splice(index, 1);
                        setCvData({ ...cvData, certificates: newCertificates });
                      }}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <Label htmlFor={`cert-name-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Sertifika / Kurs Adı
                      </Label>
                      <Input
                        id={`cert-name-${index}`}
                        value={cert.name}
                        onChange={(e) => {
                          const newCertificates = [...cvData.certificates];
                          newCertificates[index] = { ...cert, name: e.target.value };
                          setCvData({ ...cvData, certificates: newCertificates });
                        }}
                        placeholder="Sertifikanın veya kursun adı"
                        className="w-full"
                      />
                    </div>
                    <div className="form-group">
                      <Label htmlFor={`cert-issuer-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Veren Kurum
                      </Label>
                      <Input
                        id={`cert-issuer-${index}`}
                        value={cert.issuer}
                        onChange={(e) => {
                          const newCertificates = [...cvData.certificates];
                          newCertificates[index] = { ...cert, issuer: e.target.value };
                          setCvData({ ...cvData, certificates: newCertificates });
                        }}
                        placeholder="Sertifikayı veren kurum/organizasyon"
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor={`cert-date-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Tarih
                    </Label>
                    <Input
                      id={`cert-date-${index}`}
                      type="date"
                      value={cert.date}
                      onChange={(e) => {
                        const newCertificates = [...cvData.certificates];
                        newCertificates[index] = { ...cert, date: e.target.value };
                        setCvData({ ...cvData, certificates: newCertificates });
                      }}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="form-group">
                    <Label htmlFor={`cert-desc-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Açıklama (Opsiyonel)
                    </Label>
                    <Textarea
                      id={`cert-desc-${index}`}
                      value={cert.description || ''}
                      onChange={(e) => {
                        const newCertificates = [...cvData.certificates];
                        newCertificates[index] = { ...cert, description: e.target.value };
                        setCvData({ ...cvData, certificates: newCertificates });
                      }}
                      placeholder="Sertifika veya kurs hakkında kısa bilgi"
                      className="min-h-[100px] resize-y w-full"
                    />
                  </div>
                </div>
              </Card>
            ))}
            
            <Button
              onClick={() => {
                setCvData({
                  ...cvData,
                  certificates: [
                    ...cvData.certificates,
                    {
                      id: Date.now().toString(),
                      name: '',
                      issuer: '',
                      date: '',
                      description: ''
                    }
                  ]
                });
              }}
              className="w-full flex items-center justify-center bg-blue-50 border-dashed border-2 border-blue-200 text-blue-600 hover:bg-blue-100 hover:border-blue-300"
            >
              <Plus className="h-5 w-5 mr-2" />
              Yeni Sertifika / Kurs Ekle
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Hata</h3>
        <p className="text-gray-500">{error}</p>
        <Button onClick={handleBack} className="mt-4">
          Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Basit ve Kullanıcı Dostu Başlık */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button 
                onClick={handleBack} 
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeftIcon /> 
                <span className="ml-2">Geri Dön</span>
              </button>
              <h1 className="ml-4 text-xl font-bold text-gray-900">CV Düzenle</h1>
            </div>
            <div>
              <Button 
                onClick={handleSave} 
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Ana Düzenleme Alanı */}
          <div className="lg:col-span-5 space-y-8">
            {/* Bölüm Seçici */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">CV Bölümleri</h2>
              </div>
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1 p-2">
                  {steps.map(step => (
                    <button
                      key={step.id}
                      className={`
                        flex flex-col items-center justify-center p-3 rounded-lg transition-colors
                        ${currentStep === step.id 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                      onClick={() => setCurrentStep(step.id)}
                    >
                      <div className={`p-2 rounded-full ${currentStep === step.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        {getStepIcon(step.id)}
                      </div>
                      <span className="mt-1 text-sm font-medium">{step.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Form İçeriği */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  {steps.find(step => step.id === currentStep)?.title}
                </h2>
                <div className="space-y-6">
                  {renderStepContent()}
                </div>
              </div>
            </div>
          </div>

          {/* Önizleme Alanı */}
          <div className="lg:col-span-7 relative">
            {/* Önizleme Kontrolleri */}
            <div className="bg-white shadow rounded-lg mb-4">
              <div className="p-4 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">Önizleme</h2>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {isZoomed ? (
                      <>
                        <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        Küçült
                      </>
                    ) : (
                      <>
                        <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Büyüt
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => window.open(`/api/cv-preview?templateId=${templateId}&content=${encodeURIComponent(JSON.stringify(cvData))}`, '_blank')}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm2-2h8v10H6V3z" clipRule="evenodd" />
                    </svg>
                    Tam Ekran
                  </button>
                </div>
              </div>
            </div>

            {/* CV Görüntüleme Alanı */}
            <div className="overflow-auto bg-gray-100 rounded-lg border border-gray-200 shadow-inner">
              <div className="min-h-[600px] flex items-center justify-center p-4">
                <div
                  className={`
                    transform transition-all duration-300 
                    ${isZoomed ? 'scale-90' : 'scale-75'} 
                    origin-top bg-white shadow-lg
                  `}
                >
                  <TemplatePreview cvData={cvData} templateId={templateId || ''} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}