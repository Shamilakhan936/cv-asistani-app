'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

// CV veri tipi tanımı
interface CVData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    level: number;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  courses: Array<{
    id: string;
    title: string;
    description: string;
    institution: string;
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}

// Boş CV verisi
const emptyCVData: CVData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  achievements: [],
  courses: [],
  languages: [],
};

export default function CreateCVPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [cvData, setCVData] = useState<CVData>({
    ...emptyCVData,
    experience: emptyCVData.experience.filter(exp => 
      !(exp.title === "Senior Business Analyst" && 
        exp.company === "Genentech" && 
        exp.location === "South San Francisco, CA")
    )
  });
  const [saving, setSaving] = useState(false);
  const [cvTitle, setCvTitle] = useState('');
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!templateId) {
      toast.error('Şablon ID\'si bulunamadı');
      router.push('/cv/templates');
      return;
    }

    const fetchTemplate = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cv-templates/${templateId}`);
        if (!response.ok) {
          throw new Error('Şablon yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setTemplate(data.template);
        // CV başlığını şablon adıyla başlat
        setCvTitle(`${data.template.name} CV`);
        
        // Template verisi yüklendiğinde deneyimi filtrele
        if (data.template.content?.experience) {
          const filteredExperience = data.template.content.experience.filter(
            (exp: any) => !(
              exp.title === "Senior Business Analyst" && 
              exp.company === "Genentech" && 
              exp.location === "South San Francisco, CA"
            )
          );
          setCVData(prev => ({
            ...prev,
            experience: filteredExperience
          }));
        }
      } catch (error) {
        console.error('Error fetching template:', error);
        toast.error('Şablon yüklenirken bir hata oluştu');
        router.push('/cv/templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplate();
  }, [templateId, router]);

  useEffect(() => {
    const textarea = summaryRef.current;
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      };
      
      textarea.addEventListener('input', adjustHeight);
      adjustHeight(); // Initial adjustment
      
      return () => textarea.removeEventListener('input', adjustHeight);
    }
  }, []);

  // Form değişikliklerini işle
  const handlePersonalChange = (field: string, value: string) => {
    setCVData({
      ...cvData,
      personal: {
        ...cvData.personal,
        [field]: value,
      },
    });
  };

  const handleSummaryChange = (value: string) => {
    setCVData(prev => ({
      ...prev,
      summary: value
    }));
  };

  const handleExperienceChange = (
    index: number,
    field: keyof typeof cvData.experience[0],
    value: string | boolean | string[]
  ) => {
    setCVData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // CV'yi kaydet
  const handleSaveCV = async () => {
    try {
      // Temel doğrulama
      if (!cvData.personal.fullName) {
        toast.error('Lütfen ad soyad bilgisini doldurun');
        setActiveTab('personal');
        return;
      }

      if (!cvTitle) {
        toast.error('Lütfen CV başlığını girin');
        return;
      }

      setSaving(true);
      
      const response = await fetch('/api/cvs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: cvTitle,
          templateId,
          content: cvData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'CV kaydedilirken bir hata oluştu');
      }

      const data = await response.json();
      toast.success('CV başarıyla kaydedildi');
      
      // Başarılı kayıttan sonra dashboard'a yönlendir
      router.push('/dashboard/cvs');
    } catch (error) {
      console.error('Error saving CV:', error);
      toast.error(error instanceof Error ? error.message : 'CV kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">CV Oluşturuluyor...</h1>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Şablon Bulunamadı</h1>
        <p className="text-gray-600 mb-4">Seçtiğiniz şablon bulunamadı veya artık mevcut değil.</p>
        <Button onClick={() => router.push('/cv/templates')}>
          Şablonlara Geri Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">CV Oluştur: {template.name}</h1>
      
      <div className="mb-6">
        <Label htmlFor="cv-title">CV Başlığı</Label>
        <Input
          id="cv-title"
          value={cvTitle}
          onChange={(e) => setCvTitle(e.target.value)}
          placeholder="CV'niz için bir başlık girin"
          className="max-w-md"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-8 w-full justify-start overflow-x-auto">
                  <TabsTrigger value="personal">Kişisel Bilgiler</TabsTrigger>
                  <TabsTrigger value="summary">Hakkımda</TabsTrigger>
                  <TabsTrigger value="experience">İş Deneyimi</TabsTrigger>
                  <TabsTrigger value="education">Eğitim</TabsTrigger>
                  <TabsTrigger value="skills">Yetenekler</TabsTrigger>
                  <TabsTrigger value="achievements">Başarılar</TabsTrigger>
                  <TabsTrigger value="courses">Kurslar</TabsTrigger>
                  <TabsTrigger value="languages">Diller</TabsTrigger>
                </TabsList>

                {/* Kişisel Bilgiler Formu */}
                <TabsContent value="personal" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Kişisel Bilgiler</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Ad Soyad</Label>
                      <Input
                        id="fullName"
                        value={cvData.personal.fullName}
                        onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta</Label>
                      <Input
                        id="email"
                        type="email"
                        value={cvData.personal.email}
                        onChange={(e) => handlePersonalChange('email', e.target.value)}
                        placeholder="E-posta adresiniz"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        value={cvData.personal.phone}
                        onChange={(e) => handlePersonalChange('phone', e.target.value)}
                        placeholder="Telefon numaranız"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Adres</Label>
                      <Input
                        id="address"
                        value={cvData.personal.address}
                        onChange={(e) => handlePersonalChange('address', e.target.value)}
                        placeholder="Adresiniz"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Web Sitesi</Label>
                      <Input
                        id="website"
                        value={cvData.personal.website}
                        onChange={(e) => handlePersonalChange('website', e.target.value)}
                        placeholder="Web siteniz veya LinkedIn profiliniz"
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Özet Formu */}
                <TabsContent value="summary" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Hakkımda</h2>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Kendinizi kısaca tanıtın</Label>
                    <Textarea
                      id="summary"
                      placeholder="Profesyonel deneyiminizi, becerilerinizi ve kariyer hedeflerinizi özetleyin"
                      value={cvData.summary}
                      onChange={(e) => handleSummaryChange(e.target.value)}
                      className="min-h-[200px] w-full resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      İpucu: Özet bölümü, CV'nizin en önemli kısımlarından biridir. Burada kendinizi kısaca tanıtın ve neden bu pozisyon için uygun olduğunuzu belirtin.
                    </p>
                  </div>
                </TabsContent>

                {/* İş Deneyimi Formu */}
                <TabsContent value="experience" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">İş Deneyimi</h2>
                  <p className="text-gray-600 mb-6">
                    İş deneyimlerinizi kronolojik sırayla ekleyin. En son deneyiminizden başlayın.
                  </p>
                  
                  {cvData.experience
                    .filter(exp => !(
                      exp.title === "Senior Business Analyst" && 
                      exp.company === "Genentech" && 
                      exp.location === "South San Francisco, CA"
                    ))
                    .length > 0 ? (
                    <div className="space-y-6">
                      {cvData.experience
                        .filter(exp => !(
                          exp.title === "Senior Business Analyst" && 
                          exp.company === "Genentech" && 
                          exp.location === "South San Francisco, CA"
                        ))
                        .map((exp, index) => (
                        <div key={exp.id} className="p-4 border rounded-md">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor={`title-${index}`}>Pozisyon</Label>
                              <Input
                                id={`title-${index}`}
                                value={exp.title}
                                onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                                placeholder="Pozisyon adı"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`company-${index}`}>Şirket</Label>
                              <Input
                                id={`company-${index}`}
                                value={exp.company}
                                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                                placeholder="Şirket adı"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor={`location-${index}`}>Konum</Label>
                              <Input
                                id={`location-${index}`}
                                value={exp.location}
                                onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                                placeholder="Şehir, Ülke"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                              <Label htmlFor={`startDate-${index}`}>Başlangıç Tarihi</Label>
                              <Input
                                type="month"
                                id={`startDate-${index}`}
                                value={exp.startDate}
                                onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`endDate-${index}`}>Bitiş Tarihi</Label>
                              <Input
                                type="month"
                                id={`endDate-${index}`}
                                value={exp.current ? '' : exp.endDate}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleExperienceChange(index, 'endDate', value);
                                  handleExperienceChange(index, 'current', !value);
                                }}
                                placeholder="Boş bırakırsanız devam ediyor olarak işaretlenir"
                                className={exp.current ? "bg-gray-100" : ""}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`description-${index}`}>Açıklama</Label>
                            <div className="space-y-2">
                              {exp.description.map((desc, descIndex) => (
                                <div key={descIndex} className="flex gap-2">
                                  <Input
                                    value={desc}
                                    onChange={(e) => {
                                      const newDescription = [...exp.description];
                                      newDescription[descIndex] = e.target.value;
                                      handleExperienceChange(index, 'description', newDescription);
                                    }}
                                    placeholder="İş tanımı"
                                  />
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => {
                                      const newDescription = exp.description.filter((_, i) => i !== descIndex);
                                      handleExperienceChange(index, 'description', newDescription);
                                    }}
                                  >
                                    <TrashIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const newDescription = [...exp.description, ''];
                                handleExperienceChange(index, 'description', newDescription);
                              }}
                            >
                              <PlusIcon className="h-4 w-4 mr-2" />
                              Yeni Açıklama Ekle
                            </Button>
                          </div>

                          <div className="mt-4 flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const newExperience = cvData.experience.filter((_, i) => i !== index);
                                setCVData(prev => ({
                                  ...prev,
                                  experience: newExperience
                                }));
                              }}
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Deneyimi Sil
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-gray-300 rounded-md text-center">
                      <p className="text-gray-500 mb-2">Henüz iş deneyimi eklenmedi</p>
                      <Button
                        onClick={() => {
                          const newExperience = {
                            id: Date.now().toString(),
                            title: '',
                            company: '',
                            location: '',
                            startDate: '',
                            endDate: '',
                            current: true,
                            description: ['']
                          };
                          setCVData(prev => ({
                            ...prev,
                            experience: [...prev.experience, newExperience]
                          }));
                        }}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        İş Deneyimi Ekle
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Eğitim Formu */}
                <TabsContent value="education" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Eğitim Bilgileri</h2>
                  <p className="text-gray-600 mb-6">
                    Eğitim bilgilerinizi kronolojik sırayla ekleyin. En son eğitiminizden başlayın.
                  </p>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-gray-500 mb-2">Henüz eğitim bilgisi eklenmedi</p>
                    <Button>Eğitim Bilgisi Ekle</Button>
                  </div>
                </TabsContent>

                {/* Yetenekler Formu */}
                <TabsContent value="skills" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Yetenekler</h2>
                  <p className="text-gray-600 mb-6">
                    Teknik ve kişisel yeteneklerinizi ekleyin.
                  </p>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-gray-500 mb-2">Henüz yetenek eklenmedi</p>
                    <Button>Yetenek Ekle</Button>
                  </div>
                </TabsContent>

                {/* Başarılar Formu */}
                <TabsContent value="achievements" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Başarılar</h2>
                  <p className="text-gray-600 mb-6">
                    Önemli başarılarınızı ve ödüllerinizi ekleyin.
                  </p>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-gray-500 mb-2">Henüz başarı eklenmedi</p>
                    <Button>Başarı Ekle</Button>
                  </div>
                </TabsContent>

                {/* Kurslar Formu */}
                <TabsContent value="courses" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Kurslar ve Sertifikalar</h2>
                  <p className="text-gray-600 mb-6">
                    Aldığınız kursları ve sertifikaları ekleyin.
                  </p>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-gray-500 mb-2">Henüz kurs veya sertifika eklenmedi</p>
                    <Button>Kurs/Sertifika Ekle</Button>
                  </div>
                </TabsContent>

                {/* Diller Formu */}
                <TabsContent value="languages" className="space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Yabancı Diller</h2>
                  <p className="text-gray-600 mb-6">
                    Bildiğiniz yabancı dilleri ve seviyelerini ekleyin.
                  </p>
                  
                  <div className="p-4 border border-dashed border-gray-300 rounded-md text-center">
                    <p className="text-gray-500 mb-2">Henüz dil eklenmedi</p>
                    <Button>Dil Ekle</Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 flex justify-between">
                <Button onClick={() => router.push('/cv/templates')} variant="outline">
                  İptal
                </Button>
                <div className="space-x-2">
                  <Button variant="outline">Önizle</Button>
                  <Button onClick={handleSaveCV} disabled={saving}>
                    {saving ? 'Kaydediliyor...' : 'CV\'yi Kaydet'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Şablon Önizleme</h2>
              <div className="aspect-[1/1.4] relative bg-gray-100 rounded-md overflow-hidden">
                {cvData.personal.fullName ? (
                  <div className="absolute inset-0 p-4 text-xs overflow-auto">
                    <div className="text-center mb-4">
                      <h1 className="text-lg font-bold">{cvData.personal.fullName}</h1>
                      <p>{cvData.personal.email}</p>
                      <div className="flex justify-center space-x-2 mt-1 text-[10px]">
                        {cvData.personal.phone && <span>• {cvData.personal.phone}</span>}
                      </div>
                      {cvData.personal.address && (
                        <p className="text-[10px]">{cvData.personal.address}</p>
                      )}
                    </div>
                    
                    {cvData.summary && (
                      <div className="mb-3">
                        <h2 className="text-xs font-semibold border-b mb-1">HAKKIMDA</h2>
                        <p className="text-[10px]">{cvData.summary}</p>
                      </div>
                    )}
                    
                    {/* Diğer bölümler için yer tutucular */}
                    <div className="text-[10px] text-gray-400 italic">
                      Daha fazla bilgi ekledikçe CV önizlemesi güncellenecektir.
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500 text-center px-4">
                      Kişisel bilgilerinizi girerek CV önizlemesini görüntüleyebilirsiniz
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 