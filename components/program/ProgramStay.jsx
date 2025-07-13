import React, { useRef } from "react";
import Image from "next/image";

// Your HotelTripStay unchanged

const HotelTripStay = ({ residence }) => {
  return (
    <div
      className="w-[252px] md:w-[387px] flex flex-col gap-[16px] bg-white rounded-[12px]"
    >
      <Image
        alt=""
        width={387}
        height={384}
        src={`https://backend.arrivotravel.com/media/${residence.thumbnail}`}
        className="w-[252px] h-[240px] md:w-[387px] md:h-[384px] rounded-[12px] object-cover"
      />
      <div className="flex flex-col gap-[12px]">
        <div className="flex flex-col items-start gap-[8px]">
          <div className="flex gap-x-[4px] items-center">
            <h6 className="text-[#475467] text-[16px]">موقع الإقامة:</h6>
            <p className="font-bold text-[16px]">{residence.location}</p>
          </div>
          <div className="flex gap-x-[4px] items-center">
            <h6 className="text-[#475467] text-[16px]">الفندق:</h6>
            <p className="font-bold text-[16px]">{residence.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProgramStay = ({ trip }) => {
  const scrollRef = useRef(null);

  if (!trip?.placesOfResidence?.length) return null;

  const uniqueResidences = Array.from(
    new Map(trip.placesOfResidence.map((r) => [r.id, r])).values()
  );

  const onlyOne = uniqueResidences.length === 1;

  // Scroll handlers
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div id="stay" className="relative" dir="rtl">
      <div className="flex items-center gap-x-[8px]">
        <Image
          alt=""
          src="/icons/program/FrameHotel.svg"
          height={32}
          width={32}
          className="shrink-0"
        />
        <h2 className="text-[24px] sm:text-[28px] lg:text-[36px] font-bold">
          أماكن الإقامة:
        </h2>
      </div>

      {onlyOne ? (
        <div className="mt-[24px] flex justify-center">
          <HotelTripStay residence={uniqueResidences[0]} />
        </div>
      ) : (
        <div className="mt-[24px] relative">
          {/* Prev Arrow */}


          <div
             onClick={scrollLeft}
            className="absolute top-[-60px] left-0 z-[999] bg-white cursor-pointer"
          >
            <div className="w-[40px] h-[40px] hover:scale-[0.95] duration-300 ease-in relative rounded-full shadow-md p-1 ">
              <Image alt="Next" src="/icons/slick/arrow.png"  fill />
            </div>
          </div>



          <div
            onClick={scrollRight}
            className="absolute top-[-60px] left-[48px] z-[999] bg-white cursor-pointer"
          >
            <div className="w-[40px] h-[40px] hover:scale-[0.95] duration-300 ease-in relative rounded-full shadow-md p-1">
              <Image
                alt="Previous"
                src="/icons/slick/arrow.png"
                className="rotate-[180deg] "
               
                fill
              />
            </div>
          </div>

          {/* Next Arrow */}
        

          {/* Scroll container */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 scroll-smooth snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {uniqueResidences.map((residence) => (
              <div key={residence.id} className="snap-start flex-shrink-0">
                <HotelTripStay residence={residence} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramStay;
