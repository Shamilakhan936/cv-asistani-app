'use client';
import React from "react";

const List = ({ items, renderItem, className }) => {
  if (!items || items.length === 0) {
    return <p className="text-gray-500">No items available.</p>;
  }

  return (
    <ul className={`list-disc ml-5 text-xs text-inter ${className}`}>
      {items.map((item, index) => (
        <li key={index} className="py-[2px]">
          {renderItem ? renderItem(item) : item}
        </li>
      ))}
    </ul>
  );
};

export default List; 