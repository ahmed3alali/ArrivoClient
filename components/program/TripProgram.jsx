import Image from "next/image";
import React, { useEffect, useState } from "react";

// PDF download section
const PropgramTripFile = () => {
  const [hoverBtn, setHoverBtn] = useState(false);
  return (
    <div
      id="section_file_program"
      className="flex flex-col sm:flex-row justify-center sm:justify-between sm:text-start text-center items-center gap-[14px]"
    >
      <div id="file_program_content" className="flex flex-col gap-[4px]">
        <h5 className="text-[18px] font-bold">هل تريد قرائته لاحقا؟</h5>
        <p className="text-[#475467] text-[12px]">
          قم بتنزيل كتيب PDF لهذه الجولة وابدأ التخطيط للجولة
        </p>
      </div>
      <button
        onMouseOver={() => setHoverBtn(true)}
        onMouseOut={() => setHoverBtn(false)}
        className="flex justify-center gap-[8px] py-[12px] px-[20px] border-[1px] border-[#F08631] rounded-[8px] hover:bg-orange hover:text-white duration-300 ease-out text-[#F08631] font-[500] w-full sm:w-auto"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 14.5V16.75C1 17.3467 1.23705 17.919 1.65901 18.341C2.08097 18.7629 2.65326 19 3.25 19H16.75C17.3467 19 17.919 18.7629 18.341 18.341C18.7629 17.919 19 17.3467 19 16.75V14.5M14.5 10L10 14.5M10 14.5L5.5 10M10 14.5V1"
            stroke={hoverBtn ? "#fff" : "#F08631"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        تحميل برنامج الرحلة
      </button>
    </div>
  );
};

// Details section for each day
const fieldLabels = {
  description: "برنامج الرحلة :",
  visitHighlights: "أبرز الأماكن التي سنزورها :",
  activities: "النشاطات التي يمكن القيام بها :",
  residenceName: "الإقامة :",
};

const DetailsStations = ({ prog }) => {
  const getValue = (key) => {
    switch (key) {
      case "visitHighlights":
        return prog.visitHighlights?.map((v) => v.title).join(" - ") || "";
      case "activities":
        return prog.activities?.edges?.map((a) => a.node.title).join(" - ") || "";
      default:
        return prog[key] || "";
    }
  };

  return (
    <div className="flex gap-10 border-r-2 border-[#98A2B3] mr-1">
      <div className="w-full pl-8 mr-8">
        <div className="flex flex-col gap-4 mr-4">
          {Object.entries(fieldLabels).map(([key, label]) => {
            const value = getValue(key);
            if (!value) return null;
            return (
              <div key={key} className="flex flex-col max-w-[697px]">
                <div className="flex items-start gap-x-[21px] w-full">
                  <span className="h-[8px] w-[8px] bg-[#092F44] rounded-full mt-2 translate-x-[+2px]"></span>
                  <h2 className="text-[14px] font-bold">{label}</h2>
                </div>
                <p className="text-[12px] text-[#475467] pr-8">{value}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Single day entry
const StationTrip = ({ prog, i, length }) => {
  const [showDetailsTrip, setShowDetailsTrip] = useState(false);
  const [nextProgramHeight, setNextProgramHeight] = useState(null);

  useEffect(() => {
    if (i < length - 1) {
      const nextEl = document.getElementById(`program-${i + 1}`);
      if (nextEl) {
        setNextProgramHeight(nextEl.clientHeight);
      }
    }
  }, [i, length]);

  return (
    <div id={`program-${i}`} className="flex flex-col gap-[16px] w-full relative">
      <div
        onClick={() => setShowDetailsTrip(!showDetailsTrip)}
        className="flex justify-start items-center gap-[12px] cursor-pointer w-full"
      >
        {/* vertical line + icon */}
        <div className="relative h-full">
          <svg
            className={i === length - 1 ? "" : "mb-6"}
            width="12"
            height="15"
            viewBox="0 0 12 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.1 1.4C4.9 0.4 7.1 0.4 9 1.5C10.8 2.6 11.8 4.6 11.8 6.7C11.8 8.8 10.6 10.8 9.2 12.4C8.3 13.3 7.4 14 6.4 14.7C6.2 14.8 6.1 14.8 6 14.8C5.9 14.8 5.8 14.8 5.7 14.7C4.2 13.7 2.8 12.4 1.7 10.9C0.7 9.7 0.2 8.2 0.2 6.6C0.2 4.3 1.4 2.5 3.1 1.4ZM6.8 4.9C6 4.5 5.2 4.7 4.6 5.3C4 5.9 3.9 6.7 4.2 7.5C4.5 8.2 5.2 8.7 6 8.7C6.5 8.7 7 8.5 7.4 8.2C7.8 7.8 8 7.3 8 6.7C8 5.9 7.5 5.2 6.8 4.9Z"
              fill={i === 0 ? "#12B76A" : i === length - 1 ? "#F04438" : "#092F44"}
            />
          </svg>
          {nextProgramHeight && (
            <div
              style={{
                position: "absolute",
                top: "60%",
                left: "6px",
                width: "2px",
                backgroundColor: "#98A2B3",
                height: showDetailsTrip ? `${nextProgramHeight}px` : `${nextProgramHeight - 20}px`,
              }}
            />
          )}
        </div>

        {/* card */}
        <div className="flex justify-between items-center bg-[#F4F7FD] rounded-[8px] py-[8px] px-[16px] w-full">
          <div className="flex gap-[8px] items-center">
            <span className="w-[32px] h-[32px] rounded-full p-[2px] bg-[#092F44] text-white text-center">
              {i < 10 ? `0${i + 1}` : i + 1}
            </span>
            <div className="flex flex-col">
              <h6 className="text-[#475467] text-[12px]">
                اليوم {i + 1} : {prog.title}
              </h6>
              <p className="text-[12px]">{prog.subTitle}</p>
            </div>
          </div>
          <div className={showDetailsTrip ? "rotate-90" : ""}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 5.5L8 10.5L3 5.5"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {showDetailsTrip && <DetailsStations prog={prog} />}
    </div>
  );
};

// MAIN COMPONENT
const TripProgram = ({ trip }) => {
  if (!trip?.dayPrograms?.length) return null;

  return (
    <div id="program" className="flex flex-col gap-[20px] mb-[40px] md:mb-[50px]">
      <div className="flex items-center gap-x-[8px]">
        <Image
          alt=""
          src="/icons/map.png"
          height={24}
          width={24}
          className="shrink-0"
        />
        <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold">
          برنامج الرحلة :
        </h2>
      </div>

      <div className="flex flex-col items-start gap-[12px]">
        {trip.dayPrograms.map((prog, i) => (
          <StationTrip key={i} prog={prog} i={i} length={trip.dayPrograms.length} />
        ))}
      </div>

      <PropgramTripFile />
    </div>
  );
};

export default TripProgram;
