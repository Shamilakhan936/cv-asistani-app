import { Certification } from '../types/datatypes';

interface CertificationsProps {
  data: Certification[];
}

export default function Certifications({ data }: CertificationsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <div className="space-y-4">
        {data.map((cert) => (
          <div key={cert.id} className="mb-4">
            <h3 className="font-medium text-[16px] text-[#00b6cb]">{cert.title}</h3>
            {/* <p className="text-sm text-black mb-1">{cert.organization}</p> */}
            <p className="text-[14px] text-black">{cert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 