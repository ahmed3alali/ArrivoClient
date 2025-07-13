const useTravelFilters = (filters, data) => {
  if (!data) return { filteredWithType: [], filteredWithoutType: [] };

  const filteredWithoutType = data.filter(trip => {
    const price = parseFloat(trip.price || 0);
    const days = trip.durationHours ? Math.ceil(trip.durationHours / 24) : 1;
    const groupSize = trip.groupSize;

    const isPriceValid =
      price >= filters.priceRange.minPrice &&
      price <= filters.priceRange.maxPrice;

    const isDaysValid = days <= filters.days;

    const isGroupSizeValid =
      groupSize === null || // allow nulls
      (typeof groupSize === "number"
        ? groupSize >= filters.numberPersons.minSize &&
          groupSize <= filters.numberPersons.maxSize
        : true);

    const isCountryValid =
      !filters.country ||
      trip.provinces.some(p =>
        p.name.toLowerCase().includes(filters.country.toLowerCase())
      );

    return isPriceValid && isDaysValid && isGroupSizeValid && isCountryValid;
  });

  const filteredWithType = filteredWithoutType.filter(
    trip =>
      !filters.mainType ||
      trip.subTypes?.some(st => st.type === filters.mainType)
  );

  return { filteredWithType, filteredWithoutType };
};

export default useTravelFilters;
