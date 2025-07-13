import React, { useEffect, useRef, useState } from "react";

const SenjaReviews = () => {
  const widgetRef = useRef(null);
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const SCRIPT_ID = "senja-widget-script";
    
    function loadScript() {
      return new Promise((resolve, reject) => {
        if (document.getElementById(SCRIPT_ID)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://widget.senja.io/widget/99859872-0f6f-4b86-93c5-dd9f95dc0003/platform.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.body.appendChild(script);
      });
    }

    async function initWidget() {
        await loadScript();
      
        setTimeout(() => {
          if (window.Senja && typeof window.Senja.renderWidget === "function") {
            window.Senja.renderWidget(widgetRef.current);
      
            setTimeout(() => {
              const widget = widgetRef.current;
              const custom = document.getElementById("custom-senja-container");
              if (!widget || !custom) return;
      
              // Get all review elements
              const reviews = Array.from(
                widget.querySelectorAll(
                  '.senja-review, [data-testid="review"], .review-item, .review, [class*="review"]'
                )
              );
      
              if (reviews.length > 0) {
                // Pick 3 random reviews
                const shuffled = reviews.sort(() => 0.5 - Math.random());
                const selected = shuffled.slice(0, 3);
      
                // Clear custom container
                custom.innerHTML = "";
      
                selected.forEach((review) => {
                  const clone = review.cloneNode(true);
                  clone.style.minWidth = "300px";
                  clone.style.maxWidth = "350px";
                  clone.style.flexShrink = "0";
                  clone.style.marginRight = "1rem";
                  custom.appendChild(clone);
                });
      
                // Hide the original widget
                widget.style.display = "none";
              }
            }, 800); // Allow time for rendering
          }
        }, 100);
      }
      
      

    initWidget();
  }, []);

  const scrollBy = (distance) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: distance, behavior: "smooth" });
  };

  const onScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", onScroll);
    onScroll();
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative w-full border-black">
     
      

      {/* Horizontal scrollable container */}
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide px-8 border-[0.5px] py-4 border-grey rounded-md"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maxHeight: '400px', // Limit height to force horizontal scrolling
        }}
      >
        <div
          ref={widgetRef}
          className="senja-embed"
          data-id="99859872-0f6f-4b86-93c5-dd9f95dc0003"
          data-mode="shadow"
          data-lazyload="false"
          style={{
            width: 'max-content',
            minWidth: '100%',
          }}
        ></div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        .senja-embed * {
          box-sizing: border-box;
        }
        
        /* Force horizontal layout for common widget structures */
        .senja-embed [class*="grid"],
        .senja-embed [class*="flex"] {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: max-content !important;
        }
        
        .senja-embed [class*="review"] {
          min-width: 300px !important;
          max-width: 350px !important;
          flex-shrink: 0 !important;
          margin-right: 1rem !important;
        }
      `}</style>
</div>
  );
};

export default SenjaReviews;