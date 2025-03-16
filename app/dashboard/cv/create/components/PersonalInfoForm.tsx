'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

// PersonalInfo arayüzü
interface PersonalInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
}

interface PersonalInfoFormProps {
  data: PersonalInfo;
  updateData: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({ data, updateData }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfo>(data);
  const [errors, setErrors] = useState<Partial<PersonalInfo>>({});

  // Prop'taki veriler değişirse state'i güncelle
  useEffect(() => {
    setFormData(data);
  }, [data]);

  // Form verilerini güncelleme fonksiyonu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Hata varsa temizle
    if (errors[name as keyof PersonalInfo]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validasyon yapma fonksiyonu
  const validateForm = (): boolean => {
    const newErrors: Partial<PersonalInfo> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ad alanı zorunludur';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    if (formData.phone && !/^[+\d\s()-]{7,}$/.test(formData.phone)) {
      newErrors.phone = 'Geçerli bir telefon numarası giriniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form verilerini ana bileşene gönderme
  const handleBlur = () => {
    if (validateForm()) {
      updateData(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 border-2 border-gray-200 rounded-full flex items-center justify-center bg-gray-100 overflow-hidden">
            <img 
              src="/images/avatar.jpg" 
              alt="Profil" 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSI+PHBhdGggZD0iTTIxIDEyYTkgOSAwIDExLTE4IDAgOSA5IDAgMDExOCAweiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiLz48cGF0aCBkPSJNMTIgOHY0bDIgMiIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiLz48L3N2Zz4=';
              }}
            />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="text-lg font-medium mb-2">Profil Fotoğrafı</h3>
          <p className="text-sm text-gray-500 mb-4">
            CV'niz için bir profil fotoğrafı yükleyin. Profesyonel bir görünüm için yüzünüzün net göründüğü bir fotoğraf tercih edin.
          </p>
          <div className="flex gap-2">
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <UploadCloud size={16} />
              Fotoğraf Yükle
            </button>
            <button 
              type="button" 
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Kaldır
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-base font-medium">
              Adınız Soyadınız <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              placeholder="Adınız Soyadınız"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="title" className="text-base font-medium">
              Unvan / Pozisyon
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="Örn: Senior Yazılım Geliştirici"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-medium">
              E-posta <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="ornek@mail.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="phone" className="text-base font-medium">
              Telefon
            </Label>
            <Input
              id="phone"
              name="phone"
              placeholder="+90 (555) 123 4567"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <Label htmlFor="linkedin" className="text-base font-medium">
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              name="linkedin"
              placeholder="linkedin.com/in/kullanici-adi"
              value={formData.linkedin}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-base font-medium">
              Konum
            </Label>
            <Input
              id="location"
              name="location"
              placeholder="İstanbul, Türkiye"
              value={formData.location}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>İpucu:</strong> İletişim bilgileriniz, potansiyel işverenler için önemlidir. E-posta adresinizi profesyonel tutmaya özen gösterin.
        </p>
      </Card>
    </div>
  );
} 