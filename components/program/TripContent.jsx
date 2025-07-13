import Image from "next/image";
import React from "react";
import OneContent from "./helpers/OneContent";

const TripContent = ({ trip }) => {
  if (!trip || !trip.content) return null;

  // Map content items (adjust field names if needed)
  const contents = trip.content.map(({ id, title,icon ,description }) => ({
    id,
    title,
    icon,
    description
  }));

  return (
    <div className="flex flex-col gap-[20px] mb-[40px] md:mb-[50px]">
      <div className="flex items-center gap-x-[8px]">
        <Image
          alt=""
          src="/icons/info.png"
          height={24}
          width={24}
          className="shrink-0"
        />
        <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold">
          محتويات الرحلة :
        </h2>
      </div>
      <div className="grid grid-cols-12 gap-[12px]">
        {contents.map((cont) => (
          // Pass the full cont object or only the title, depends on OneContent needs
          <OneContent key={cont.id} cont={cont} />
        ))}
      </div>
    </div>
  );
};

export default TripContent;
