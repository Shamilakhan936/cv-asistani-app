import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest, { params }: { params: { templateId: string } }) {
  try {
    // Kullanıcı kimlik doğrulaması
    const session = await auth();
    if (!session?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { templateId } = params;

    // Şu an için sadece "elegant-template-1" şablonunu destekliyoruz
    if (templateId === 'elegant-template-1') {
      // Zarif şablonu için varsayılan içerik
      return NextResponse.json({
        template: {
          id: 'elegant-template-1',
          name: 'Zarif',
          category: 'Modern',
          content: {
            personal: {
              fullName: 'Aiden Williams',
              title: 'Senior Project Manager | Treasury & Expense Management',
              phone: '+1(234)-555-1234',
              email: 'aidenwilliams@example.com',
              linkedin: 'linkedin.com/in/aidenwilliams',
              location: 'İstanbul, Türkiye',
              // cv/edit sayfasında kullanımı için edit sayfasının beklediği formatta veri döndürüyoruz
            },
            summary: 'Accomplished Senior Project Manager with over 6 years of experience in leading high-priority treasury and expense management initiatives. Proficient in PeopleSoft Cash Management, budget planning, and implementing technology solutions.',
            experience: [
              {
                company: 'JPMorgan Chase',
                position: 'Senior Project Manager - Treasury Systems',
                startDate: '01/2018',
                endDate: 'Present',
                location: 'Columbus, OH',
                description: 'Oversaw the strategic implementation of an enterprise-wide Expense Management system. Managed cross-functional teams to deliver critical treasury projects. Drove process optimization using Lean Six-Sigma methodologies.'
              },
              {
                company: 'Nationwide Insurance',
                position: 'Treasury Systems Analyst',
                startDate: '06/2014',
                endDate: '12/2017',
                location: 'Columbus, OH',
                description: 'Led a successful upgrade of the PeopleSoft Cash Management module. Conducted in-depth business process analyses. Managed vendor relationships for the procurement of Treasury IT solutions.'
              }
            ],
            education: [
              {
                school: 'Ohio State University',
                degree: 'Master of Science in Finance',
                startDate: '01/2007',
                endDate: '01/2009',
                location: 'Columbus, OH',
                description: ''
              },
              {
                school: 'Miami University',
                degree: 'Bachelor of Business Administration',
                startDate: '01/2003',
                endDate: '01/2007',
                location: 'Oxford, OH',
                description: ''
              }
            ],
            skills: 'Project Management, Business Process Improvement, PeopleSoft Cash Management, Expense Management, Data Analytics, Risk Management',
            languages: [
              {
                language: 'İngilizce',
                proficiency: 'Ana dil'
              },
              {
                language: 'İspanyolca',
                proficiency: 'Akıcı'
              }
            ],
            certifications: [
              {
                name: 'Certification in Project Management',
                issuer: 'PMI',
                date: '2018',
                description: 'Obtained PMP certification through PMI, focusing on advanced project management.'
              },
              {
                name: 'Certified Lean Six Sigma Green Belt',
                issuer: 'ASQ',
                date: '2016',
                description: 'Completed Lean Six Sigma Green Belt course.'
              }
            ],
            // Elegant şablonu için ek alanlar
            achievements: [
              {
                title: 'Enterprise-wide System Implementation',
                description: 'Led the rollout of a new expense management system.'
              },
              {
                title: 'Process Efficiency Optimization',
                description: 'Applied Lean Six Sigma principles, boosting department efficiency by 25%.'
              }
            ],
            interests: [
              {
                title: 'Process Efficiency Optimization',
                description: 'Applied Lean Six Sigma principles to revamp treasury processes, resulting in a 25% boost in department efficiency.'
              }
            ]
          }
        }
      });
    }
    
    // Şablon bulunamadı
    return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    
  } catch (error) {
    console.error('Error fetching template details:', error);
    return NextResponse.json({ error: 'Failed to fetch template details' }, { status: 500 });
  }
} 