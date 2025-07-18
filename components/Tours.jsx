import React, { useState, useEffect } from "react";

import OneDayTripCard from "./OneDayTripCard";


import ToursBar from "../components/tours/ToursBar"
import OneTripCardSlider from "./OneTripCardSlider";
import LoaderExternal from "./LoadingExternal";
const Tours = () => {
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const buttons = [
    { name: "Trabzon", text: "طرابزون" },
    { name: "İstanbul", text: "اسطنبول" },
    { name: "antalya", text: "انطاليا" },
    //{ name: "groups", text: "رحلات جماعية" },
    //{ name: "kapadokya", text: "كبودكيا" },
  ];

  // Fetch trips data (replace with your actual GraphQL query)
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Your GraphQL query here
        const query = `
          query {
            trips(lengthType: ONE_DAY) {
              edges {
                node {
                  ... on OneDayTripNode {
                    id
                    title
                    description
                    durationHours
                    thumbnail
                    cardThumbnail
                    price
                    groupSize
                    tags
                    offerType
                    galleryImages {
                      id
                      title
                      picture
                    }
                    activities {
                      id
                    }
                    provinces {
                      id
                      name
                    }
                  }
                }
              }
            }
          }
        `;

        // Replace with your actual GraphQL endpoint
        const response = await fetch('/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        const trips = data.data.trips.edges;
        
        setAllTrips(trips);
        setFilteredTrips(trips); // Initially show all trips
        setLoading(false);
      } catch (error) {
        console.error('Error fetching trips:', error);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleFilteredTrips = (trips) => {
    setFilteredTrips(trips);
  };

  if (loading) {
    return  <LoaderExternal/>;
  }

  return (
    <div>

<div className="titles-container flex flex-col mt-8">

<p className="m-auto text-orange">سيارة مع سائق</p>
<h2 className="text-[24px] sm:text-[48px] md:text-[36px] font-bold-600 m-auto mb-8">الرحلات السياحية
</h2>

<p className="m-auto text-gray-500 text-[10px] md:text-[15px]">تجربة سياحية مميزة مع سائق خاص لتذهب إلى الأماكن السياحية الرائعة<br></br> بكل راحة وأمان. احجز رحلتك الآن واستمتع بتجربة فريدة من نوعها.</p>

</div>


      <ToursBar
        buttons={buttons}
        trips={allTrips}
        onFilteredTrips={handleFilteredTrips}
      />
      
      <div className="mt-8 w-full">
  {filteredTrips.length === 0 ? (
    <div className="col-span-full text-center py-8">
      <p className="text-gray-500">لا توجد رحلات متاحة لهذا التصنيف</p>
    </div>
  ) : filteredTrips.length === 1 ? (
    <div className="flex justify-center w-full">
      <OneDayTripCard trip={filteredTrips[0]} isSingle={true} />
    </div>
  ) : (
    <div className="w-full">
      <OneTripCardSlider trips={filteredTrips} isSingle={false} />
    </div>
  )}
</div>


    </div>
  );
};

export default Tours;