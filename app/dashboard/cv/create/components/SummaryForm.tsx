'use client';

import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";

interface SummaryFormProps {
  data: string;
  updateData: (data: string) => void;
}

export default function SummaryForm({ data, updateData }: SummaryFormProps) {
  const [summary, setSummary] = useState<string>(data);
  const [charCount, setCharCount] = useState<number>(0);
  const MAX_CHARS = 500;

  // Prop'taki veriler değişirse state'i güncelle
  useEffect(() => {
    setSummary(data);
    setCharCount(data.length);
  }, [data]);

  // Form verilerini güncelleme fonksiyonu
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (newValue.length <= MAX_CHARS) {
      setSummary(newValue);
      setCharCount(newValue.length);
    }
  };

  // Form verilerini ana bileşene gönderme
  const handleBlur = () => {
    updateData(summary);
  };

  // Karakter sayısı limitinin yüzdesini hesaplama
  const charPercentage = (charCount / MAX_CHARS) * 100;
  const isAlmostFull = charPercentage > 80;
  const isFull = charPercentage >= 100;

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <InfoIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 mb-1">Özet Nasıl Yazılmalı?</h3>
            <p className="text-sm text-amber-700">
              Özetiniz, CV'nizin en önemli kısımlarından biridir. Burada kendinizdeki öne çıkan becerileri, 
              deneyimleri ve kariyer hedeflerinizi kısaca belirtin. İş ilanındaki anahtar kelimeleri kullanmaya çalışın.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="summary" className="text-base font-medium">
            Profesyonel Özet
          </Label>
          <span className={`text-sm ${isFull ? 'text-red-500 font-medium' : isAlmostFull ? 'text-amber-500' : 'text-gray-500'}`}>
            {charCount}/{MAX_CHARS}
          </span>
        </div>
        
        <Textarea
          id="summary"
          value={summary}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Kendinizi, deneyimlerinizi ve becerilerinizi kısaca özetleyin..."
          className="min-h-[200px] resize-y"
        />

        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full ${isFull ? 'bg-red-500' : isAlmostFull ? 'bg-amber-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(charPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-3">Örnek Özetler</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4 py-1">
            <p className="text-sm text-gray-600 italic">
              "10 yıllık yazılım geliştirme deneyimine sahip, müşteri odaklı ve sonuç odaklı bir Senior Full Stack Developer. 
              Çevik metodolojilerle büyük ölçekli web uygulamaları geliştirmede uzmanlık. JavaScript, React, Node.js ve 
              PostgreSQL alanlarında güçlü teknik beceriler."
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4 py-1">
            <p className="text-sm text-gray-600 italic">
              "Lojistik ve tedarik zinciri yönetiminde 5 yıllık deneyime sahip, veri odaklı bir Operasyon Müdürü. 
              Süreç iyileştirme ve ekip yönetimi konularında kanıtlanmış başarı geçmişi. Maliyet azaltma ve verimlilik 
              artırma projeleriyle şirket karlılığına önemli katkılar sağladım."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 