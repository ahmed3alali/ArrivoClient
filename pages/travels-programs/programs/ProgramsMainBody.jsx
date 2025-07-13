// components/programsMainBodyComponents/ProgramsMainBody.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

const ProgramsMainBody = ({ filteredTrips }) => {
  if (!filteredTrips.length)
    return <p style={{ padding: "20px" }}>No trips found.</p>;

  return (
    <div className="programs-list" style={{ padding: "20px" }}>
      {filteredTrips.map(({ node: trip }) => (
        <div
          key={trip.id}
          className="trip-card"
          style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {trip.cardThumbnail && (
            <Image
              src={trip.cardThumbnail}
              alt={trip.title}
              width={600}
              height={300}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          )}
          <h3>{trip.title}</h3>
          <p>{trip.description}</p>
          <p>
            <b>Price:</b> {trip.price}
          </p>
          <p>
            <b>Duration:</b> {trip.durationHours} hours
          </p>
          <p>
            <b>Group size:</b> {trip.groupSize || "Not specified"}
          </p>
          <Link
            href={`/travels-programs/${trip.id}`}
            className="details-link"
            style={{ color: "#1e90ff", textDecoration: "underline" }}
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProgramsMainBody;