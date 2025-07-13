import Image from "next/image";
import React from "react";
import InfoQuick from "./InfoQuick";

const BoxInfo = ({trip}) => {


  const isProgramTravel = trip.lengthType === "MULTI_DAY";



  const formatDuration = (hours) => {
    if (hours === -1) return "3 أيام و 2 ليالي"; // special case
  
    const days = Math.floor(hours / 24);
  
    if (days <= 0) return "أقل من يوم";
  
    const nights = days - 1;
  
    return nights > 0 ? `${days} أيام و ${nights} ليالي` : `${days} أيام`;
  };


  function formatArabicHours(hours) {
    if (hours == null) return "";
    if (hours === 1) return "ساعة واحدة";
    if (hours === 2) return "ساعتان";
    if (hours >= 3 && hours <= 10) return `${hours} ساعات`;
    return `${hours} ساعة`; // fallback for numbers > 10 (less formal)
  }
  
  
  

  return (



    <div
      className="flex flex-col justify-center gap-[20px] p-[28px] border border-[#E9EAEC] rounded-[16px] shadow-md"
      style={{boxShadow: "0px 6px 12px rgba(91, 116, 130, 0.1)"}}
    >


{isProgramTravel ? <InfoQuick
  title="نوع الرحلة"
  value={trip?.subTypes?.[0]?.type || "غير محدد"} // fallback if empty
  icon="bag.png"
/> : <InfoQuick
  title="نوع الرحلة"
  value={trip?.tripType|| "غير محدد"} // fallback if empty
  icon="bag.png"
/> }





  <hr className="h-[1px] bg-[#E9EAEC]" />

  {isProgramTravel ? (
  <InfoQuick
    title="مدة الرحلة"
    value={formatDuration(trip?.durationHours)}
    icon="date-orange.png"
  />
) : (
  <InfoQuick
    title="مدة الرحلة"
    value={formatArabicHours(trip?.durationHours)}
    icon="date-orange.png"
  />
)}

     
      <hr className="h-[1px] bg-[#E9EAEC]" />
      <InfoQuick
  title="حجم المجموعة"
  value={`${trip?.groupSize || "غير محدد"} شخص`}
  icon="group.png"
/>

    </div>
  );
};

export default BoxInfo;
/* 
  <InfoQuick
        title="العمر المسموح به"
        value="بين 10 و 90 سنة."
        icon="one.png"
      />
*/
