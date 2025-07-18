import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Image from "next/image";
import Link from "next/link";

const GET_TRIP_PACKAGES = gql`

query GetTripPackages($tripId: ID!) {
  tripPackages(tripId: $tripId) {
    edges {
      node {
        id
        price
        groupSize
        startDate
        endDate
      }
    }
  }
  trip(id: $tripId) {
    ... on MultiDayTripNode {
      durationHours
    }
  }
}
`;



const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  // Arabic month name only
  const monthFormatter = new Intl.DateTimeFormat("ar-EG", { month: "long" });
  const arabicMonth = monthFormatter.format(endDate); // or startDate

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  const yearPart = sameYear ? "" : ` ${endDate.getFullYear()}`;

  return `${startDay} - ${endDay} ${arabicMonth}${yearPart}`;
};

const groupPackagesByGroupSizeAndMonth = (packages, durationHours) => {
  const durationDays = Math.ceil(durationHours / 24); 
  console.log(durationDays);
console.log(durationHours);
  
  // Convert hours to full days
  const groups = {};

  packages.forEach((pkg) => {
    const groupKey = pkg.groupSize;
    const startDate = new Date(pkg.startDate);
    const endDate = new Date(pkg.endDate);

    if (!groups[groupKey]) groups[groupKey] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const rangeStart = new Date(currentDate);
      const rangeEnd = new Date(currentDate);
      rangeEnd.setDate(rangeEnd.getDate() + durationDays - 1);
    
      // Stop if the range end exceeds the package's end date
      if (rangeEnd > endDate) break;
    
      const startDay = rangeStart.getDate().toString().padStart(2, "0");
      const endDay = rangeEnd.getDate().toString().padStart(2, "0");
    
      const monthFormatter = new Intl.DateTimeFormat("ar-EG", {
        month: "long",
      });
      const arabicMonth = monthFormatter.format(rangeStart);
    
      const sameYear = rangeStart.getFullYear() === rangeEnd.getFullYear();
      const yearPart = sameYear ? "" : ` ${rangeEnd.getFullYear()}`;
    
      const rangeLabel = `${startDay} - ${endDay} ${arabicMonth}${yearPart}`;
    
      const monthKey = rangeStart.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
      });
    
      let month = groups[groupKey].find((m) => m.monthN === monthKey);
      if (!month) {
        month = { monthN: monthKey, datesDays: [] };
        groups[groupKey].push(month);
      }
    
      month.datesDays.push({
        day: rangeLabel,
        price: pkg.price,
      });
    
      // ✅ Increment by durationDays instead of 1
      currentDate.setDate(currentDate.getDate() + durationDays);
    }
    
  });

  return Object.entries(groups).map(([numberOfPeople, datesMonths]) => ({
    numberOfPeople,
    datesMonths,
  }));
};

const PersonsBar = ({ options, selected, onSelect }) => (
  <div className="px-2 w-fit md:mx-auto">
    <div className="overflow-x-scroll scrollbar-hide">
      <div className="flex bg-orange p-[4px] rounded-[40px]">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt)}
            className={`outline-none py-[8px] px-[8px] sm:px-[16px] h-[40px] text-[12px] sm:text-[16px] text-black rounded-[32px] flex items-center justify-center ${
              selected.numberOfPeople === opt.numberOfPeople &&
              "text-black bg-white"
            }`}
          >
            {opt.numberOfPeople} شخص
          </button>
        ))}
      </div>
    </div>
  </div>
);

const TimingsAndPrices = () => {
  const router = useRouter();
  const { program_id } = router.query;
  const [structuredData, setStructuredData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const { loading, error, data } = useQuery(GET_TRIP_PACKAGES, {
    variables: { tripId: program_id },
    skip: !program_id,
  });

  useEffect(() => {
    if (data?.tripPackages?.edges && data?.trip?.durationHours) {
      const allPackages = data.tripPackages.edges.map((e) => e.node);
      const grouped = groupPackagesByGroupSizeAndMonth(allPackages, data.trip.durationHours);
      setStructuredData(grouped);
      setSelectedGroup(grouped[0]);
    }
  }, [data]);
  

  const handleSelectGroup = (group) => setSelectedGroup(group);

  const breadcrumbs = [
    { name: "الصفحة الرئيسية", path: "/" },
    {
      name: "التوفر والأسعار",
      path: `/travels-programs/${program_id}/timings-prices`,
    },
  ];

  return (
    <div className="py-[56px]">
      <div className="wrapper">
        <div className="flex flex-col items-center gap-[40px]">
          <Link
            href={"/"}
            className="w-full text-end text-[#475467] flex justify-end gap-[8px]"
          >
            رجوع
            <Image src="/icons/arrow.png" height={20} width={20} alt="/" />
          </Link>

          {/* Breadcrumbs (optional) */}
          <h2 className="hidden sm:block text-[24px] sm:text-[36px] md:text-[56px] lg:[48px] font-bold-600">
            المواعيد والأسعار
          </h2>

          {structuredData.length > 0 && (
            <PersonsBar
              options={structuredData}
              selected={selectedGroup}
              onSelect={handleSelectGroup}
            />
          )}

          {selectedGroup ? (
            <div className="w-full flex flex-col lg:px-20">
              {selectedGroup.datesMonths.map((month, idx) => (
                <div key={idx}>
                  <h3 className="bg-[#F4F7FD] p-[16px] font-bold text-[12px] sm:text-[16px]">
                    {month.monthN}
                  </h3>
                  <ul>
                    {month.datesDays.map((d, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center py-[20px]"
                        style={{
                          borderBottom:
                            "1px solid rgba(152, 162, 179, 0.25)",
                        }}
                      >
                        <span className="w-1/3 text-[12px] sm:text-[16px]">
                          {d.day}
                        </span>
                        <span className="w-1/3 text-[14px] sm:text-[20px] font-bold">
                          ${d.price}
                        </span>
                        <button className="sm:w-[140px] py-[8px] px-[12px] sm:py-[14px] sm:px-[20px] text-[#F08631] border-[1px] border-[#F08631] rounded-[32px] duration-200 hover:bg-[#F08631] hover:text-white text-[12px] sm:text-[16px]">
                          إتصل للحجز
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center mt-8">
              {loading
                ? "جاري تحميل البيانات..."
                : "لا توجد باقات متاحة لهذه الرحلة."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimingsAndPrices;
