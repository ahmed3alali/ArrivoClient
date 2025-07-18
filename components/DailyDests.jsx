import React, { useEffect, useState } from "react";
import SlickSlider from "./sub/SlickSlider";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import PrevTitle from "./PrevTitle";
import { useQuery } from "@apollo/client";
import { GET_ONE_DAY_TRIPS } from "../graphql/queries";
import OneDayTripCard from "./OneDayTripCard";
import TripCardSlider from "./OneTripCardSlider";
import LoaderExternal from "./LoadingExternal";
import { ErrorMessage } from "./ErrorMessage";




const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.6 },
  },
};

const DailyDests = () => {
  
  
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


  
  const { loading, error, data } = useQuery(GET_ONE_DAY_TRIPS);
  if (loading) {
    return (
      <LoaderExternal/>
    );
  }


  if (error) return <ErrorMessage/>;

  const oneDayTrips =
    data?.trips?.edges?.filter(({ node }) => node.__typename === "OneDayTripNode") || [];




    const settings = {
      rtl: !isMobile,
      infinite: false,  
      speed: 800,
      slidesToShow: 4,
      slidesToScroll: 2,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: "ease",
      pauseOnHover: true,
      nextArrow: <SampleNextArrow />,
      prevArrow: <SamplePrevArrow />,
      responsive: [
        {
          breakpoint: 1280,
          settings: { slidesToShow: 3, slidesToScroll: 2 },
        },
        {
          breakpoint: 768,
          settings: { slidesToShow: 2, slidesToScroll: 1 },
        },
        {
          breakpoint: 640,
          settings: { slidesToShow: 1.2, slidesToScroll: 1 },
        },
      ],
    };
  
    
  const createPersonsArabic = (groupSize) => {
    if (!groupSize) return "";
    if (typeof groupSize === "number") return `${groupSize} أشخاص`;
    if (groupSize.from && groupSize.to) {
      if (groupSize.to === 0) return `${groupSize.from} شخص`;
      return `${groupSize.from} - ${groupSize.to} أشخاص`;
    }
    return "";
  };

  return (
    <div className="py-[80px]">
      <div className="wrapper">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[4px]">
            <PrevTitle prevTitle={"رحلات يومية"} />
            <motion.h2
              variants={titleVariants}
              initial="hidden"
              whileInView="show"
              className="text-[24px] sm:text-[28px] md:text-[36px] lg:text-[48px] font-bold-600"
            >
              إستمتع و إكتشف أحدث الأماكن
            </motion.h2>
          </div>
        </div>





{oneDayTrips.length ===1 ? (



<div className=" flex justify-center md:justify-start  md:w-[320px] md:mr-4 mt-[48px] scale-x-[-1] sm:scale-x-[1] relative" dir="rtl">
<OneDayTripCard isSingle={true} data={oneDayTrips} />
</div>







):(


  <div className="mt-[48px] relative" dir="rtl">
     <TripCardSlider trips={oneDayTrips} isSingle={false}></TripCardSlider>
        </div>




)}

      
      </div>
    </div>
  );
};

export default DailyDests;

function SampleNextArrow({ onClick, rtl }) {
  return (
    <div
      onClick={onClick}
      className={`absolute top-[-50px] ${rtl ? 'right-[48px]' : 'left-0'} z-[999] bg-white`}
    >
      <div className="w-[40px] h-[40px] cursor-pointer hover:scale-[0.95] duration-300 ease-in relative">
        <Image
          alt=""
          src="/icons/slick/arrow.png"
          className={rtl ? 'rotate-[180deg]' : ''}
          fill
        />
      </div>
    </div>
  );
}

function SamplePrevArrow({ onClick, rtl }) {
  return (
    <div
      onClick={onClick}
      className={`absolute top-[-50px] ${rtl ? 'right-0' : 'left-[48px]'} z-[999] bg-white`}
    >
      <div className="w-[40px] h-[40px] cursor-pointer hover:scale-[0.95] duration-300 ease-in relative">
        <Image
          alt=""
          src="/icons/slick/arrow.png"
          className={rtl ? '' : 'rotate-[180deg]'}
          fill
        />
      </div>
    </div>
  );
}
