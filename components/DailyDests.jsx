import React from "react";
import SlickSlider from "./sub/SlickSlider";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import PrevTitle from "./PrevTitle";
import { useQuery } from "@apollo/client";
import { GET_ONE_DAY_TRIPS } from "../graphql/queries";




const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.5, duration: 0.6 },
  },
};

const DailyDests = () => {
  const { loading, error, data } = useQuery(GET_ONE_DAY_TRIPS);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) return <p>Error loading trips</p>;

  const oneDayTrips =
    data?.trips?.edges?.filter(({ node }) => node.__typename === "OneDayTripNode") || [];

    const settings = {
      rtl: true,
      infinite: false,
      speed: 800,
      slidesToShow: 4,
      slidesToScroll: 2,
      autoplay: true,
      autoplaySpeed: 3000,
      cssEase: "ease",
      pauseOnHover: true,
      arrows: true, // <- Force arrows
      nextArrow: <SampleNextArrow rtl={true} />,
      prevArrow: <SamplePrevArrow rtl={true} />,
      responsive: [
        { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 2 } },
        { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 640, settings: { slidesToShow: 1.2, slidesToScroll: 1 } },
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

        <div className="mt-[48px] scale-x-[-1] sm:scale-x-[1] relative" dir="rtl">
          <SlickSlider settings={settings}>
            {oneDayTrips.map(({ node }) => (
              <Link
                key={node.id}
                href={`/travels-programs/${node.id}`}
                className="mb-4 scale-x-[-1] sm:scale-x-[1] "
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
                      src={`https://backend.arrivotravel.com/media/${node.cardThumbnail}`}
                      fill
                      className="rounded-t-[12px] object-cover"
                    />
                    <div className="absolute top-[16px] right-[16px]">
                      <button className="outline-none bg-[#F08631] text-white py-[12px] px-[20px] flex items-center justify-center text-[12px] rounded-[12px]">
                        {node?.offerType}
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-[5px]">
                      <span className="bg-green-700 text-white text-[10px] py-[7px] px-[12px] rounded-[8px]">
                        {node.programType || "رحلة سياحية "}
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

                        {/**
                         * 
                         * 
                         * 
                         * 
                         *   <Image alt="" src="/icons/daily/car.svg" height={20} width={20} />
                        رحلة خاصة
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
                        <p>{createPersonsArabic(node?.groupSize)}</p>
                        <div className="flex gap-x-[4px] pr-[8px] mr-auto">
                          <Image alt="" src="/icons/daily/clock.svg" height={20} width={20} />
                          <p className="flex gap-x-1">
                            {node?.durationHours}
                            <span> ساعات</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </SlickSlider>
        </div>
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
