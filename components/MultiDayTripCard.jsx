import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


const createPersonsArabic = (num) => {
  if (!num) return '';
  if (num === 1) return 'شخص واحد';
  if (num === 2) return 'شخصان';
  if (num >= 3 && num <= 10) return `${num} أشخاص`;
  return `${num} شخص`;
};


const hoursToDays = (hours) =>{


    const days = Math.ceil(hours/24);
    
    
    return days;
    
    }



const MultiDayTripCard = ({ trip, isSingle, data }) => {
  const tripData = isSingle ? data?.[0]?.node : trip;

  if (!tripData) return null;

  const {
    id,
    cardThumbnail,
    offerType,
    programType,
    title,
    description,
    price,
    groupSize,
    durationHours,
    night,
  } = tripData;

  return (
    <div>
      <Link
        key={id}
        href={`/travels-programs/${id}`}
        className="mb-4 scale-x-[-1] w-[230px] sm:scale-x-[1] "
        
      >
        <div
          dir="rtl"
          className="relative flex flex-col bg-white rounded-[12px] mx-[5px] h-[440px]"
          style={{
            boxShadow: "0px 4px 8px rgba(91, 116, 130, 0.08)",
            border: "1px solid rgba(152, 162, 179, 0.25)",
          }}
        >
          <div className="relative h-[245px] w-full flex-shrink-0">
            <Image
              alt="tripCard"
              src={`${cardThumbnail}`}
              fill
              className="rounded-t-[12px] object-cover"
            />
            <div className="absolute top-[16px] right-[16px]">
              <button className="outline-none bg-[#F08631] text-white py-[12px] px-[20px] flex items-center justify-center text-[12px] rounded-[12px]">
                {offerType}
              </button>
            </div>
            <div className="absolute bottom-2 right-[5px]">
<span className="bg-blue-950 text-white text-[10px] py-[7px] px-[12px] rounded-[8px]">
{programType || " برنامج سياحي"}
</span>
</div>


          </div>

          <div className="p-[16px] flex flex-col gap-[16px] h-44  w-80">
            <div className="flex flex-col gap-[8px] ">
              <div className="flex justify-between items-center">
                <h6 className="font-bold-600 text-[16px] line-clamp-1">{title}</h6>
              </div>
              <div className="h-[32px] flex items-start">
                <p className="text-[12px] text-grey line-clamp-2">{description}</p>
              </div>
              <div className="flex gap-x-[4px] items-center text-[12px] text-grey">
                {/**
                 * 
                 * 
                 * 
                 * 
                 * 
                 * 
                 */}

<Image alt="" src="/icons/daily/car.svg" className="mt-2" height={20} width={20} />
              <p>رحلة خاصة </p>
                
              </div>
            </div>

            <div className="flex gap-x-[16px] items-center mt-auto ">
              <p className="price font-bold-600 text-[36px] ">
                <span  >$</span>
                {price}
              </p>
              <div className="flex flex-col gap-[2px] text-[12px] text-grey mr-auto">
              <div className="flex gap-x-[4px] pr-[8px] mr-auto">

              <p>{createPersonsArabic(groupSize)}</p>
            
              </div>

               
                <div className="flex gap-x-[4px] pr-[8px] mr-auto">

                  <p className="flex gap-x-[4px] pr-[8px]">
                {hoursToDays(durationHours)}
            
                  {night}
           <span>يوم</span>
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MultiDayTripCard;
