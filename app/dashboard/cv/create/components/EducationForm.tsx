'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash2, GripVertical, Calendar, Building2, MapPin, BookOpen } from "lucide-react";

// Education arayüzü
interface Education {
  degree: string;
  university: string;
  location: string;
  duration: string;
}

interface EducationFormProps {
  data: Education[];
  updateData: (data: Education[]) => void;
}

export default function EducationForm({ data, updateData }: EducationFormProps) {
  const [educationList, setEducationList] = useState<Education[]>(data);

  // Prop'taki veriler değişirse state'i güncelle
  useEffect(() => {
    setEducationList(data);
  }, [data]);

  // Eğitim ekle
  const addEducation = () => {
    const newEducation = {
      degree: '',
      university: '',
      location: '',
      duration: ''
    };
    
    setEducationList(prev => [...prev, newEducation]);
    // Yeni veriyi hemen ana bileşene gönderiyoruz
    updateData([...educationList, newEducation]);
  };

  // Eğitim sil
  const removeEducation = (index: number) => {
    const newEducationList = [...educationList];
    newEducationList.splice(index, 1);
    setEducationList(newEducationList);
    updateData(newEducationList);
  };

  // Eğitim bilgilerini güncelle
  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const newEducationList = [...educationList];
    newEducationList[index] = { 
      ...newEducationList[index], 
      [field]: value 
    };
    setEducationList(newEducationList);
    updateData(newEducationList);
  };

  return (
    <div className="space-y-8">
      {educationList.map((education, index) => (
        <Card key={index} className="p-6 relative">
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 cursor-move opacity-30 hover:opacity-100">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Eğitim #{index + 1}</h3>
            {educationList.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Sil</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor={`degree-${index}`} className="text-base font-medium">
                Derece / Bölüm <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id={`degree-${index}`}
                  value={education.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Örn: Bilgisayar Mühendisliği Lisans"
                  className="pl-10"
                />
                <BookOpen className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <Label htmlFor={`university-${index}`} className="text-base font-medium">
                Okul / Üniversite <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id={`university-${index}`}
                  value={education.university}
                  onChange={(e) => updateEducation(index, 'university', e.target.value)}
                  placeholder="Örn: İstanbul Teknik Üniversitesi"
                  className="pl-10"
                />
                <Building2 className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <Label htmlFor={`duration-${index}`} className="text-base font-medium">
                Tarih Aralığı <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id={`duration-${index}`}
                  value={education.duration}
                  onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                  placeholder="Örn: 2016 - 2020"
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
                  value={education.location}
                  onChange={(e) => updateEducation(index, 'location', e.target.value)}
                  placeholder="Örn: İstanbul, Türkiye"
                  className="pl-10"
                />
                <MapPin className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full py-6 border-dashed border-2"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        <span>Eğitim Ekle</span>
      </Button>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>İpucu:</strong> Eğitim bilgilerinizi en son tamamladığınız okuldan başlayarak sıralayın. 
          Lisans ve üzeri eğitiminizi mutlaka ekleyin. İlk ve orta öğretim bilgilerinizi eklemek isteğe bağlıdır.
        </p>
      </Card>
    </div>
  );
} 