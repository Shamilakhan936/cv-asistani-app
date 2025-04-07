"use client";

interface SummaryProps {
  title: string;
  description: string;
}

const Summary: React.FC<SummaryProps> = ({ title, description }) => {
  return (
    <div className=" mb-6">
      <h2 className="text-[18px] font-semibold max-sm:font-bold text-[#384347] border-b-[1px] border-[#bdbdbd] pb-[5px]">
        {title}
      </h2>
      <div className="mt-2 text-[14px] text-[#2c2a2a]">
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Summary;
