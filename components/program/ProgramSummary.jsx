import React, { useEffect, useState } from "react";
import TripInfo from "./TripInfo";
import TripPlaces from "./TripPlaces";
import TripContent from "./TripContent";
import TripLocationsSlider from "./TripLocationsSlider";

const ProgramSummary = ({ isProgramTravel, trip }) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsSmallScreen(window.innerWidth < 1024);
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div id="summary">
      <TripInfo trip={trip} />
      {isSmallScreen ? (
        <TripLocationsSlider isSmallScreen={isSmallScreen} />
      ) : (
        <TripPlaces trip={trip} />
      )}
      {isProgramTravel && <TripContent trip={trip} />}
    </div>
  );
};

export default ProgramSummary;
