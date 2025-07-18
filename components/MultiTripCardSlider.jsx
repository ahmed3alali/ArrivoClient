import React, { useRef } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import MultiDayTripCard from './MultiDayTripCard';

const MultiTripCardSlider = ({ trips , isSingle = false }) => {
  const isSingleCard = trips.length === 1;
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
    scrollRef.current.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      {trips.length > 1 && (
        <button
          onClick={() => scroll('left')}
          className=" sm:flex items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 rounded-full w-10 h-10"
        >
          <ChevronLeft className="text-gray-600 mr-2 md:mr-0 lg:mr-0" />
        </button>
      )}

      {/* Slider */}
      <div
        ref={scrollRef}
        className={`
          flex gap-4 overflow-x-auto px-4 py-6 scroll-smooth
          scrollbar-hide snap-x snap-mandatory
          ${isSingleCard ? 'justify-center' : ''}
        `}
      >
        {trips.map(({node}) => (
          <MultiDayTripCard
     
            trip={node}
            isSingle={isSingleCard}
          
          />
        ))}
      </div>

      {/* Right Arrow */}
      {trips.length > 1 && (
        <button
          onClick={() => scroll('right')}
          className=" sm:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-100 rounded-full w-10 h-10"
        >
          <ChevronRight className="text-gray-600 mr-2 md:mr-0 lg:mr-0" />
        </button>
      )}
    </div>
  );
};

export default MultiTripCardSlider;
