import React, { useState } from "react";
import TourButton from "./helpers/TourButton";

const ToursBar = ({ buttons, trips, onFilteredTrips }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const filterTrips = (filterName) => {
    setSelectedFilter(filterName);
    
    if (filterName === "all") {
      onFilteredTrips(trips);
      return;
    }

    let filteredTrips = [];

    switch (filterName) {
      case "trabzon":
        filteredTrips = trips.filter(trip => 
          trip.node.provinces.some(province => 
            province.name.toLowerCase() === "trabzon"
          )
        );
        break;
      
      case "İstanbul":
        filteredTrips = trips.filter(trip => 
          trip.node.provinces.some(province => 
            province.name.toLowerCase() === "istanbul" || 
            province.name.toLowerCase() === "İstanbul"
          )
        );
        break;
      
      case "antalya":
        filteredTrips = trips.filter(trip => 
          trip.node.provinces.some(province => 
            province.name.toLowerCase() === "antalya"
          )
        );
        break;
      
      case "kapadokya":
        filteredTrips = trips.filter(trip => 
          trip.node.provinces.some(province => 
            province.name.toLowerCase().includes("kapadokya") ||
            province.name.toLowerCase().includes("nevşehir") ||
            province.name.toLowerCase().includes("cappadocia")
          )
        );
        break;
      
      case "groups":
        // Filter for group trips (assuming groupSize > 1 or specific tags)
        filteredTrips = trips.filter(trip => 
          trip.node.groupSize > 1 || 
          trip.node.tags.some(tag => 
            tag.includes("جماعية") || 
            tag.includes("group") || 
            tag.includes("مجموعة")
          )
        );
        break;
      
      default:
        filteredTrips = trips;
    }

    onFilteredTrips(filteredTrips);
  };

  return (
<div className="mt-8 px-2 w-full md:w-1/2 md:m-auto md:mt-8">
  <div className="bg-orange p-2 rounded-full flex flex-wrap justify-center ">
    <TourButton
      key="all"
      name="all"
      text="الكل"
      isActive={selectedFilter === "all"}
      onClick={() => filterTrips("all")}
    />

    {buttons.map((b, i) => (
      <TourButton
        key={i}
        name={b.name}
        text={b.text}
        isActive={selectedFilter === b.name}
        onClick={() => filterTrips(b.name)}
      />
    ))}
  </div>
</div>


  );
};

export default ToursBar;