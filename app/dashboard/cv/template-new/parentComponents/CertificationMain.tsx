import { Certification } from '../types/datatypes';
import { FaCertificate, FaAward, FaStar } from 'react-icons/fa';
import { ReactNode } from 'react';

interface CertificationsProps {
  data: Certification[];
  textStyle?: {
    title?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
    description?: {
      fontSize?: string;
      color?: string;
      fontFamily?: string;
    };
  };
}


function getIconById(id: string | number): ReactNode {
  const iconMap: Record<string, ReactNode> = {
    '1': <FaCertificate className="text-[#00b6cb]" />,
    '2': <FaAward className="text-[#ff9900]" />,
    '3': <FaStar className="text-[#ffaa33]" />,
    default: <FaCertificate className="text-[#00b6cb]" />,
  };

  return iconMap[id.toString()] || iconMap.default;
}

export default function Certifications({ data, textStyle }: CertificationsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <div className="space-y-4">
        {data.map((cert) => (
          <div key={cert.id} className="mb-4 flex items-start gap-2">
            <span className="mt-[5px] text-[24px]">{getIconById(cert.id)}</span>
            <div>
              <h3
                className="font-medium"
                style={{
                  fontSize: textStyle?.title?.fontSize || '16px',
                  color: textStyle?.title?.color || '#00b6cb',
                  fontFamily: textStyle?.title?.fontFamily || 'inherit',
                }}
              >
                {cert.title}
              </h3>
              <p
                style={{
                  fontSize: textStyle?.description?.fontSize || '14px',
                  color: textStyle?.description?.color || '#000000',
                  fontFamily: textStyle?.description?.fontFamily || 'inherit',
                }}
              >
                {cert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
