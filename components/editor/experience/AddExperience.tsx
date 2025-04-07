import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus as PlusIcon } from 'lucide-react';

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


const NEW_EXPERIENCE: Omit<ExperienceItem, 'id'> = {
  title: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: [],
};

interface AddExperienceProps {
  isEmpty: boolean;
  onAddExperience: () => void;
}

const AddExperience = ({ isEmpty, onAddExperience }: AddExperienceProps) => {
  const buttonCaption = useMemo(() => {
    if (isEmpty) {
      return 'Deneyim Ekle';
    } else {
      return 'Yeni Deneyim Ekle';
    }
  }, [isEmpty]);

  return (
    <div className="mt-4">
      <Button 
        variant="outline" 
        onClick={onAddExperience}
        className="flex items-center"
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        {buttonCaption}
      </Button>
    </div>
  );
};

export default AddExperience; 