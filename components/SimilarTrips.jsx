import React, { useEffect, useRef, useState } from "react";
import SlickSlider from "./sub/SlickSlider";
import Image from "next/image";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import LoaderExternal from "./LoadingExternal";

// GraphQL Query
const LIST_TRIPS = gql`
  query ListTrips($first: Int) {
    trips(first: $first) {
      edges {
        node {
          __typename
          ... on OneDayTripNode {
            id
            title
            description
            tripType
            offerType
            durationHours
            lengthType
            price
            groupSize
            cardThumbnail
            tags
          }
          ... on MultiDayTripNode {
            id
            title
            description
            offerType
            tripType
            durationHours
            lengthType
            price
            groupSize
            cardThumbnail
            tags
            thumbnails {
              id
              image
            }
          }
        }
      }
    }
  }
`;




const SimilarTrips = ({ tripId, tripTags = []  ,isProgramTravel}) => {
  const { data, loading, error } = useQuery(LIST_TRIPS, {
    variables: { first: 10 },
  });

  const scrollRef = useRef(null);


  const allTrips = data?.trips?.edges?.map((e) => e.node) || [];




  function useWindowWidth() {
    const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024);
  
    useEffect(() => {
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return width;
  }
  const width = useWindowWidth();
  const isMobile = width < 768;



  // Filter similar trips
  const similarTrips = allTrips.filter((trip) => {
    console.log("trip.tags:", trip.tags);
console.log("tripTags from props:", tripTags);

    if (!trip || trip.id === tripId) return false;
    if (!Array.isArray(trip.tags) || !Array.isArray(tripTags)) return false;
    return trip.tags.some((tag) => tripTags.includes(tag));
  });

  if (loading) {
    return <LoaderExternal/>;
  }

  if (similarTrips.length === 0) {
    
    return null;
  }else{

    console.log(similarTrips.length)
  }

  // Arabic helper
  const createPersonsArabic = (groupSize) => {
    if (!groupSize || typeof groupSize !== "string") return "";
    const [from, to] = groupSize.split("-").map((n) => parseInt(n.trim(), 10));

    if (to === 0 || from === to) {
      return from === 1 ? "شخص" : `${from} أشخاص`;
    }
    return `${from} - ${to} أشخاص`;
  };


  const isSingleCard = similarTrips.length === 1;


  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
    scrollRef.current.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };



  const hoursToDays = (hours) =>{


    const days = Math.ceil(hours/24);
    
    
    return days;
    
    }


    const OneTripHoursModifier = (num) => {
      if (!num) return '';
      if (num === 1) return ' ساعة واحدة';
      if (num === 2) return 'ساعتان';
      if (num >= 3 && num <= 10) return `${num} ساعات`;
      return `${num} ساعات `;
    };
    


    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  return (
    <div className="py-[80px]">
      <div className="wrapper">
        <div className="flex flex-col gap-[4px]">
          <p className="text-orange font-bold-500 text-[16px]">شاهد خيارات اخرى</p>
          <h2 className="text-[24px] sm:text-[28px] md:text-[36px] lg:[48px] font-bold-600">
            عروض مشابهة
          </h2>
        </div>




        {similarTrips.length ===1 ?  (


<div className="mt-[48px] px-4 sm:px-8 scale-x-[-1] w-full sm:scale-x-[1] relative" dir="rtl">
      <Link
        key={similarTrips[0].id}
        href={`/travels-programs/${similarTrips[0].id}`}
        className="mb-4 scale-x-[-1]  sm:scale-x-[1] "
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
  src={
    similarTrips[0].lengthType === "ONE_DAY"
      ? `${baseUrl}/media/${similarTrips[0].cardThumbnail}`
      : similarTrips[0].cardThumbnail
  }
  fill
  className="rounded-t-[12px] object-cover"
/>


            <div className="absolute top-[16px] right-[16px]">
              <button className="outline-none bg-[#F08631] text-white py-[12px] px-[20px] flex items-center justify-center text-[12px] rounded-[12px]">
                {similarTrips[0]?.offerType}
              </button>
            </div>
            <div className="absolute bottom-2 right-[5px]">
<span className="bg-primary text-white text-[10px] py-[7px] px-[12px] rounded-[8px]">
{similarTrips[0]?.programType || "برنامج سياحي"}
</span>
</div>


          </div>

          <div className="p-[16px] flex flex-col gap-[16px] h-[175px]">
            <div className="flex flex-col gap-[8px] ">
              <div className="flex justify-between items-center">
                <h6 className="font-bold-600 text-[16px] line-clamp-1">{similarTrips[0]?.title}</h6>
              </div>
              <div className="h-[32px] flex items-start">
                <p className="text-[12px] text-grey line-clamp-2">{similarTrips[0]?.description}</p>
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
                {similarTrips[0]?.price}
              </p>
              <div className="flex flex-col gap-[2px] text-[12px] text-grey mr-auto">
              <div className="flex gap-x-[4px] pr-[8px] mr-auto">

              <p>{createPersonsArabic(similarTrips[0]?.groupSize)}</p>
            
              </div>

               
                <div className="flex gap-x-[4px] pr-[8px] mr-auto">
             
                  <p className="flex gap-x-[4px] pr-[8px]">
                  {hoursToDays(similarTrips[0].durationHours)}
                  <span>أيام و</span>
                  {similarTrips[0].night}
                  <span >{hoursToDays(similarTrips[0].durationHours)-1} ليالي </span>
                </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
</div>




) : (







  <div className="relative w-full">
      {/* Left Arrow */}
      {similarTrips.length > 1 && (
        <button
          onClick={() => scroll('left')}
          className=" sm:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 rounded-full w-10 h-10"
        >
          <ChevronLeft className="text-gray-600 mr-2 md:mr-0 lg:mr-0" />
        </button>
      )}
          
<div
        ref={scrollRef}
        className={`
          flex gap-4 overflow-x-auto px-4 py-6 scroll-smooth
          scrollbar-hide snap-x snap-mandatory
          ${isSingleCard ? 'justify-center' : ''}
        `}
      >



  {similarTrips.map(( node ) => (
      <Link
        key={node.id}
        href={`/travels-programs/${node.id}`}
        className="mb-4 w-[300px] min-w-[300px] sm:w-[360px] sm:min-w-[360px]"

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
  src={
    node.lengthType === "ONE_DAY"
      ? `${baseUrl}/media/${node.cardThumbnail}`
      : node.cardThumbnail
  }
  fill
  className="rounded-t-[12px] object-cover"
/>

            <div className="absolute top-[16px] right-[16px]">
              <button className="outline-none bg-[#F08631] text-white py-[12px] px-[20px] flex items-center justify-center text-[12px] rounded-[12px]">
                {node?.offerType}
              </button>
            </div>
            <div className="absolute bottom-2 right-[5px]">
<span className={node.lengthType ==="ONE_DAY" ? `bg-green-800 text-white text-[10px] py-[7px] px-[12px] rounded-[8px]` :`bg-primary text-white text-[10px] py-[7px] px-[12px] rounded-[8px]` }>

{node.lengthType ==="ONE_DAY" ? <>{node.programType || "رحلة سياحية"}</> : <>{node.programType || "برنامج سياحي"}</>}


</span>
</div>


          </div>

          <div className="p-[16px] flex flex-col gap-[16px] h-[175px]">
            <div className="flex flex-col gap-[8px] ">
              <div className="flex justify-between items-center">
                <h6 className="font-bold-600 text-[16px] line-clamp-1">{node?.title}</h6>
              </div>
              <div className="h-[32px] flex items-start">
                <p className="text-[12px] text-grey line-clamp-2">{node?.description}</p>
              </div>
              <div className="flex gap-x-[4px] items-center text-[12px] text-grey">

              <Image alt="" src="/icons/daily/car.svg" className="mt-2" height={20} width={20} />
              <p>رحلة خاصة </p>


                {/**
                 * 
                 * 
                 * <Image alt="" src="/icons/daily/car.svg" height={20} width={20} />
                {node.subTypes?.map((p, i) => (
                  <span key={p.id || i}>
                    {i < node.subTypes.length - 1 ? p.type + " - " : p.type}
                  </span>
                ))}
                 * 
                 * 
                 * 
                 */}
                
              </div>
            </div>

            <div className="flex gap-x-[16px] items-center mt-auto ">
              <p className="price font-bold-600 text-[36px] ">
                <span  >$</span>
                {node?.price}
              </p>
              <div className="flex flex-col gap-[2px] text-[12px] text-grey mr-auto">
              <div className="flex gap-x-[4px] pr-[8px] mr-auto">

              <p>{createPersonsArabic(node?.groupSize)}</p>
            
              </div>

               
                <div className="flex gap-x-[4px] pr-[8px] mr-auto">

                  {node.lengthType ==="MULTI_DAY" ? <>
                  
                  
                    <p className="flex gap-x-[4px] pr-[8px]">
   {hoursToDays(node?.durationHours)}
   <span>أيام</span>
              
   {node.night}
                  {hoursToDays(node?.durationHours) - 1 > 0 && (
  <span>{hoursToDays(node?.durationHours) - 1} وليالي</span>
)}
                </p>
                  
                  
                  </> : <>
                  
                  
                  
                  <p className="flex gap-x-[4px] pr-[8px]">
                  <Clock width={20} height={20} className='text-orange'  ></Clock>
                    
                {OneTripHoursModifier(node?.durationHours
                  
                )}
          
           
                </p>
                  
                  
                  
                  </>}


                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    ))}
  </div>

        {/* Right Arrow */}
        {similarTrips.length > 1 && (
        <button
          onClick={() => scroll('right')}
          className=" sm:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 rounded-full w-10 h-10"
        >
          <ChevronRight className="text-gray-600 mr-2 md:mr-0 lg:mr-0" />
        </button>
      )}
</div>



)}

        

   
      </div>
    </div>
  );
};

export default SimilarTrips;

// Arrows
function SampleNextArrow({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="absolute top-[-50px] right-[48px] sm:left-0 z-[999] bg-white"
    >
      <div className="w-[40px] h-[40px] cursor-pointer hover:scale-[0.95] duration-300 ease-in relative">
        <Image alt="" src="/icons/slick/arrow.png" fill />
      </div>
    </div>
  );
}

function SamplePrevArrow({ onClick }) {
  return (
    <div
      className="absolute top-[-50px] right-0 sm:left-[48px] z-[999] bg-white"
      onClick={onClick}
    >
      <div className="w-[40px] h-[40px] cursor-pointer hover:scale-[0.95] duration-300 ease-in relative">
        <Image alt="" src="/icons/slick/arrow.png" className="rotate-[180deg]" fill />
      </div>
    </div>
  );
}
