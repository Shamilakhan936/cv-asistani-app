export interface CVData {
  personal: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
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
    description: string | string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    location?: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  skills: Array<{
    id: string;
    name: string;
    type: 'hard' | 'soft';
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  certificates: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
} 