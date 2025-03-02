import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import type { CVData } from '@/types/cv';

// Kategori çevirileri
const categoryTranslations: Record<string, string> = {
  'All': 'Tümü',
  'Simple': 'Sade',
  'Creative': 'Yaratıcı',
  'Modern': 'Modern',
  'Professional': 'Profesyonel'
};

// Kategori sıralaması
const categoryOrder = ['Tümü', 'Sade', 'Modern', 'Yaratıcı', 'Profesyonel'];

// Örnek şablon verisi
const templateData: CVData = {
  personal: {
    fullName: 'John Doe',
    title: 'Senior Software Engineer',
    email: 'john@example.com',
    phone: '+90 555 123 4567',
    location: 'İstanbul, Türkiye',
    website: 'https://johndoe.dev',
  },
  summary: 'Experienced software engineer with a strong background in web development and a passion for creating user-friendly applications.',
  experience: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'İstanbul',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: 'Leading the development of enterprise web applications using React and Node.js.',
    },
    {
      id: '2',
      title: 'Software Engineer',
      company: 'Digital Solutions',
      location: 'Ankara',
      startDate: '2018-03',
      endDate: '2019-12',
      current: false,
      description: 'Developed and maintained multiple client projects using modern web technologies.',
    },
  ],
  education: [
    {
      id: '1',
      degree: 'Bilgisayar Mühendisliği',
      school: 'İstanbul Teknik Üniversitesi',
      startDate: '2014-09',
      endDate: '2018-06',
      description: 'Bölüm birincisi olarak mezun oldum.',
    },
  ],
  skills: [
    {
      id: '1',
      name: 'JavaScript',
      type: 'hard',
    },
    {
      id: '2',
      name: 'React',
      type: 'hard',
    },
    {
      id: '3',
      name: 'Node.js',
      type: 'hard',
    },
    {
      id: '4',
      name: 'İletişim',
      type: 'soft',
    },
    {
      id: '5',
      name: 'Takım Çalışması',
      type: 'soft',
    },
  ],
  languages: [
    {
      id: '1',
      name: 'İngilizce',
      level: 'C1',
    },
    {
      id: '2',
      name: 'Almanca',
      level: 'B1',
    },
  ],
  achievements: [
    {
      id: '1',
      title: 'En İyi Proje Ödülü',
      description: '2019 yılında şirket içi inovasyon yarışmasında birincilik ödülü.',
    },
  ],
  certificates: [
    {
      id: '1',
      name: 'AWS Certified Developer',
      issuer: 'Amazon Web Services',
      date: '2021-06',
      description: 'AWS cloud development certification'
    }
  ]
};

