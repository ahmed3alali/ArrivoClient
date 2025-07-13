import React, {useRef, useState} from "react";
import SlickSlider from "./sub/SlickSlider";
import Image from "next/image";
import {motion} from "framer-motion";
import Link from "next/link";
import PrevTitle from "./PrevTitle";
import { GET_ONE_DAY_TRIPS } from "../graphql/queries";
import { useQuery } from "@apollo/client";

const destins = [
  {
    img: "dests/5.png",
    title: "أنطاليا",
    rating: {
      avg: 5.0,
      count: 19,
    },
    description: "رحلة جميلة و رائعة إلى مدينة أنطاليا",
    price: 4170,
    persons: {from: 3, to: 8},
    hours: 10,
    offer: "العرض الإقتصادي ",
  },
  {
    img: "dests/trabzon.png",
    title: "طرابزون",
    rating: {
      avg: 5.0,
      count: 19,
    },
    description: "رحلة جميلة و رائعة إلى مدينة طرابزون",
    price: 1610,
    persons: {from: 2, to: 0},
    hours: 10,
    offer: "العرض الإقتصادي ",
  },
  {
    img: "dests/2.png",
    title: "الشمال التركي",
    rating: {
      avg: 5.0,
      count: 19,
    },
    description: "أوزنجول - إيدر - طرابزون ",
    price: 1690,
    persons: {from: 6, to: 7},
    hours: 10,
    offer: "العرض الفاخر العائلي ",
  },
  {
    img: "dests/3.png",
    title: "الشمال التركي",
    rating: {
      avg: 5.0,
      count: 19,
    },
    description: "رحلة جميلة و رائعة إلى مدينة طرابزون",
    price: 3490,
    persons: {from: 6, to: 8},
    hours: 10,
    offer: "العرض الإقتصادي ",
  },
  {
    img: "dests/4.png",
    title: "الشمال التركي",
    rating: {
      avg: 5.0,
      count: 19,
    },
    description: "رحلة جميلة و رائعة إلى مدينة طرابزون",
    price: 2270,
    persons: {from: 6, to: 8},
    hours: 10,
    offer: "العرض الإقتصادي ",
  },
];
const titleVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.6,
    },
  },
};

const settings = {
  // dots: true,
  // infinite: true,
  speed: 800,
  slidesToShow: 4,
  slidesToScroll: 2,
  initialSlide: 0,

  // swipeToSlide: false,

  // fade: true,
  autoplay: true,
  autoplaySpeed: 3000,
  cssEase: "ease",

  // centerPadding: 30,

  pauseOnHover: true,
  nextArrow: <SamplePrevArrow />,
  prevArrow: <SampleNextArrow />,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 2,
        initialSlide: 0,
        // infinite: true,
        // dots: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        // infinite: true,
        // dots: true,
      },
    },
    {
      breakpoint: 640,
      settings: {
        slidesToShow: 1.15,
        slidesToScroll: 1,
      },
    },
  ],
  // rtl: true,
};
const DailyDests = () => {
  const { loading, error, data } = useQuery(GET_ONE_DAY_TRIPS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading trips</p>;

  const oneDayTrips = data?.trips?.edges
    ?.filter(({ node }) => node.__typename === "OneDayTripNode") || [];

  const createPersonsArabic = (groupSize) => {
    // Assuming groupSize is a number or an object with from/to:
    // You may need to adapt this based on actual data
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
            <PrevTitle prevTitle={"عروض رائعة"} />

            <motion.h2
              variants={titleVariants}
              initial="hidden"
              whileInView="show"
              className="text-[28px] md:text-[36px] font-bold-600"
            >
              إكتشف أحدث الوجهات
            </motion.h2>
          </div>
        </div>
        <div
          className="mt-[48px] scale-x-[-1] sm:scale-x-[1] relative"
          dir="rtl"
        >
          <SlickSlider settings={settings}>
            {oneDayTrips.map(({ node }) => (
           <Link
           key={node.id}
           href={`/travels-programs/${node.id}`}
           className="mb-4 scale-x-[-1] sm:scale-x-[1]"
         >
         
                <div
                  dir="rtl"
                  className="relative flex flex-col bg-white rounded-[12px] mx-[5px]"
                  style={{
                    boxShadow: "0px 4px 8px rgba(91, 116, 130, 0.08)",
                    border: "1px solid rgba(152, 162, 179, 0.25)",
                  }}
                >
                  <div className="relative h-[245px] w-full">
                    <Image
                      alt=""
                      src={`https://backend.arrivotravel.com/media/${node.cardThumbnail}`}
                      fill
                      className="rounded-t-[12px]"
                    />
                    <div className="absolute top-[16px] right-[16px]">
                      <button className="outline-none bg-orange text-white py-[12px] px-[20px] flex items-center justify-center text-[12px] rounded-[12px]">
                        {node.offerType}
                      </button>
                    </div>
                  </div>
                  <div className="p-[16px] flex flex-col gap-[16px]">
                    {/* first part */}
                    <div className="flex flex-col gap-[8px]">
                      <div className="flex justify-between items-center">
                        <h6 className="font-bold-600 text-[16px]">
                          {node.title}
                        </h6>
                        <div className="flex gap-x-[4px] text-[12px] items-center text-grey">
                          <Image
                            alt=""
                            src="/icons/star.svg"
                            height={20}
                            width={20}
                          />
                          <span></span>
                          <span>.</span>
                          <span>
                            <span></span> تقييم
                          </span>
                        </div>
                      </div>
                      <p className="text-[12px] text-grey truncate">
                        {node.description}
                      </p>
                      <div className="flex gap-x-[4px] items-center text-[12px] text-grey">
                        <Image
                          alt=""
                          src="/icons/daily/car.svg"
                          height={20}
                          width={20}
                        />
                       
                      </div>
                    </div>
                    {/* second part */}
                    <div className="flex gap-x-[16px] items-center">
                      <p className="price font-bold-600 text-[36px]">
                        <span>$</span>
                        {node.price}
                      </p>
                      <div className="flex flex-col gap-[2px] text-[12px] text-grey">
                      <p>{createPersonsArabic(node.groupSize)}</p>
                        <p className="flex gap-x-[4px] pr-[8px]">
                          {node.durationHours}
                          <span>أيام</span>
                          {node.night}
                          <span>ليالي</span>
                        </p>
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

function SampleNextArrow(props) {
  const {className, style, onClick} = props;
  // console.log(className);
  return (
    <div
      onClick={onClick}
      className="absolute top-[-50px] left-0 z-[999] bg-white"
    >
      <div className="w-[40px] h-[40px]  cursor-pointer hover:scale-[0.95] duration-300 ease-in relative">
        <Image alt="" src="/icons/slick/arrow.png" fill />
      </div>
    </div>
  );
}

function SamplePrevArrow(props) {
  const {className, style, onClick} = props;
  return (
    <div
      className="absolute top-[-50px] left-[48px] z-[999] bg-white"
      onClick={onClick}
    >
      <div className="w-[40px] h-[40px] cursor-pointer hover:scale-[0.95] duration-300 ease-in relative">
        <Image
          alt=""
          src="/icons/slick/arrow.png"
          className="rotate-[180deg]"
          fill
        />
      </div>
    </div>
  );
}
