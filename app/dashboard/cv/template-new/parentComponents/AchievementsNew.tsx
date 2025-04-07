"use client";

import { GiDiamondTrophy, GiMedal, GiAchievement } from "react-icons/gi";
import { FaAward, FaTrophy, FaMedal } from "react-icons/fa";
import { Achievement } from '../types/datatypes';

type IconType = "trophy" | "medal" | "award" | "achievement" | "cup" | "ribbon";

const iconMap: { [key in IconType]: React.ReactNode } = {
  trophy: <GiDiamondTrophy className="mr-4 w-[25px] h-[25px] text-[#14324c]" />,
  medal: <GiMedal className="mr-4 w-[25px] h-[25px] text-[#14324c]" />,
  award: <FaAward className="mr-4 w-[25px] h-[25px] text-[#14324c]" />,
  achievement: <GiAchievement className="mr-2 w-[25px] h-[25px] text-[#14324c]" />,
  cup: <FaTrophy className="mr-4 w-[25px] h-[25px] text-[#14324c]" />,
  ribbon: <FaMedal className="mr-4 w-[25px] h-[25px] text-[#14324c]" />,
};

interface AchievementsProps {
  data: Achievement[];
  border?: boolean; 
}

export default function Achievements({ data, border = true }: AchievementsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4 text-[#235986] mt-[8px]">
      {data.map((achievement) => (
        <div 
          key={achievement.id} 
          className={`flex text-[#235986] items-start gap-3 py-2 ${
            border ? "border-b-2 border-dashed border-[#ccc]" : ""
          }`}
        >
          <span className="text-lg text-black mt-[5px]">
            {iconMap[achievement.icon as IconType] || <GiDiamondTrophy className="mr-2 w-[30px] h-[30px] text-[#F5F5F5]" />}
          </span>
          <div>
            <h4 className="font-medium text-[#235986] text-[16px] font-semibold">{achievement.title}</h4>
            <p className="text-black text-[13px]">{achievement.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