// GET: Belirli bir CV şablonunu getir
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Fetching template with ID:', params.id);
    
    // Oturum kontrolü
    const session = await auth();
    if (!session?.userId) {
      console.log('Unauthorized access attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      console.log('No template ID provided');
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    // Şablonu getir
    console.log('Querying database for template');
    const template = await prisma.cVTemplate.findFirst({
      where: {
        id,
        isActive: true,
      },
    });

    console.log('Found template:', template);

    // Şablon bulunamadıysa
    if (!template) {
      console.log('Template not found');
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Boş CV verisi
    const emptyCV = {
      personal: {
        fullName: 'ABIGAIL HALL',
        title: 'Senior Business Analyst | Data Analytics Expert',
        email: 'abi.hall@enhancv.com',
        phone: '',
        location: 'San Francisco, CA',
        website: 'linkedin.com'
      },
      summary: 'Seasoned IT business analyst with over 12 years in business analytics, specializing in data visualization and BI software, including Qlikview and SAS. Demonstrated success in leading major analytics dashboard projects that enhanced reporting efficiency by 30%. Expertise extends to Agile and Scrum methodologies, JIRA, SQL, ETL, and Master Data Management. Proven ability in boosting operational efficiencies and achieving substantial cost savings through strategic data integration projects.',
      experience: [
        {
          id: '1',
          title: 'Senior Business Analyst',
          company: 'Genentech',
          location: 'South San Francisco, CA',
          startDate: '01/2016',
          endDate: 'Present',
          current: true,
          description: [
            'Led the development of an advanced analytics dashboard that improved decision-making speed for senior management by 25%.',
            'Facilitated over 40 workshops to define and refine project scopes, translating complex data into actionable insights for cross-functional teams.',
            'Conducted in-depth data analysis to validate the feasibility of new dashboard features, which increased user engagement by 15%.',
            'Crafted and documented comprehensive data metrics and business rules, significantly enhancing report accuracy and reliability.',
            'Coordinated user acceptance testing, resulting in a 10% decrease in post-deployment issues.',
            'Provided expert training and support to the operations team, boosting their productivity by 20% in managing production issues.'
          ]
        },
        {
          id: '2',
          title: 'Business Systems Analyst',
          company: 'Amgen',
          location: 'Thousand Oaks, CA',
          startDate: '06/2012',
          endDate: '12/2015',
          current: false,
          description: [
            'Implemented a strategic data integration solution that streamlined operations and saved the company $200K annually.',
            'Managed a portfolio of data analytics projects, ensuring alignment with business goals and continuous delivery of value.',
            'Developed user stories and use cases for BI solutions, improving data-driven decision-making across the organization.',
            'Played a key role in the migration of analytics platforms to a more robust system, increasing data processing speed by 30%.',
            'Led the documentation efforts for system requirements using JIRA, enhancing team productivity and project tracking.'
          ]
        },
        {
          id: '3',
          title: 'Data Analyst',
          company: 'BioMarin Pharmaceutical',
          location: 'San Rafael, CA',
          startDate: '03/2008',
          endDate: '05/2012',
          current: false,
          description: [
            'Analyzed and interpreted complex data sets to assist with strategic decision-making, influencing key business initiatives.',
            'Optimized data collection and analysis processes, improving data quality and reducing time-to-insight by 20%.',
            'Contributed to the development of a predictive analytics model that enhanced forecasting accuracy.',
            'Supported senior analysts in creating detailed reports and presentations for stakeholders.'
          ]
        }
      ],
      education: [
        {
          id: '1',
          degree: 'Master of Science in Information Systems',
          school: 'University of San Francisco',
          location: 'San Francisco, CA',
          startDate: '01/2006',
          endDate: '01/2008',
          description: ''
        },
        {
          id: '2',
          degree: 'Bachelor of Science in Computer Science',
          school: 'University of California, Berkeley',
          location: 'Berkeley, CA',
          startDate: '01/2002',
          endDate: '01/2006',
          description: ''
        }
      ],
      skills: [
        { id: '1', name: 'Data Visualization', type: 'hard' },
        { id: '2', name: 'Agile and Scrum', type: 'hard' },
        { id: '3', name: 'JIRA', type: 'hard' },
        { id: '4', name: 'SQL', type: 'hard' },
        { id: '5', name: 'ETL', type: 'hard' },
        { id: '6', name: 'Business Intelligence', type: 'hard' }
      ],
      languages: [],
      achievements: [
        {
          id: '1',
          title: 'Streamlined reporting processes',
          description: 'Developed a new reporting framework that reduced the time required for data analysis by 40%, significantly impacting operational efficiency.'
        },
        {
          id: '2',
          title: 'Enhanced data integration',
          description: 'Led a critical data integration project that consolidated multiple data sources into a single, coherent framework, increasing data accessibility for all departments.'
        },
        {
          id: '3',
          title: 'Award for innovation',
          description: 'Received the \'Innovator of the Year\' award for developing a predictive analytics tool that decreased forecast errors by 25%.'
        }
      ],
      certificates: [
        {
          id: '1',
          name: 'Certified Scrum Master',
          issuer: 'Scrum Alliance',
          date: '2023',
          description: 'Certification focusing on Agile project management methodologies, provided by Scrum Alliance.'
        }
      ]
    };

    const response = {
      template: {
        ...template,
        content: emptyCV
      }
    };

    console.log('Sending response:', response);
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching CV template:', error);
    return NextResponse.json({ error: 'Failed to fetch CV template' }, { status: 500 });
  }
} 