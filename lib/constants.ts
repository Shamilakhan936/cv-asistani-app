// Boş CV verisi
export const emptyCVData = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
  },
  summary: '',
  experience: [] as Array<{
    id: string;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string[];
  }>,
  education: [] as Array<{
    id: string;
    degree: string;
    school: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }>,
  skills: [] as Array<{
    id: string;
    name: string;
    level: number;
  }>,
  achievements: [] as Array<{
    id: string;
    title: string;
    description: string;
  }>,
  courses: [] as Array<{
    id: string;
    title: string;
    description: string;
    institution: string;
  }>,
  languages: [] as Array<{
    id: string;
    name: string;
    level: string;
  }>,
}; 