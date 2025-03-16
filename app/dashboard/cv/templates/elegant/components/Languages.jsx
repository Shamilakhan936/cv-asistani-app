'use client';
import React from "react";

const LanguageItem = ({ name, level, filledDots }) => {
  return (
    <div className="flex justify-between w-[50%]">
      <p className="text-[15px]">{name}</p>
      <div className="flex m-auto">
        <small className="text-xs text-textColor mr-2">{level}</small>
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 mx-[2px] mt-[6px] rounded-full ${
                index < filledDots ? "bg-light" : "bg-grayIcon"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Languages = () => {
  const languages = [
    { name: "English", level: "Native", filledDots: 5 },
    { name: "Spanish", level: "Fluent", filledDots: 3 },
  ];

  return (
    <div className="mt-5">
      <h3 className="text-textColor font-rubik border-b border-grayIcon mb-1 pb-1">
        LANGUAGES
      </h3>
      <div className="flex justify-between">
        {languages.map((lang, index) => (
          <LanguageItem key={index} {...lang} />
        ))}
      </div>
    </div>
  );
};

export default Languages; 