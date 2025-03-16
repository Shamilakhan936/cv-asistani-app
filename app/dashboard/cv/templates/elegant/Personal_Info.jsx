'use client';
import React from "react";
import { Phone, Mail, Link, MapPin } from "lucide-react";

function Personal_Info({ data = {} }) {
  // Varsayılan değerler ve props'tan gelen verileri birleştir
  const {
    name = "",
    title = "",
    phone = "",
    email = "",
    linkedin = "",
    location = "",
  } = data;

  return (
    <>
      <h1 className="text-[28px] font-bold font-customFont text-textColor font-rubik">
        {name}
      </h1>
      <p className="font-inter text-light">
        {title}
      </p>
      <div className="flex flex-wrap mt-2 text-[13px] text-textColor">
        {phone && (
          <p className="m-0 flex justify-center align-middle mr-3 mb-3">
            <Phone className="stroke-grayIcon size-[14px] mr-1 mt-1" />{" "}
            {phone}
          </p>
        )}
        {email && (
          <p className="m-0 flex justify-center align-middle mr-3 mb-3">
            <Mail className="size-[18px] stroke-grayIcon mr-1" />
            {email}
          </p>
        )}
        {linkedin && (
          <p className="m-0 flex justify-center align-middle mr-3 mb-3">
            <Link className="size-[18px] stroke-grayIcon mr-1" />{" "}
            {linkedin}
          </p>
        )}
        {location && (
          <p className="m-0 flex justify-center align-middle ">
            <MapPin className="size-[18px] stroke-grayIcon mr-1" /> {location}
          </p>
        )}
      </div>
    </>
  );
}

export default Personal_Info; 