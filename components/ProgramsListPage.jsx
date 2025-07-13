import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useQuery, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import ProgramsBanner from '../pages/travels-programs/programs/ProgramsBanner';

const GET_TRIPS = gql`
  query GetMultiDayTrips {
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
            cardThumbnail
            groupSize
            provinces {
              id
              name
            }
            tripType
          }
        }
      }
    }
  }
`;

const ProgramsListPage = () => {
  const router = useRouter();
  
  // All hooks must be called in the same order every time
  const { loading, error, data } = useQuery(GET_TRIPS);
  
  // Filters state - all useState hooks called at the top level
  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [durationRange, setDurationRange] = useState([1, 20]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [tripType, setTripType] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Helpers
  const getDaysFromHours = useCallback((hours) => Math.ceil(hours / 24), []);

  // Collect available countries from data
  const availableCountries = useMemo(() => {
    if (!data?.trips?.edges) return [];
    const setCountries = new Set();
    data.trips.edges.forEach(({ node }) => {
      node.provinces?.forEach(({ name }) => setCountries.add(name.toLowerCase()));
    });
    return Array.from(setCountries).sort();
  }, [data]);

  // Calculate filter ranges dynamically based on data
  const filterRanges = useMemo(() => {
    if (!data?.trips?.edges) {
      return { minPrice: 0, maxPrice: 10000, minDays: 1, maxDays: 20 };
    }
    const trips = data.trips.edges.map(({ node }) => node);
    const prices = trips.map(t => parseInt(t.price) || 0).filter(p => p > 0);
    const days = trips.map(t => getDaysFromHours(t.durationHours)).filter(d => d > 0);

    return {
      minPrice: Math.min(...prices) || 0,
      maxPrice: Math.max(...prices) || 10000,
      minDays: Math.min(...days) || 1,
      maxDays: Math.max(...days) || 20
    };
  }, [data, getDaysFromHours]);

  // Filter trips based on current filters
  const filteredTrips = useMemo(() => {
    if (!data?.trips?.edges) return [];
    if (!filtersEnabled) return data.trips.edges;

    const keyword = typeof router.query.title === 'string' ? router.query.title.toLowerCase() : '';

    return data.trips.edges.filter(({ node }) => {
      const days = getDaysFromHours(node.durationHours);
      const price = parseInt(node.price) || 0;

      if (days < durationRange[0] || days > durationRange[1]) return false;
      if (price > 0 && (price < priceRange[0] || price > priceRange[1])) return false;
      if (tripType && node.tripType !== tripType) return false;
      if (
        selectedCountry &&
        node.provinces &&
        !node.provinces.some(({ name }) => name.toLowerCase().includes(selectedCountry))
      ) return false;
      if (keyword && !node.title?.toLowerCase().includes(keyword)) return false;

      return true;
    });
  }, [data, filtersEnabled, durationRange, priceRange, tripType, selectedCountry, router.query.title, getDaysFromHours]);

  // Reset filters to defaults based on data ranges and clear URL params
  const resetFilters = useCallback(() => {
    setDurationRange([filterRanges.minDays, filterRanges.maxDays]);
    setPriceRange([filterRanges.minPrice, filterRanges.maxPrice]);
    setTripType('');
    setSelectedCountry('');
    setFiltersEnabled(false);
    router.push('/travels-programs', undefined, { shallow: true });
  }, [filterRanges, router]);

  // Arabic helper for group size text
  const createPersonsArabic = useCallback((groupSize) => {
    if (!groupSize) return '';
    return `${groupSize} أشخاص`;
  }, []);

  // Sync filters with URL query params once router is ready
  // This useEffect must always be called, no conditional returns before it
  useEffect(() => {
    if (!router.isReady || isInitialized) return;
  
    const { country, type, title } = router.query;
  
    if (typeof country === 'string') {
      setSelectedCountry(country.toLowerCase());
      setFiltersEnabled(true);
    }
  
    if (typeof type === 'string') {
      if (type.toLowerCase() === 'private') setTripType('PRIVATE');
      else if (type.toLowerCase() === 'driver') setTripType('WITH_DRIVER');
    }
  
    if (title) {
      setFiltersEnabled(true);
    }
    
    setIsInitialized(true);
  }, [router.isReady, router.query, isInitialized]);

  // Render loading state - but don't return early to avoid hook order issues
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <h3 className="text-lg font-semibold mb-2">خطأ في تحميل البيانات</h3>
        <p>{error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8" dir="rtl">
        {/* Sidebar Filters */}
        <aside className="bg-white rounded-2xl shadow p-6 border border-gray-200 flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">بحث متقدم</h2>
            <button
              onClick={resetFilters}
              className="text-orange-500 hover:underline text-sm"
              aria-label="Reset Filters"
            >
              إعادة تعيين
            </button>
          </div>

          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium">تفعيل الفلاتر</span>
            <input
              type="checkbox"
              checked={filtersEnabled}
              onChange={(e) => setFiltersEnabled(e.target.checked)}
              aria-checked={filtersEnabled}
            />
          </label>

          {/* Duration Range */}
          <div>
            <label htmlFor="durationRange" className="block mb-1 text-sm font-medium">
              مدة الرحلة: حتى {durationRange[1]} يوم
            </label>
            <input
              id="durationRange"
              type="range"
              min={filterRanges.minDays}
              max={filterRanges.maxDays}
              value={durationRange[1]}
              onChange={(e) => setDurationRange([durationRange[0], Number(e.target.value)])}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{filterRanges.minDays} يوم</span>
              <span>{filterRanges.maxDays} يوم</span>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="priceRange" className="block mb-1 text-sm font-medium">
              سعر الرحلة: حتى ${priceRange[1]}
            </label>
            <input
              id="priceRange"
              type="range"
              min={filterRanges.minPrice}
              max={filterRanges.maxPrice}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>${filterRanges.minPrice}</span>
              <span>${filterRanges.maxPrice}</span>
            </div>
          </div>

          {/* Trip Type */}
          <fieldset>
            <legend className="text-sm font-medium mb-2">نوع الرحلة</legend>
            <div className="flex flex-col gap-2">
              {[
                { value: '', label: 'الكل' },
                { value: 'PRIVATE', label: 'رحلة خاصة' },
                { value: 'WITH_DRIVER', label: 'رحلة مع سائق' }
              ].map(({ value, label }) => (
                <label key={value} className="flex items-center gap-2 cursor-pointer" htmlFor={`tripType-${value || 'all'}`}>
                  <input
                    type="radio"
                    id={`tripType-${value || 'all'}`}
                    name="tripType"
                    value={value}
                    checked={tripType === value}
                    onChange={() => setTripType(value)}
                    className="cursor-pointer"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Country */}
          <fieldset>
            <legend className="text-sm font-medium mb-2">المنطقة</legend>
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              <label className="flex items-center gap-2 cursor-pointer" htmlFor="country-all">
                <input
                  type="radio"
                  id="country-all"
                  name="country"
                  value=""
                  checked={selectedCountry === ''}
                  onChange={() => setSelectedCountry('')}
                />
                <span>الكل</span>
              </label>
              {availableCountries.slice(0, 20).map((country) => (
                <label
                  key={country}
                  className="flex items-center gap-2 cursor-pointer capitalize"
                  htmlFor={`country-${country}`}
                >
                  <input
                    type="radio"
                    id={`country-${country}`}
                    name="country"
                    value={country}
                    checked={selectedCountry === country}
                    onChange={() => setSelectedCountry(country)}
                  />
                  <span>{country}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="text-sm text-gray-600">
            نتائج: {filteredTrips.length} من أصل {data?.trips?.edges.length || 0} رحلة
          </div>
        </aside>

        {/* Main Trips Listing */}
        <main>
          <h1 className="text-3xl font-bold text-center mb-8">
            البرامج السياحية {selectedCountry && <span className="text-orange-500">- {selectedCountry}</span>}
          </h1>

          {filteredTrips.length === 0 ? (
            <div className="text-center py-16">
              <p className="mb-6 text-gray-500 text-lg">لا توجد رحلات تطابق المعايير المحددة</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map(({ node }) => (
                <Link
                  key={node.id}
                  href={`/travels-programs/${node.id}`}
                  passHref
                  legacyBehavior
                >
                  <a
                    className="block rounded-2xl shadow hover:shadow-lg transition border border-gray-200 overflow-hidden bg-white flex flex-col"
                    aria-label={`عرض تفاصيل الرحلة: ${node.title}`}
                  >
                    <div className="relative w-full aspect-video">
                      <Image
                        src={node.cardThumbnail || '/placeholder.jpg'}
                        alt={node.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={false}
                      />
                      {node.offerType && (
                        <span className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold select-none">
                          {node.offerType}
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h2 className="text-lg font-bold mb-2 line-clamp-1">{node.title}</h2>
                      <p className="text-sm text-gray-600 line-clamp-3 flex-grow">{node.description}</p>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-xl font-extrabold text-orange-600">${node.price}</p>
                        <p className="text-xs text-gray-500">{createPersonsArabic(node.groupSize)}</p>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>

      <ProgramsBanner />
    </>
  );
};

export default ProgramsListPage;