import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Select, { components } from "react-select";
import { motion } from "framer-motion";

const items = [
  { icon: "searches/rings.svg", title: "شهر عسل" },
  { icon: "searches/car.svg", title: "رحلات عائلية" },
  { icon: "searches/world.svg", title: "رحلات فردية" },
  { icon: "searches/mintad.svg", title: "أنشطة و مغامرات" },
  { icon: "searches/khima.svg", title: "تخييم" },
];

const options = Array.from({ length: 7 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

const optionsCountries = [
  { value: "trabzaon", label: "طرابزون" },
  { value: "rize", label: "ريزا" },
  { value: "anadolu", label: "اناضول" },
  { value: "ege-deniz", label: "دينيز" },
  { value: "istanbul", label: "اسطنبول" },
];

// ---------------------
// Custom Components
// ---------------------
const LocationSingleValue = ({ data, ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex items-center gap-2">
      <Image alt="" src="/icons/book/geo.svg" width={20} height={20} />
      <span className="text-sm">{data.label}</span>
    </div>
  </components.SingleValue>
);

const PersonSingleValue = ({ data, ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex items-center gap-2">
      <Image alt="" src="/icons/book/profile.svg" width={20} height={20} />
      <span className="text-sm">{data.label}</span>
    </div>
  </components.SingleValue>
);

// Animated Dropdown Menu
const CustomMenu = (props) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    <components.Menu {...props} />
  </motion.div>
);

// Common search item
const SearchedItem = ({ item }) => {
  const { title, icon } = item;
  return (
    <div className="py-2 px-5 bg-[#F5F8FB] flex gap-2 items-center rounded-[8px] cursor-pointer hover:bg-orange/10 transition duration-150">
      <Image alt="" src={`/icons/book/${icon}`} height={32} width={32} />
      <p className="text-[12px] font-bold text-[#3E444D]">{title}</p>
    </div>
  );
};

// ---------------------
// Main Component
// ---------------------
const Book = () => {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState();
  const [selectedOptionCountries, setSelectedOptionCountries] = useState();

  const variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.5,
      },
    },
    hidden: {
      opacity: 0,
      y: -50,
    },
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "44px",
      borderRadius: "8px",
      border: state.isFocused ? "1px solid #F08631" : "1px solid #e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 2px #FFF5F0" : "none",
      transition: "all 0.2s ease-in-out",
      backgroundColor: "#fff",
      "&:hover": {
        borderColor: "#F08631",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 12px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }),
    singleValue: (base) => ({
      ...base,
      display: "flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "14px",
      color: "#333",
    }),
    placeholder: (base) => ({
      ...base,
      fontSize: "13px",
      color: "#A0A4AB",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "8px",
      marginTop: "4px",
      padding: "4px 0",
      boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      padding: "10px 16px",
      fontSize: "13px",
      backgroundColor: state.isSelected
        ? "#F08631"
        : state.isFocused
        ? "#FFF5F0"
        : "#fff",
      color: state.isSelected
        ? "#fff"
        : state.isFocused
        ? "#F08631"
        : "#333",
      cursor: "pointer",
      transition: "background-color 0.2s, color 0.2s",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#F08631",
      padding: "0 8px",
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const selectTheme = (theme) => ({
    ...theme,
    borderRadius: 8,
    colors: {
      ...theme.colors,
      primary25: "#FFF5F0",
      primary: "#F08631",
    },
  });

  return (
    <div className="py-[80px]">
      <div className="wrapper">
        <div className="flex flex-col gap-[28px] md:max-w-[897px] md:mx-auto">
          {/* Select Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={variants}
            className="px-4 py-9 shadow-md rounded-lg"
          >
            <div className="flex flex-col md:flex-row gap-[20px]">
              {/* City */}
              <div className="flex-1 flex flex-col gap-[8px] md:gap-[13px] h-[68px]">
                <h6 className="text-[14px]">إختر المدينة</h6>
                <Select
                  placeholder="اختر المدينة"
                  onChange={setSelectedOptionCountries}
                  options={optionsCountries}
                  className="w-full"
                  components={{
                    SingleValue: LocationSingleValue,
                    Menu: CustomMenu,
                  }}
                  styles={selectStyles}
                  theme={selectTheme}
                />
              </div>

              {/* Persons */}
              <div className="flex-1 flex flex-col gap-[8px] md:gap-[13px] h-[68px]">
                <h6 className="text-[14px]">إختر عدد الأشخاص</h6>
                <Select
                  placeholder="عدد الأشخاص"
                  onChange={setSelectedOption}
                  options={options}
                  className="w-full"
                  components={{
                    SingleValue: PersonSingleValue,
                    Menu: CustomMenu,
                  }}
                  styles={selectStyles}
                  theme={selectTheme}
                />
              </div>

              {/* Button */}
              <button
  onClick={() => {
    if (selectedOptionCountries && selectedOption) {
      router.push(
        `travels-programs?type=programs&search=${encodeURIComponent(selectedOptionCountries.label)}&minPersons=1&maxPersons=${selectedOption.value}`
      );
    } else {
      router.push(`travels-programs?type=programs`);
    }
  }}
  className="flex-1 text-white flex py-[24px] mt-4 px-[20px] gap-[4px] items-center justify-center h-[68px] rounded-[8px] bg-orange hover:bg-[#D45C00] transition duration-200"
>
                <Image
                  alt=""
                  src="/icons/book/calendar-white.svg"
                  height={24}
                  width={24}
                />
                <span className="text-[16px] font-bold">إحجز مكانك</span>
              </button>
            </div>
          </motion.div>

          {/* Common Searches */}
          <div className="flex flex-col gap-[8px]">
            <h6 className="text-[16px] text-center">عمليات البحث الشائعة :</h6>
            <div className="flex flex-wrap gap-[20px] justify-center">
              {items.map((item, i) => (
                <SearchedItem key={i} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Book;
