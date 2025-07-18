import { Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BoxOne = ({shouldRenderMobileView ,trip}) => {

  if (!trip || !trip.id) return null;

  const shareText = "Check out this awesome trip!";



  function handleWhatsAppClick() {
    const phoneNumber = "905530030048"; // no plus sign or spaces
    const shareText = "مرحبا ! شفت الكم رحلة او برنامج على موقعكم ممكن اتساعدوني ؟";
    const shareUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(shareText)}`;
  
    const link = document.createElement("a");
    link.href = shareUrl;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // clean up after clicking
  }
  

  return (
    <div
      className={
        shouldRenderMobileView
          ? "flex flex-col justify-center gap-[20px]  px-[16px] border-[#E9EAEC] rounded-t-[32px] translate-y-[-100px] bg-[#fff] border-[0px] pt-[40px]"
          : "flex flex-col justify-center gap-[20px] py-[20px] px-[16px] border border-[#E9EAEC] rounded-[16px] "
      }
      style={
        !shouldRenderMobileView
          ? {boxShadow: "0px 6px 12px rgba(91, 116, 130, 0.1)"}
          : {boxShadow: ""}
      }
    >
      {shouldRenderMobileView && (
        <h1 className="text-[30px] md:text-[36px] font-bold">
          رحلة الشمال التركي الشاملة
        </h1>
      )}

      {/**
       * 
       * 
       * 
       *     <div className="flex items-center gap-x-2 text-[16px]">
        <Image src="/icons/star.png" height={19} width={20} alt="" />
        <span>5.0</span>
        <span>.</span>
        <span className="">
          <span>19 </span>تقييم
        </span>
      </div>
       * 
       * 
       * 
       */}
  
      <p className="text-[16px] text-[#636973]">
        رحلة العمر نضمن لك فيها السعادة. نوفر لكم الأسعار المناسبة و الملائمة.
      </p>
      <div className="flex  md:justify-between md:flex-col xl:flex-row gap-4">
      {trip.lengthType==="MULTI_DAY" ?
      <Link
  href={{
    pathname: "/travels-programs/[program__id]/timings-prices",
    query: { program__id: trip?.id },
  }}
  className="flex gap-[4px] items-center justify-center h-[40px] md:h-[48px] py-[6px] md:py-[12px] px-[16px] md:px-[20px] bg-orange text-white text-[14px] md:text-[16px] rounded-[8px] hover:shadow"
>

          <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px] relative">
            <Image alt="" src="/icons/date.png" fill />
          </div>
      
          <p>شاهد التوفر و الأسعار</p>
        </Link>
        :


        <div className="price-container text-6xl text-orange" dir="ltr">
<p>$ {trip?.price}</p>

        </div>
         }
        <div className="flex xl:justify-center items-center gap-[20px] lg:gap-[10px]">
        

          {/**
           * 
           *   <button className="flex items-center justify-center w-full lg:h-[48px] p-[6px] md:p-[12px] rounded-[8px] border border-solid border-orange">
            <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px] relative">
              <Image alt="" src="/icons/save.svg" fill />
            </div>
          </button>
           * 
           * 
           * 
           *   <button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center w-full lg:h-[48px] p-[6px] md:p-[12px] rounded-[8px] border border-solid border-orange"
          >
            <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px] relative">
              <Image alt="" src="/icons/share.png" fill />
            </div>
          </button>
           * 
           * 
           * 
           */}
        

          <button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center w-32 lg:h-[48px] p-[6px] md:p-[12px] rounded-[8px] border border-solid bg-orange border-orange"
          >
         <p className="text-white">احجز الآن ! </p>
            <div className="h-[20px] w-[20px] md:h-[24px] md:w-[24px] relative">
            <Phone className="text-white mr-2 "></Phone>
            </div>
          </button>

        </div>
      </div>
    </div>
  );
};

export default BoxOne;
