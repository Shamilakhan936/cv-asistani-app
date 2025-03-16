'use client';
import React, { useMemo } from "react";
import { Star, TrendingUp, Star as TacoBellIcon } from "lucide-react";

const Achievement = () => {
  const achievements = useMemo(
    () => [
      {
        icon: <Star size={16} />,
        title: "Enterprise-wide System Implementation",
        description: "Led the rollout of a new expense management system.",
      },
      {
        icon: <TrendingUp size={16} />,
        title: "Process Efficiency Optimization",
        description:
          "Applied Lean Six Sigma principles, boosting department efficiency by 25%.",
      },
      {
        icon: <Star size={16} />,
        title: "Risk Management Framework Development",
        description: "Devised comprehensive risk management strategies.",
      },
      {
        icon: <TacoBellIcon size={16} />,
        title: "Financial Analytics Dashboard Creation",
        description: "Created a financial analytics tool for executives.",
      },
    ],
    []
  );

  return (
    <div className="mt-5">
      <h3 className="text-whiteText font-rubik border-b border-grayIcon mb-1 pb-1">
        KEY ACHIEVEMENTS
      </h3>
      {achievements.map((achievement, index) => (
        <div key={index} className="flex mt-2">
          <div className="mr-2 text-whiteText">{achievement.icon}</div>
          <div>
            <p className="text-whiteText font-rubik text-[15px]">
              {achievement.title}
            </p>
            <p className="text-xs text-whiteText mt-[2px] font-inter">
              {achievement.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Achievement; 