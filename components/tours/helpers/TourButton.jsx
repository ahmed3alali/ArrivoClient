import React from "react";

const TourButton = ({ name, text, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-[36px] text-sm font-medium transition-all duration-200
        whitespace-nowrap min-w-fit
        ${isActive 
          ? 'bg-white text-orange shadow-sm' 
          : 'bg-transparent text-white hover:bg-white hover:bg-opacity-10'
        }
      `}
    >
      {text}
    </button>
  );
};

export default TourButton;