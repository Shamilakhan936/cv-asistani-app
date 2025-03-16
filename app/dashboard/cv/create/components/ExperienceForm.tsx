'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash2, GripVertical, Calendar, Building2, MapPin } from "lucide-react";

// Experience arayüzü
interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

interface ExperienceFormProps {
  data: Experience[];
  updateData: (data: Experience[]) => void;
}

export default function ExperienceForm({ data, updateData }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(data);

  // Prop'taki veriler değişirse state'i güncelle
  useEffect(() => {
    setExperiences(data);
  }, [data]);

  // Deneyim ekle
  const addExperience = () => {
    const newExperience = {
      title: '',
      company: '',
      period: '',
      location: '',
      responsibilities: ['']
    };
    
    setExperiences(prev => [...prev, newExperience]);
    // Yeni veriyi hemen ana bileşene gönderiyoruz
    updateData([...experiences, newExperience]);
  };

  // Deneyim sil
  const removeExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
    updateData(newExperiences);
  };

  // Deneyim bilgilerini güncelle
  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    const newExperiences = [...experiences];
    newExperiences[index] = { 
      ...newExperiences[index], 
      [field]: value 
    };
    setExperiences(newExperiences);
    updateData(newExperiences);
  };

  // Deneyime sorumluluk ekle
  const addResponsibility = (experienceIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[experienceIndex].responsibilities.push('');
    setExperiences(newExperiences);
    updateData(newExperiences);
  };

  // Deneyimden sorumluluk sil
  const removeResponsibility = (experienceIndex: number, responsibilityIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[experienceIndex].responsibilities.splice(responsibilityIndex, 1);
    setExperiences(newExperiences);
    updateData(newExperiences);
  };

  // Sorumluluk güncelle
  const updateResponsibility = (experienceIndex: number, responsibilityIndex: number, value: string) => {
    const newExperiences = [...experiences];
    newExperiences[experienceIndex].responsibilities[responsibilityIndex] = value;
    setExperiences(newExperiences);
    updateData(newExperiences);
  };

  return (
    <div className="space-y-8">
      {experiences.map((experience, index) => (
        <Card key={index} className="p-6 relative">
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 cursor-move opacity-30 hover:opacity-100">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Deneyim #{index + 1}</h3>
            {experiences.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Sil</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor={`title-${index}`} className="text-base font-medium">
                Pozisyon <span className="text-red-500">*</span>
              </Label>
              <Input
                id={`title-${index}`}
                value={experience.title}
                onChange={(e) => updateExperience(index, 'title', e.target.value)}
                placeholder="Örn: Senior Yazılım Geliştirici"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor={`company-${index}`} className="text-base font-medium">
                Şirket <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id={`company-${index}`}
                  value={experience.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Örn: ABC Teknoloji"
                  className="pl-10"
                />
                <Building2 className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <Label htmlFor={`period-${index}`} className="text-base font-medium">
                Tarih Aralığı <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id={`period-${index}`}
                  value={experience.period}
                  onChange={(e) => updateExperience(index, 'period', e.target.value)}
                  placeholder="Örn: 01/2018 - Günümüz"
                  className="pl-10"
                />
                <Calendar className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <Label htmlFor={`location-${index}`} className="text-base font-medium">
                Konum
              </Label>
              <div className="relative mt-1">
                <Input
                  id={`location-${index}`}
                  value={experience.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  placeholder="Örn: İstanbul, Türkiye"
                  className="pl-10"
                />
                <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="mb-2">
            <Label className="text-base font-medium">
              Sorumluluklar ve Başarılar
            </Label>
            <p className="text-sm text-gray-500 mt-1 mb-3">
              Yaptığınız işleri, sorumlulukları ve elde ettiğiniz başarıları maddeler halinde belirtin.
            </p>
            
            <div className="space-y-3">
              {experience.responsibilities.map((responsibility, respIndex) => (
                <div key={respIndex} className="flex items-start gap-2">
                  <div className="flex-grow relative">
                    <Input
                      value={responsibility}
                      onChange={(e) => updateResponsibility(index, respIndex, e.target.value)}
                      placeholder={`Örn: ${respIndex + 1}. sorumluluk veya başarı`}
                      className="pr-10"
                    />
                  </div>
                  {experience.responsibilities.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeResponsibility(index, respIndex)}
                      className="h-10 w-10 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addResponsibility(index)}
              className="mt-3"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              <span>Sorumluluk Ekle</span>
            </Button>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addExperience}
        className="w-full py-6 border-dashed border-2"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        <span>Deneyim Ekle</span>
      </Button>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>İpucu:</strong> Deneyimlerinizi kronolojik sırayla, en yeniden başlayarak listelemek en iyi uygulamadır.
          Her rolünüzde elde ettiğiniz somut başarıları vurgulamayı unutmayın.
        </p>
      </Card>
    </div>
  );
} 