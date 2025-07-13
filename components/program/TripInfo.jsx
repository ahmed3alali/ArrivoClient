import Image from "next/image";
import React from "react";

const TripInfo = ({ trip }) => {
  if (!trip) return null; // optional: handle loading or no data

  return (
    <div className="flex flex-col gap-[20px] mb-[40px] md:mb-[50px]">
      <div className="flex items-center gap-x-[8px]">
        <Image alt="info icon" src="/icons/info.png" height={24} width={24} />
        <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold">
          معلومات عن الرحلة :
        </h2>
      </div>
      <p className="text-[16px] text-[#636973]">
        {trip.description || "وصف الرحلة غير متوفر حالياً."}
      </p>
    </div>
  );
};

export default TripInfo;
