'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import PamukkaleTemplate from '@/components/templates/PamukkaleTemplate';
import { CVData } from '@/types/cv';
import { Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return (
          <div className="space-y-4">
            <div className="form-group">
              <Label htmlFor="fullName">Ad Soyad</Label>
              <Input
                id="fullName"
                value={cvData.personal.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                placeholder="Ad Soyad"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="title">Ünvan</Label>
              <Input
                id="title"
                value={cvData.personal.title}
                onChange={(e) => updatePersonalInfo('title', e.target.value)}
                placeholder="Örn: Yazılım Mühendisi"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={cvData.personal.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="E-posta adresiniz"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                value={cvData.personal.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="Telefon numaranız"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="location">Konum</Label>
              <Input
                id="location"
                value={cvData.personal.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                placeholder="Şehir, Ülke"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="website">Web Sitesi</Label>
              <Input
                id="website"
                value={cvData.personal.website}
                onChange={(e) => updatePersonalInfo('website', e.target.value)}
                placeholder="Web siteniz veya portfolyonuz"
              />
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="form-group">
            <Label htmlFor="summary">Profesyonel Özet</Label>
            <Textarea
              id="summary"
              value={cvData.summary}
              onChange={(e) => setCvData({ ...cvData, summary: e.target.value })}
              placeholder="Kendinizi kısaca tanıtın"
              className="h-40"
            />
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-4">
            {cvData.experience.map((exp, index) => (
              <Card key={exp.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{exp.title} at {exp.company}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newExperience = [...cvData.experience];
                        newExperience.splice(index, 1);
                        setCvData({ ...cvData, experience: newExperience });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`exp-title-${index}`}>Pozisyon</Label>
                      <Input
                        id={`exp-title-${index}`}
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                        placeholder="Örn: Yazılım Mühendisi"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`exp-company-${index}`}>Şirket</Label>
                      <Input
                        id={`exp-company-${index}`}
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                        placeholder="Şirket adı"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`exp-location-${index}`}>Konum</Label>
                      <Input
                        id={`exp-location-${index}`}
                        value={exp.location}
                        onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                        placeholder="Şehir, Ülke"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`exp-start-${index}`}>Başlangıç Tarihi</Label>
                      <Input
                        id={`exp-start-${index}`}
                        type="date"
                        value={exp.startDate}
                        onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`exp-end-${index}`}>Bitiş Tarihi</Label>
                      <div className="flex items-center space-x-2 mb-2">
                        <Button
                          type="button"
                          variant={exp.current ? "default" : "outline"}
                          className="h-8"
                          onClick={() => {
                            handleExperienceChange(index, 'current', !exp.current);
                            if (!exp.current) {
                              handleExperienceChange(index, 'endDate', '');
                            }
                          }}
                        >
                          {exp.current ? "Devam Ediyor" : "Devam Ediyor?"}
                        </Button>
                      </div>
                      <Input
                        id={`exp-end-${index}`}
                        type="date"
                        value={exp.endDate}
                        onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                        className={exp.current ? "bg-gray-100" : ""}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`exp-desc-${index}`}>Açıklama</Label>
                    <Textarea
                      id={`exp-desc-${index}`}
                      value={exp.description}
                      onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                      placeholder="Pozisyondaki görev ve sorumluluklarınızı açıklayın"
                      className="h-32"
                    />
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
            >
              <Plus className="h-4 w-4 mr-2" />
              Deneyim Ekle
            </Button>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-4">
            {cvData.education.map((edu, index) => (
              <Card key={edu.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{edu.degree} - {edu.school}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newEducation = [...cvData.education];
                        newEducation.splice(index, 1);
                        setCvData({ ...cvData, education: newEducation });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`edu-degree-${index}`}>Derece</Label>
                      <Input
                        id={`edu-degree-${index}`}
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                        placeholder="Örn: Bilgisayar Mühendisliği"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edu-school-${index}`}>Okul</Label>
                      <Input
                        id={`edu-school-${index}`}
                        value={edu.school}
                        onChange={(e) => handleEducationChange(index, 'school', e.target.value)}
                        placeholder="Okul adı"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edu-location-${index}`}>Konum</Label>
                      <Input
                        id={`edu-location-${index}`}
                        value={edu.location || ''}
                        onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                        placeholder="Şehir, Ülke (opsiyonel)"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edu-start-${index}`}>Başlangıç Tarihi</Label>
                      <Input
                        id={`edu-start-${index}`}
                        type="date"
                        value={edu.startDate}
                        onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`edu-end-${index}`}>Bitiş Tarihi</Label>
                      <Input
                        id={`edu-end-${index}`}
                        type="date"
                        value={edu.endDate}
                        onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`edu-desc-${index}`}>Açıklama</Label>
                    <Textarea
                      id={`edu-desc-${index}`}
                      value={edu.description || ''}
                      onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                      placeholder="Eğitiminiz hakkında ek bilgiler (opsiyonel)"
                      className="h-32"
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
                      startDate: '',
                      endDate: '',
                      description: ''
                    }
                  ]
                });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Eğitim Ekle
            </Button>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Teknik Beceriler</h3>
              {cvData.skills.filter(skill => skill.type === 'hard').map((skill, index) => (
                <div key={skill.id} className="flex items-center space-x-2">
                  <Input
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = [...cvData.skills];
                      const skillIndex = newSkills.findIndex(s => s.id === skill.id);
                      newSkills[skillIndex] = { ...skill, name: e.target.value };
                      setCvData({ ...cvData, skills: newSkills });
                    }}
                    placeholder="Örn: JavaScript, Python, Adobe Photoshop"
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
              >
                <Plus className="h-4 w-4 mr-2" />
                Teknik Beceri Ekle
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Kişisel Beceriler</h3>
              {cvData.skills.filter(skill => skill.type === 'soft').map((skill, index) => (
                <div key={skill.id} className="flex items-center space-x-2">
                  <Input
                    value={skill.name}
                    onChange={(e) => {
                      const newSkills = [...cvData.skills];
                      const skillIndex = newSkills.findIndex(s => s.id === skill.id);
                      newSkills[skillIndex] = { ...skill, name: e.target.value };
                      setCvData({ ...cvData, skills: newSkills });
                    }}
                    placeholder="Örn: İletişim, Takım Çalışması, Problem Çözme"
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
              >
                <Plus className="h-4 w-4 mr-2" />
                Kişisel Beceri Ekle
              </Button>
            </div>
          </div>
        );

      case 'languages':
        return (
          <div className="space-y-4">
            {cvData.languages.map((lang, index) => (
              <Card key={lang.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="grid grid-cols-2 gap-4 flex-1 mr-4">
                      <div>
                        <Label htmlFor={`lang-name-${index}`}>Dil</Label>
                        <Input
                          id={`lang-name-${index}`}
                          value={lang.name}
                          onChange={(e) => handleLanguageChange(index, 'name', e.target.value)}
                          placeholder="Örn: İngilizce"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`lang-level-${index}`}>Seviye</Label>
                        <Select
                          value={lang.level}
                          onValueChange={(value: string) => handleLanguageChange(index, 'level', value)}
                        >
                          <SelectTrigger id={`lang-level-${index}`}>
                            <SelectValue placeholder="Seviye seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A1">A1 - Başlangıç</SelectItem>
                            <SelectItem value="A2">A2 - Temel</SelectItem>
                            <SelectItem value="B1">B1 - Orta Altı</SelectItem>
                            <SelectItem value="B2">B2 - Orta</SelectItem>
                            <SelectItem value="C1">C1 - İleri</SelectItem>
                            <SelectItem value="C2">C2 - Üst Düzey</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
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
            >
              <Plus className="h-4 w-4 mr-2" />
              Dil Ekle
            </Button>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-4">
            {cvData.achievements.map((achievement, index) => (
              <Card key={achievement.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{achievement.title}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newAchievements = [...cvData.achievements];
                        newAchievements.splice(index, 1);
                        setCvData({ ...cvData, achievements: newAchievements });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <Label htmlFor={`achievement-title-${index}`}>Başlık</Label>
                    <Input
                      id={`achievement-title-${index}`}
                      value={achievement.title}
                      onChange={(e) => {
                        const newAchievements = [...cvData.achievements];
                        newAchievements[index] = { ...achievement, title: e.target.value };
                        setCvData({ ...cvData, achievements: newAchievements });
                      }}
                      placeholder="Başarınızın başlığı"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`achievement-desc-${index}`}>Açıklama</Label>
                    <Textarea
                      id={`achievement-desc-${index}`}
                      value={achievement.description}
                      onChange={(e) => {
                        const newAchievements = [...cvData.achievements];
                        newAchievements[index] = { ...achievement, description: e.target.value };
                        setCvData({ ...cvData, achievements: newAchievements });
                      }}
                      placeholder="Başarınızı detaylı olarak açıklayın"
                      className="h-32"
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
            >
              <Plus className="h-4 w-4 mr-2" />
              Başarı Ekle
            </Button>
          </div>
        );

      case 'certificates':
        return (
          <div className="space-y-4">
            {cvData.certificates.map((cert, index) => (
              <Card key={cert.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">{cert.name}</h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newCertificates = [...cvData.certificates];
                        newCertificates.splice(index, 1);
                        setCvData({ ...cvData, certificates: newCertificates });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`cert-name-${index}`}>Sertifika Adı</Label>
                      <Input
                        id={`cert-name-${index}`}
                        value={cert.name}
                        onChange={(e) => {
                          const newCertificates = [...cvData.certificates];
                          newCertificates[index] = { ...cert, name: e.target.value };
                          setCvData({ ...cvData, certificates: newCertificates });
                        }}
                        placeholder="Sertifikanın adı"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cert-issuer-${index}`}>Veren Kurum</Label>
                      <Input
                        id={`cert-issuer-${index}`}
                        value={cert.issuer}
                        onChange={(e) => {
                          const newCertificates = [...cvData.certificates];
                          newCertificates[index] = { ...cert, issuer: e.target.value };
                          setCvData({ ...cvData, certificates: newCertificates });
                        }}
                        placeholder="Sertifikayı veren kurum"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cert-date-${index}`}>Tarih</Label>
                      <Input
                        id={`cert-date-${index}`}
                        type="date"
                        value={cert.date}
                        onChange={(e) => {
                          const newCertificates = [...cvData.certificates];
                          newCertificates[index] = { ...cert, date: e.target.value };
                          setCvData({ ...cvData, certificates: newCertificates });
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`cert-desc-${index}`}>Açıklama</Label>
                    <Textarea
                      id={`cert-desc-${index}`}
                      value={cert.description}
                      onChange={(e) => {
                        const newCertificates = [...cvData.certificates];
                        newCertificates[index] = { ...cert, description: e.target.value };
                        setCvData({ ...cvData, certificates: newCertificates });
                      }}
                      placeholder="Sertifika hakkında ek bilgiler (opsiyonel)"
                      className="h-32"
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
            >
              <Plus className="h-4 w-4 mr-2" />
              Sertifika Ekle
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
      <header className="page-header">
        <div className="header-content">
          <button onClick={handleBack} className="back-button">
            <ArrowLeftIcon />
            <span>Geri Dön</span>
          </button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="save-button"
          >
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </header>

      <div className="cv-edit-container">
        <div className="cv-form-section">
          <nav className="steps-nav">
            {steps.map(step => (
              <button
                key={step.id}
                className={`step-item ${currentStep === step.id ? 'active' : ''}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </button>
            ))}
          </nav>

          <div className="form-section">
            {renderStepContent()}
          </div>
        </div>

        <div className="cv-preview-section">
          <div className="preview-container">
            <div 
              className={`cv-preview ${isZoomed ? 'zoomed' : ''}`}
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <PamukkaleTemplate data={cvData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}