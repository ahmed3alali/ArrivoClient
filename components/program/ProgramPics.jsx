import Image from "next/image";
import React, { useEffect, useState } from "react";
import SlickSlider from "../sub/SlickSlider";
import Link from "next/link";

const BASE_URL = "https://backend.arrivotravel.com/media"; // Change in production

const ProgramPics = ({ trip, isProgramTravel, viewingTrip }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [midScreen, setIsMidScreen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 640);
      setIsMidScreen(window.innerWidth < 1024);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const imgs = [];

  if (isProgramTravel) {
    console.log("the trip is : " , trip);
    if (trip?.cardThumbnail) {
      imgs.push({ src: trip.cardThumbnail });
    }

    if (trip?.thumbnailsBase64?.[0]) {
      imgs.push({ src: viewingTrip.thumbnailsBase64[0] });
    }

    if (trip?.galleryImages?.length) {
      trip.galleryImages.forEach((img) => {
        imgs.push({ src: `${BASE_URL}/${img.picture}` });
      });
    }
  } else {
    console.log("the trip is : " , trip);
    console.log("the trip's card thumbnail is : " , trip?.cardThumbnail)


    if (trip?.cardThumbnail) {
      imgs.push({ src: `${BASE_URL}/${trip.cardThumbnail}` });
    }


    

    if (trip?.galleryImages?.length) {
      trip.galleryImages.forEach((img) => {
        imgs.push({ src: `${BASE_URL}/${img.picture}` });
      });
    }
  }

  const settings = {
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 7500,
    cssEase: "ease",
    pauseOnHover: true,
    rtl: true,
  };

  if (imgs.length === 0) {
    return <p>No images available</p>;
  }

  return (
    <div className="py-[10px] md:py-[20px]">
      <div className="bigbox relative">
        {!isProgramTravel ? (
          <div className="grid grid-cols-12 grid-rows-4 gap-4 md:h-[476px]">
            <div className="col-span-12 row-span-4 h-[520px] sm:h-[476px] md:h-auto relative">
              <Image
                src={imgs[0].src}
                alt=""
                className="object-cover rounded-[12px] hover:opacity-[0.9]"
                fill
                unoptimized
              />
            </div>
          </div>
        ) : isSmallScreen ? (
          <div className="w-full relative">
            <SlickSlider settings={settings}>
              {imgs.map((img, i) => (
                <div
                  key={i}
                  className="col-span-12 h-[520px] sm:h-[300px] md:h-auto relative w-full"
                >
                  <Image
                    src={img.src}
                    alt={`Trip image ${i + 1}`}
                    className="object-cover rounded-[12px] hover:opacity-[0.9]"
                    fill
                    unoptimized
                  />
                </div>
              ))}
            </SlickSlider>
          </div>
        ) : midScreen ? (
          <div className="grid grid-cols-12 grid-rows-2 gap-4 lg:h-[476px]">
            {imgs.slice(0, 3).map((img, i) => {
              const classes =
                i === 0
                  ? "col-span-12 lg:col-span-6 row-span-4 h-[389px] lg:h-auto relative"
                  : "col-span-6 lg:col-span-3 h-[300px] lg:h-auto relative";
              return (
                <div key={i} className={classes}>
                  <Image
                    src={img.src}
                    alt={`Trip image ${i + 1}`}
                    className="object-cover rounded-[12px] hover:opacity-[0.9]"
                    fill
                    unoptimized
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-12 grid-rows-2 gap-4 md:h-[476px]">
            {imgs.slice(0, 5).map((img, i) => {
              let classes = "col-span-12 md:col-span-3 h-[300px] md:h-auto relative";
              if (i === 0)
                classes = "col-span-12 md:col-span-6 row-span-2 h-[300px] md:h-auto relative";
              return (
                <div key={i} className={classes}>
                  <Image
                    src={img.src}
                    alt={`Trip image ${i + 1}`}
                    className="object-cover rounded-[12px] hover:opacity-[0.9]"
                    fill
                    unoptimized
                  />
                </div>
              );
            })}
          </div>
        )}

        <Link
          href="/travels-programs/program/travels-images"
          className="absolute bottom-[10px] left-[10px] md:bottom-[15px] md:left-[15px] flex justify-center items-center gap-[8px] h-[40px] py-[10px] px-[16px] bg-white text-black border-0 outline-none rounded-[8px]"
        >
          <span className="text-[12px]">أظهر المزيد من الصور</span>
          <Image src="/icons/camera.png" height={20} width={20} alt="" />
        </Link>
      </div>
    </div>
  );
};

export default ProgramPics;
