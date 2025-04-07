import { Passion } from "../types/datatypes";
import { GiDiamondTrophy, GiMedal, GiAchievement } from "react-icons/gi";
import {
  FaAward,
  FaTrophy,
  FaMedal,
  FaHeart,
  FaLaptopCode,
  FaBookReader,
} from "react-icons/fa";

type IconType =
  | "trophy"
  | "medal"
  | "award"
  | "achievement"
  | "cup"
  | "ribbon"
  | "heart"
  | "code"
  | "book";

const iconMap: { [key in IconType]: React.ReactNode } = {
  trophy: <GiDiamondTrophy className="w-[25px] h-[25px] text-[#14324c]" />,
  medal: <GiMedal className="w-[25px] h-[25px] text-[#14324c]" />,
  award: <FaAward className="w-[25px] h-[25px] text-[#14324c]" />,
  achievement: <GiAchievement className="w-[25px] h-[25px] text-[#14324c]" />,
  cup: <FaTrophy className="w-[25px] h-[25px] text-[#14324c]" />,
  ribbon: <FaMedal className="w-[25px] h-[25px] text-[#14324c]" />,
  heart: <FaHeart className="w-[25px] h-[25px] text-[#14324c]" />,
  code: <FaLaptopCode className="w-[25px] h-[25px] text-[#14324c]" />,
  book: <FaBookReader className="w-[25px] h-[25px] text-[#14324c]" />,
};

interface PassionsProps {
  data: Passion[];
  border?: boolean; // New prop to control border
}

export default function Passions({ data, border = true }: PassionsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <div className="space-y-4">
        {data.map((passion) => (
          <div
            key={passion.id}
            className={`flex items-start gap-[8px] mb-[8px] py-1 ${
              border ? "border-b-2 border-dashed border-[#ccc]" : ""
            }`}
          >
            <span className="text-lg text-black mt-[5px]">
              {passion.icon && iconMap[passion.icon as IconType] ? (
                iconMap[passion.icon as IconType]
              ) : (
                <FaLaptopCode className="w-[20px] h-[20px] text-[#F5F5F5]" />
              )}
            </span>
            <div className="w-full">
              <h3 className="font-medium text-[#235986] text-[16px] font-semibold">
                {passion.title}
              </h3>
              <p className="text-black text-[13px] py-1">{passion.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
