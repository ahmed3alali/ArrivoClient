import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/router";

const SearchAndContact = () => {
  const router = useRouter();

  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSearchFocus = () => {
    setSuggestions(["رحلة عرسان", "طرابزون", "اسطنبول"]);
  };

  const handleSearchBlur = () => {
    // Delay clearing so clicks on suggestions register
    setTimeout(() => setSuggestions([]), 150);
  };

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
  
    const sanitizedValue = rawValue.replace(/[^a-zA-Z0-9ığüşöçİĞÜŞÖÇء-يآأإىةًٌٍَُِّ ]/g, "");
  
    setInputValue(sanitizedValue);
  
    if (sanitizedValue !== "") {
      const filteredSuggestions = ["رحلة عرسان", "طرابزون", "اسطنبول"].filter(
        (suggestion) =>
          suggestion.toLowerCase().startsWith(sanitizedValue.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions(["اسطنبول", "طرابزون", "رحلة عرسان"]);
    }
  };
  
  const goToResults = (title) => {
    router.push(`/travels-programs?type=programs&title=${encodeURIComponent(title)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      goToResults(inputValue.trim());
    }
  };

  const animateVariants = {
    hidden: { translateY: -20, opacity: 0 },
    show: {
      translateY: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
  };




  return (
    <div
      className={`hidden md:flex gap-x-2 items-center h-[48px] bg-white rounded-[40px] border border-[#C8CBD0] py-[12px] px-[6px] lg:pt-[10x] lg:px-[10px] lg:pr-[16px] relative ${
        suggestions.length > 0 ? "border-[#F08631]" : ""
      }`}
    >
      <input
        type="text"
        className="border-0 outline-none bg-transparent flex-1 text-[12px] xl:text-[16px]"
        placeholder="إلى أين تريد أن تذهب؟"
        onFocus={handleSearchFocus}
        onBlur={handleSearchBlur}
        onChange={handleInputChange}
        value={inputValue}
        onKeyDown={handleKeyDown}
      />
      <div className="flex justify-center items-center bg-orange p-[8px] w-[28px] h-[28px] rounded-full">
        <Image src="/icons/search-white.svg" alt="/" height={24} width={24} />
      </div>
      {suggestions.length > 0 && (
        <motion.ul
          variants={animateVariants}
          initial="hidden"
          animate="show"
          className="absolute top-[50px] left-0 right-0 bg-white border-[1px] border-[#98A2B3] rounded-[8px] p-[14px] z-[7777]"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => goToResults(suggestion)}
              className="px-[12px] py-[8px] hover:bg-[#F08631] hover:text-white cursor-pointer rounded-[4px] text-[12px]"
            >
              {suggestion}
            </li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default SearchAndContact;
