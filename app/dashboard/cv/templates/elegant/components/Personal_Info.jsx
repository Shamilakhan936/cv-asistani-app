'use client';
import React from "react";
import { Phone, Mail, Link, MapPin } from "lucide-react";

function Personal_Info({ data = {} }) {
  // Varsayılan değerler ile data objesini birleştiriyoruz
  const personalInfo = {
    name: data?.name || "AIDEN WILLIAMS",
    title: data?.title || "Senior Project Manager | Treasury & Expense Management",
    phone: data?.phone || "+1(234)-555-1234",
    email: data?.email || "help@enhancv.com",
    linkedin: data?.linkedin || "linkedin.com/in/",
    location: data?.location || "Columbus, Ohio"
  };

  return (
    <>
      <h1 className="text-[28px] font-bold font-customFont text-textColor font-rubik">
        {personalInfo.name}
      </h1>
      <p className="font-inter text-light">
        {personalInfo.title}
      </p>
      <div className="flex flex-wrap mt-2 text-[13px] text-textColor">
        <p className="m-0 flex justify-center align-middle mr-3 mb-3">
          <Phone className="stroke-grayIcon size-[14px] mr-1 mt-1" />{" "}
          {personalInfo.phone}
        </p>
        <p className="m-0 flex justify-center align-middle mr-3 mb-3">
          <Mail className="size-[18px] stroke-grayIcon mr-1" />
          {personalInfo.email}
        </p>
        <p className="m-0 flex justify-center align-middle mr-3 mb-3">
          <Link className="size-[18px] stroke-grayIcon mr-1" />{" "}
          {personalInfo.linkedin}
        </p>
        <p className="m-0 flex justify-center align-middle ">
          <MapPin className="size-[18px] stroke-grayIcon mr-1" /> {personalInfo.location}
        </p>
      </div>
    </>
  );
}

export default Personal_Info; 