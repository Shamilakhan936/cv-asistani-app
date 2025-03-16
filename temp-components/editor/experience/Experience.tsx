import React, { ChangeEvent, Fragment, useCallback } from 'react';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from '../../../components/ui/checkbox';

interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string[];
}

interface ExperienceProps {
  experienceInfo: ExperienceItem;
  currentIndex: number;
  onChangeHandler: (index: number, field: keyof ExperienceItem, value: string | boolean | string[]) => void;
}

const Experience: React.FC<ExperienceProps> = ({ experienceInfo, currentIndex, onChangeHandler }) => {
  const handleChange = useCallback(
    (name: keyof ExperienceItem, value: string | boolean | string[]) => {
      onChangeHandler(currentIndex, name, value);
    },
    [currentIndex, onChangeHandler]
  );

  return (
    <Fragment>
      <div className="space-y-4">
        <div className="form-group">
          <Label htmlFor={`title-${currentIndex}`}>Pozisyon</Label>
          <Input
            id={`title-${currentIndex}`}
            value={experienceInfo.title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange('title', e.target.value);
            }}
            autoComplete="off"
            placeholder="Pozisyon"
            required
            className="mb-4"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor={`company-${currentIndex}`}>Şirket</Label>
          <Input
            id={`company-${currentIndex}`}
            value={experienceInfo.company}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange('company', e.target.value);
            }}
            autoComplete="off"
            placeholder="Şirket"
            required
            className="mb-4"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor={`location-${currentIndex}`}>Konum</Label>
          <Input
            id={`location-${currentIndex}`}
            value={experienceInfo.location}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange('location', e.target.value);
            }}
            autoComplete="off"
            placeholder="Konum"
            className="mb-4"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="form-group">
            <Label htmlFor={`startDate-${currentIndex}`}>Başlangıç Tarihi</Label>
            <Input
              id={`startDate-${currentIndex}`}
              type="month"
              value={experienceInfo.startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleChange('startDate', e.target.value);
              }}
              autoComplete="off"
              required
              className="mb-4"
            />
          </div>
          
          <div className="form-group">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={`current-${currentIndex}`}
                checked={experienceInfo.current}
                onCheckedChange={(checked: boolean) => {
                  handleChange('current', checked);
                }}
              />
              <Label htmlFor={`current-${currentIndex}`}>Halen çalışıyorum</Label>
            </div>
            
            <Input
              id={`endDate-${currentIndex}`}
              type="month"
              value={experienceInfo.current ? '' : experienceInfo.endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                handleChange('endDate', e.target.value);
              }}
              autoComplete="off"
              required={!experienceInfo.current}
              disabled={experienceInfo.current}
              className="mb-4"
            />
          </div>
        </div>
        
        <div className="form-group">
          <Label htmlFor={`description-${currentIndex}`}>Açıklama</Label>
          <div className="space-y-2">
            {experienceInfo.description.map((desc, descIndex) => (
              <Textarea
                key={descIndex}
                id={`description-${currentIndex}-${descIndex}`}
                value={desc}
                onChange={(e) => {
                  const newDescription = [...experienceInfo.description];
                  newDescription[descIndex] = e.target.value;
                  handleChange('description', newDescription);
                }}
                placeholder="İş tanımı"
                className="mb-2"
              />
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Experience; 