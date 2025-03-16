'use client';

import React, { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb, PlusCircle, X } from "lucide-react";

interface SkillsFormProps {
  data: string;
  updateData: (data: string) => void;
}

// Önerilen becerileri kategorilere ayırdık
const SUGGESTED_SKILLS = {
  technical: [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'SQL', 'NoSQL', 
    'Git', 'Docker', 'Azure', 'AWS', 'Express.js', 'MongoDB', 'PostgreSQL',
    'Java', 'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'Flutter', 'Angular', 'Vue.js',
    'HTML5', 'CSS3', 'SASS', 'REST API', 'GraphQL', 'Redux', 'Firebase'
  ],
  design: [
    'UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
    'Sketch', 'InDesign', 'After Effects', 'Responsive Design', 'User Research',
    'Wireframing', 'Prototyping', 'Visual Design', 'Interaction Design'
  ],
  business: [
    'Project Management', 'Agile', 'Scrum', 'Lean', 'Kanban', 'JIRA',
    'Strategic Planning', 'Business Analysis', 'Requirements Gathering',
    'Stakeholder Management', 'Risk Management', 'Budgeting', 'Team Leadership',
    'Presentations', 'SWOT Analysis', 'CRM', 'Digital Marketing'
  ],
  soft: [
    'İletişim', 'Problem Çözme', 'Takım Çalışması', 'Adaptasyon', 'Organizasyon',
    'Zaman Yönetimi', 'Analitik Düşünme', 'Sunum Becerileri', 'Müzakere', 
    'Yaratıcılık', 'Eleştirel Düşünme', 'Liderlik', 'Stres Yönetimi', 'Esneklik',
    'Empati', 'İkna Kabiliyeti', 'İş Etiği', 'Proaktiflik'
  ]
};

export default function SkillsForm({ data, updateData }: SkillsFormProps) {
  const [skills, setSkills] = useState<string>(data);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'technical' | 'design' | 'business' | 'soft'>('technical');

  // Prop'taki veriler değişirse state'i güncelle
  useEffect(() => {
    setSkills(data);
    
    // Eğer veriler virgülle ayrılmış formattaysa, bunları ayrıştır
    if (data && data.includes(',')) {
      const parsedSkills = data
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      setSelectedSkills(parsedSkills);
    }
  }, [data]);

  // Becerileri güncelleme
  const updateSkillsString = (skillsArray: string[]) => {
    const skillsString = skillsArray.join(', ');
    setSkills(skillsString);
    updateData(skillsString);
  };

  // Beceri ekleme
  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      updateSkillsString(newSkills);
      setNewSkill('');
    }
  };

  // Önerilen beceriyi ekleme
  const addSuggestedSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
      updateSkillsString(newSkills);
    }
  };

  // Beceri silme
  const removeSkill = (skill: string) => {
    const newSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(newSkills);
    updateSkillsString(newSkills);
  };

  // Yeni beceri eklerken Enter tuşuna basılırsa
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      addSkill(newSkill.trim());
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex gap-3">
          <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 mb-1">Beceriler Nasıl Yazılmalı?</h3>
            <p className="text-sm text-amber-700">
              Becerileriniz, işverenler tarafından ilk bakışta incelenen önemli bir bölümdür. 
              İş ilanındaki anahtar kelimeleri kullanarak, teknik ve yumuşak becerilerinizi dengeli bir şekilde belirtin.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <Label htmlFor="skills-input" className="text-base font-medium">
          Becerilerinizi Ekleyin
        </Label>
        
        <div className="flex gap-2">
          <Input
            id="skills-input"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Yeni beceri ekleyin ve Enter'a basın"
            className="flex-grow"
          />
          <Button 
            type="button" 
            onClick={() => addSkill(newSkill)}
            disabled={!newSkill.trim()}
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            <span>Ekle</span>
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedSkills.map((skill, index) => (
            <div 
              key={index} 
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border border-gray-200 bg-gray-50 hover:bg-gray-100"
            >
              {skill}
              <button 
                type="button" 
                onClick={() => removeSkill(skill)}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {selectedSkills.length === 0 && (
            <p className="text-sm text-gray-500 italic">Henüz beceri eklenmedi. Beceri eklemek için yukarıdaki alanı kullanın veya aşağıdan önerilen becerileri seçin.</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h3 className="font-medium">Önerilen Beceriler</h3>
          </div>
          
          <div className="p-4">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              <Button 
                type="button"
                variant={activeCategory === 'technical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('technical')}
              >
                Teknik
              </Button>
              <Button 
                type="button"
                variant={activeCategory === 'design' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('design')}
              >
                Tasarım
              </Button>
              <Button 
                type="button"
                variant={activeCategory === 'business' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('business')}
              >
                İş & Yönetim
              </Button>
              <Button 
                type="button"
                variant={activeCategory === 'soft' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory('soft')}
              >
                Yumuşak Beceriler
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_SKILLS[activeCategory].map((skill, index) => (
                <div 
                  key={index} 
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border cursor-pointer ${
                    selectedSkills.includes(skill) 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                  onClick={() => addSuggestedSkill(skill)}
                >
                  {skill}
                  {!selectedSkills.includes(skill) && (
                    <PlusCircle className="h-3 w-3 ml-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Label htmlFor="skills-textarea" className="text-base font-medium">
          Tüm Beceriler (virgülle ayrılmış)
        </Label>
        <Textarea
          id="skills-textarea"
          value={skills}
          onChange={(e) => {
            setSkills(e.target.value);
            updateData(e.target.value);
          }}
          placeholder="JavaScript, React, Node.js, Proje Yönetimi, İletişim, Problem Çözme..."
          className="min-h-[100px] resize-y mt-2"
        />
        <p className="text-sm text-gray-500 mt-2">
          Not: Yukarıdaki etkileşimli beceri ekleme alanı veya bu metin alanını kullanarak becerilerinizi düzenleyebilirsiniz.
        </p>
      </div>
    </div>
  );
} 