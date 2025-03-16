'use client';

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PlusCircle, Trash2, GripVertical, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Language arayüzü
interface Language {
  name: string;
  level: string;
  filledDots: number;
}

interface LanguagesFormProps {
  data: Language[];
  updateData: (data: Language[]) => void;
}

// Dil seviyesi seçenekleri
const languageLevels = [
  { name: 'Başlangıç', value: 'Başlangıç', dots: 1 },
  { name: 'Temel', value: 'Temel', dots: 2 },
  { name: 'Orta', value: 'Orta', dots: 3 },
  { name: 'İyi', value: 'İyi', dots: 4 },
  { name: 'İleri', value: 'İleri', dots: 5 },
  { name: 'Ana Dil', value: 'Ana Dil', dots: 5 },
];

export default function LanguagesForm({ data, updateData }: LanguagesFormProps) {
  const [languages, setLanguages] = useState<Language[]>(data);

  // Prop'taki veriler değişirse state'i güncelle
  useEffect(() => {
    setLanguages(data);
  }, [data]);

  // Dil ekle
  const addLanguage = () => {
    const newLanguage = {
      name: '',
      level: 'Orta',
      filledDots: 3
    };
    
    setLanguages(prev => [...prev, newLanguage]);
    // Yeni veriyi hemen ana bileşene gönderiyoruz
    updateData([...languages, newLanguage]);
  };

  // Dil sil
  const removeLanguage = (index: number) => {
    const newLanguages = [...languages];
    newLanguages.splice(index, 1);
    setLanguages(newLanguages);
    updateData(newLanguages);
  };

  // Dil adını güncelle
  const updateLanguageName = (index: number, value: string) => {
    const newLanguages = [...languages];
    newLanguages[index] = { 
      ...newLanguages[index], 
      name: value 
    };
    setLanguages(newLanguages);
    updateData(newLanguages);
  };

  // Dil seviyesini güncelle
  const updateLanguageLevel = (index: number, level: string) => {
    const selectedLevel = languageLevels.find(lvl => lvl.value === level);
    const dots = selectedLevel ? selectedLevel.dots : 3;
    
    const newLanguages = [...languages];
    newLanguages[index] = { 
      ...newLanguages[index], 
      level: level,
      filledDots: dots
    };
    setLanguages(newLanguages);
    updateData(newLanguages);
  };

  return (
    <div className="space-y-8">
      <Card className="p-4 bg-amber-50 border-amber-200 mb-6">
        <p className="text-sm text-amber-700">
          <strong>İpucu:</strong> Dil becerileri iş başvurularında önemli bir değer katar. 
          CV'nizde en az bir dil belirtmeniz ve seviyesini doğru şekilde göstermeniz önerilir.
        </p>
      </Card>
      
      {languages.map((language, index) => (
        <Card key={index} className="p-6 relative">
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 cursor-move opacity-30 hover:opacity-100">
            <GripVertical className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Dil #{index + 1}</h3>
            {languages.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeLanguage(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span>Sil</span>
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor={`language-${index}`} className="text-base font-medium">
                Dil <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Input
                  id={`language-${index}`}
                  value={language.name}
                  onChange={(e) => updateLanguageName(index, e.target.value)}
                  placeholder="Örn: İngilizce, Almanca, Fransızca"
                  className="pl-10"
                />
                <Globe className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            <div>
              <Label htmlFor={`level-${index}`} className="text-base font-medium">
                Seviye <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={language.level} 
                onValueChange={(value) => updateLanguageLevel(index, value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seviye seçin" />
                </SelectTrigger>
                <SelectContent>
                  {languageLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <Label className="text-sm text-gray-500">Görsel Seviye</Label>
            <div className="flex mt-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-8 h-2 mx-1 rounded-full ${
                    i < language.filledDots ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addLanguage}
        className="w-full py-6 border-dashed border-2"
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        <span>Dil Ekle</span>
      </Button>
    </div>
  );
} 