import React, { useEffect, useState } from "react";
import SlickSlider from "./sub/SlickSlider";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import PrevTitle from "./PrevTitle";
import { useQuery } from "@apollo/client";
import { GET_MULTI_DAY_TRIPS } from "../graphql/queries";
import MultiDayTripCard from "./MultiDayTripCard";
import MultiTripCardSlider from "./MultiTripCardSlider";
import LoaderExternal from "./LoadingExternal";





const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.6 },
  },
};

const Destinations = () => {


  const { loading: loadingMultiTrips, error: errorMultiTrips, data: dataMultiTrips } = useQuery(GET_MULTI_DAY_TRIPS);
  const multiTrips = dataMultiTrips?.trips?.edges || []


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
  

  if (loadingMultiTrips) {
    return (
     <LoaderExternal/>
    );
  }






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
    if (!groupSize || typeof groupSize !== "string") return "";
  
    const parts = groupSize.split("-").map((p) => parseInt(p.trim(), 10)).filter(Boolean);
  
    if (parts.length === 1) {
      return parts[0] === 1 ? "1 شخص" : `${parts[0]} أشخاص`;
    } else if (parts.length === 2) {
      if (parts[1] === 0 || parts[0] === parts[1]) {
        return parts[0] === 1 ? "1 شخص" : `${parts[0]} أشخاص`;
      }
      return `${parts[0]} - ${parts[1]} أشخاص`;
    }
  
    return "";
  };


const hoursToDays = (hours) =>{


const days = Math.ceil(hours/24);


return days;

}

  
  return (
    <div className="py-[80px]">
      <div className="wrapper">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[4px] m-auto mb-4">
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
        </div>



  {multiTrips.length ===1 ? (


<div className=" flex justify-center md:justify-start md:w-[320px] md:mr-4 mt-[48px] relative" dir="rtl">
   <MultiDayTripCard isSingle={true} data={multiTrips}></MultiDayTripCard>
</div>




) : (





<div className="mt-[48px] px-4 sm:px-8  relative" dir="rtl">
<MultiTripCardSlider trips={multiTrips} isSingle={false}></MultiTripCardSlider>
          
  
</div>



)}





    </div>
  );
};

export default Destinations;

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute top-[-50px] left-[48px] z-[999] bg-white"
    >
      <div className="w-[40px] h-[40px] cursor-pointer hover:scale-[0.95] duration-300 ease-in relative">
        <Image alt="" src="/icons/slick/arrow.png" className="rotate-[180deg]" fill />
      </div>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <div
      onClick={onClick}
      className="absolute top-[-50px] left-0 z-[999] bg-white"
    >
      <div className="w-[40px] h-[40px] cursor-pointer hover:scale-[0.95] duration-300 ease-in relative">
        <Image
          alt=""
          src="/icons/slick/arrow.png"
          className=""
          fill
        />
      </div>
    </div>
  );
}