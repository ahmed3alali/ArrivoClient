// pages/travels-programs/programs/index.jsx
import React, { useState, useMemo } from "react";
import ReactModal from "react-modal";
import { gql, useQuery } from "@apollo/client";
import FilterBar from "../../../components/FilterBar";
import ProgramsMainBody from "./ProgramsMainBody";

ReactModal.setAppElement("#__next");

const GET_TRIPS = gql`
query {
trips(lengthType: MULTI_DAY) {
  edges {
    node {
      ... on MultiDayTripNode {
        id
        title
        description

        offerType
       
        price
        durationHours
        offerType
        price
        conditionText
        
           thumbnails{
          id
          image
        }
        cardThumbnail
        
      
        groupSize
        provinces{
          id
          name
        }
        commonQuestions{
          id
          question
        }

        

        visitLocationHighlights{
          id
          title
        }

        conditions{
        
        id 

        }


        
        content{
          
          id
          title
          icon
          description

          

          
        }
        
        placesOfResidence{
          id
          title
          location
          
        }
        
        galleryImages{
          
          id
          title
          picture
        }
        
        tripType
        
        
        subTypes{
          id
          type
        }
        
       tags

       dayPrograms {
          title
          subTitle
          description
          residenceName
          destination {
            id
            title
          }
          activities{
            edges
            {
              node{
                id
                title
              }
            }
          }
          subDestinations {
            id
            title
          }
          visitHighlights {
            __typename
            ... on SubDestinationNode {
              id
              title
              destination {
                id
                title
              }
            }
          }
        }
        
      

    
      }
    }
  }
}
}

`;

const parseGroupSize = (groupSize) => {
  if (!groupSize) return null;
  const [from, to] = groupSize.split("-").map(Number);
  if (!isNaN(from) && !isNaN(to)) return { from, to };
  if (!isNaN(from)) return { from, to: from };
  return null;
};

const filterTrips = (trips, filters) => {
  return trips.filter(({ node: trip }) => {
    const price = parseFloat(trip.price);
    const duration = parseFloat(trip.durationHours);
    const gs = parseGroupSize(trip.groupSize);

    if (isNaN(price) || isNaN(duration)) return false;

    if (
      price < filters.priceRange.minPrice ||
      price > filters.priceRange.maxPrice
    )
      return false;

    if (duration > filters.days) return false;

    if (
      gs &&
      (gs.to < filters.numberPersons.minSize ||
        gs.from > filters.numberPersons.maxSize)
    )
      return false;

    return true;
  });
};

const Programs = () => {
  const { data, loading, error } = useQuery(GET_TRIPS);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    days: 20,
    numberPersons: { minSize: 1, maxSize: 7 },
    priceRange: { minPrice: 0, maxPrice: 5000 },
  });

  const trips = data?.trips?.edges || [];

  const tripsMemo = useMemo(() => data?.trips?.edges || [], [data?.trips?.edges]);

  const filteredTrips = useMemo(
    () => filterTrips(tripsMemo, filters),
    [tripsMemo, filters]
  );
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) return <p>Error loading trips</p>;

  return (
    <>
      <button onClick={() => setModalIsOpen(true)} className="filter-button">
        Open Filters
      </button>

      <ProgramsMainBody filteredTrips={filteredTrips} />

      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Filters Modal"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.5)" },
          content: { maxWidth: "600px", margin: "auto" },
        }}
      >
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          closeModal={() => setModalIsOpen(false)}
          filteredWithoutType={trips}
        />
      </ReactModal>
    </>
  );
};

export default Programs;
