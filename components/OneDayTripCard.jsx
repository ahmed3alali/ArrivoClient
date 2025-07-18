import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const createPersonsArabic = (num) => {
  if (!num) return '';
  if (num === 1) return 'شخص واحد';
  if (num === 2) return 'شخصان';
  if (num >= 3 && num <= 10) return `${num} أشخاص`;
  return `${num} شخص`;
};


const hoursModifier = (num) => {
  if (!num) return '';
  if (num === 1) return ' ساعة واحدة';
  if (num === 2) return 'ساعتان';
  if (num >= 3 && num <= 10) return `${num} ساعات`;
  return `${num} ساعات `;
};



const OneDayTripCard = ({ trip, isSingle, data }) => {


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
              alt=""
              src={`${baseUrl}/media/${cardThumbnail}`}
              fill
              className="rounded-t-[12px] object-cover"
            />
            <div className="absolute top-[16px] right-[16px]">
              <button className="outline-none bg-[#F08631] text-white py-[12px] px-[20px] flex items-center justify-center text-[12px] rounded-[12px]">
                {offerType}
              </button>
            </div>
            <div className="absolute bottom-2 right-[5px]">
  <span className="bg-green-800 text-white text-[10px] py-[7px] px-[12px] rounded-[8px]">
  {programType || " رحلة سياحية"}
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
             <Clock width={20} height={20} className='text-orange'  ></Clock>
                  <p className="flex gap-x-[4px] pr-[8px]">
                {hoursModifier(durationHours
                  
                )}
            
                  {night}
           
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

export default OneDayTripCard;
