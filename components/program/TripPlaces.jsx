import Image from "next/image";
import React from "react";
import OneLocation from "./helpers/OneLocation";

const TripPlaces = ({ trip }) => {
  if (!trip || !trip.visitLocationHighlights) return null;

  // Extract an array of places from trip.provinces.edges
const places = trip.visitLocationHighlights.map(({ thumbnail, title }) => ({
  img: thumbnail,
  name: title,
}));


  return (
    <div className="flex flex-col gap-[20px] mb-[40px] md:mb-[50px]">
      <div className="flex items-center gap-x-[8px]">
        <Image
          alt=""
          src="/icons/map.png"
          height={24}
          width={24}
          className="shrink-0"
        />
        <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold">
          من أبرز الأماكن التي سنزورها :
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-[12px] md:gap-[20px]">
        {places.map((loc, i) => (
          <OneLocation key={i} loc={loc} />
        ))}
      </div>
    </div>
  );
};

export default TripPlaces;
