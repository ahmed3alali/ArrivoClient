import Image from "next/image";
import { useRouter } from "next/router";

const countrySquares = [
  { name: "بحرة ايجة", img: "/images/programs/Background-1.jpg" },
  { name: "الانضول", img: "/images/programs/Background-2.jpg" },
  { name: "ريزا", img: "/images/programs/Background-3.jpg" },
  { name: "اسطنبول", img: "/images/programs/Background-4.jpg" },
  { name: "طرابزون", img: "/images/programs/Background-1.jpg" },
];

const renderSearchResults = (city) => {
  if (!city) return "";
  const normalized = city.toLowerCase();
  if (["اسطنبول"].includes(normalized)) return "İstanbul";
  if (["طرابزون"].includes(normalized)) return "trabzon";
  if (["ريزا"].includes(normalized)) return "rize";

  return city;
};

export const HeroSquares = () => {
  const router = useRouter();

  const handleClick = (name) => {
    const country = renderSearchResults(name);
    window.location.href = `/travels-programs?type=programs&country=${encodeURIComponent(country)}`;
  };
  

  return (
    <div className="mt-8 w-full flex justify-center">
      <div className="w-full max-w-none px-4">
        <div
          className="
            flex flex-row gap-6 justify-center items-center
            md:gap-4 
            sm:overflow-x-auto sm:justify-start sm:px-4
            scrollbar-hide
          "
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {countrySquares.map(({ name, img }) => (
            <div
              key={name}
              onClick={() => handleClick(name)}
              className="relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-32 w-32 md:h-56  md:w-56"
              style={{
                scrollSnapAlign: "start",
              }}
              aria-label={`عرض البرامج في ${name}`}
            >
              <Image
                src={img}
                alt={name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center top-0 text-white font-bold text-xl select-none ">
                {name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
