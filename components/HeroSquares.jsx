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
    <div className="mt-8 w-full">
      <div className="w-full max-w-none">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-row gap-6 justify-center items-center px-4">
          {countrySquares.map(({ name, img }) => (
            <div
              key={name}
              onClick={() => handleClick(name)}
              className="relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-56 w-56"
              aria-label={`عرض البرامج في ${name}`}
            >
              <Image
                src={img}
                alt={name}
                width={224}
                height={224}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl select-none">
                {name}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Layout with Horizontal Scroll */}
        <div className="md:hidden relative">
          <div
            className="flex gap-4 px-4 pb-4 overflow-x-auto"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {countrySquares.map(({ name, img }) => (
              <div
                key={name}
                onClick={() => handleClick(name)}
                className="relative flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-32 w-32"
                style={{
                  scrollSnapAlign: "start",
                  minWidth: "128px", // Ensures consistent width
                }}
                aria-label={`عرض البرامج في ${name}`}
              >
                <Image
                  src={img}
                  alt={name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-base select-none text-center px-2">
                  {name}
                </div>
              </div>
            ))}
          </div>
          
          {/* Scroll Indicator */}
      
        </div>
      </div>
    </div>
  );
};