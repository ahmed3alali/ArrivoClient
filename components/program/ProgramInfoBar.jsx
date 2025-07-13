import React, {useEffect, useRef, useState} from "react";
import BarButton from "./helpers/BarButton";

const ProgramInfoBar = () => {
  const programInfoRef = useRef(null);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const sectionIds = ["summary", "program", "stay", "ratings", "terms", "faq"];
  
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Adjust this offset as needed
  
      let currentActive = sectionIds[0];
  
      for (let i = 0; i < sectionIds.length; i++) {
        const el = document.getElementById(sectionIds[i]);
        if (!el) continue;
        const offsetTop = el.offsetTop;
  
        if (scrollPosition >= offsetTop) {
          currentActive = sectionIds[i];
        } else {
          break; // Since sections are in order, no need to check further
        }
      }
  
      setActiveLink(currentActive);
    };
  
    window.addEventListener("scroll", handleScroll);
  
    // Run once on mount to set initial active link
    handleScroll();
  
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  

  return (
    <div
      className={`sticky top-0 z-[2000] bg-white overflow-x-scroll scrollbar-hide`}
      ref={programInfoRef}
    >
      <div className="min-w-[900px] flex">
        <BarButton
          id="summary"
          name="summary"
          text="ملخص"
          active={activeLink === "summary"}
        />
        <BarButton
          id="program"
          name="program"
          text="برنامج الرحلة"
          active={activeLink === "program"}
        />
        <BarButton
          id="stay"
          name="stay"
          text="الإقامة"
          active={activeLink === "stay"}
        />
        <BarButton
          id="ratings"
          name="ratings"
          text="تقييمات العملاء"
          active={activeLink === "ratings"}
        />
        <BarButton
          id="terms"
          name="terms"
          text="شروط و أحكام"
          active={activeLink === "terms"}
        />
        <BarButton
          id="faq"
          name="faq"
          text="أسئلة شائعة"
          active={activeLink === "faq"}
        />
      </div>
    </div>
  );
};

export default ProgramInfoBar;
